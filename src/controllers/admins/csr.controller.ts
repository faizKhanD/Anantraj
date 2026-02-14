import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../utils/s3";

import CsrListModel from "../../models/csrlist.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { tryEach } from "async";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";

import { AwardSchema } from "../../validation/admin/award.validate";
import { CSRRequestBody, CSRResponseBody } from "../../interfaces/csr.interface";
import { CsrSchema } from "../../validation/admin/csr.validate";

interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const Store = asyncHandler(
  async (
    req: MulterRequest<CSRRequestBody>,
    res: Response<CSRResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = AwardSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const file = (req.file as Express.MulterS3.File)?.key || null;
      const blogData: CSRRequestBody = req.body;
      const { title, description, alt_txt } = blogData;
      const response = await CsrListModel.create({
        title,
        description,
        file,
        status: 1,
        alt_txt,
      });

      if (response.file) {
        response.file = await getPresignedUrl(response.file, 60 * 60 * 24); // 24h
      }

      successResponse(res, "CSr List Added successfully", response);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Update = asyncHandler(
  async (
    req: MulterRequest<CSRRequestBody> & { params: { id: string } },
    res: Response<CSRResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = CsrSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const response = await CsrListModel.findByPk(id);
      if (!response) {
        next({
          status: 404,
          message: "Csr List Not Found",
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || response?.file;

      const requedtData: CSRRequestBody = req.body;
      const { title, description, alt_txt, status } = requedtData;

      await CsrListModel.update(
        {
          title,
          description,
          file,
          alt_txt,
          status,
        },
        {
          where: { id },
        }
      );

      if (response?.file) {
        response.file = await getPresignedUrl(response.file, 60 * 60 * 24); // 24h
      }

   
      successResponse(res, "Csr List Updated Succssfully", response);

    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Delete = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const award = await CsrListModel.findByPk(id);
      if (!award) {
        next({
          status: 404,
          message: "Csr List Not Found",
        });
      }

      await CsrListModel.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "Csr list Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Index = asyncHandler(
  async (req: Request<{}, {}>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const where: any = {};

      if (search) {
        where[Op.or] = ["title"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }
      const response = await CsrListModel.findAndCountAll({
        where,
        limit,
        offset,
      });

      const result = await Promise.all(
        response.rows.map(async (data: any) => {
          let imageUrl = null;
          if (data.file) {
            imageUrl = await getPresignedUrl(data.file, 60 * 60 * 24); // 24h
          }
          return { ...data.toJSON(), imageUrl };
        })
      );

      const totlaRecords = response.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "csr list retrieved successfully", {
        data: result,
        pagination: {
          totlaRecords,
          totalPages,
          page: page,
          limit: limit,
        },
      });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<CSRRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await CsrListModel.findByPk(id, {
        attributes: ["id", "title", "status", "description", "file", "alt_txt"],
      });

      if (response?.file) {
        response.file = await getPresignedUrl(response.file, 60 * 60 * 24); // 24h
      }

      if (response?.file) {
        response.file = await getPresignedUrl(response.file, 60 * 60 * 24); // 24h
      }

      if (!response) {
        next({
          status: 404,
          message: "csr list Not Found",
        });
      }
      successResponse(res, "Success", response);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
