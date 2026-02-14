import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../utils/s3";
import AwardModel from "../../models/award.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { tryEach } from "async";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import {
  AwardRequestBody,
  AwardResponseBody,
} from "../../interfaces/award.interface";
import { AwardSchema } from "../../validation/admin/award.validate";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";

interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const Store = asyncHandler(
  async (
    req: MulterRequest<AwardRequestBody>,
    res: Response<AwardResponseBody>,
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
      const blogData: AwardRequestBody = req.body;
      const { year, title, description, alt_txt } = blogData;
      const blog = await AwardModel.create({
        year,
        title,
        description,
        file,
        status: 1,
        alt_txt,
      });

      let imageUrl: string | null = null;

      if (blog?.file) {
        blog.file = await getPresignedUrl(blog.file, 60 * 60 * 24);
      }
      const Records = {
        ...blog?.toJSON(),
      };

      successResponse(res, "Award created successfully", Records);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Update = asyncHandler(
  async (
    req: MulterRequest<AwardRequestBody> & { params: { id: string } },
    res: Response<AwardResponseBody>,
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
      const { id } = req.params;
      const award = await AwardModel.findByPk(id);
      if (!award) {
        next({
          status: 404,
          message: "Award Not Found",
        });
      }

      if (req.file && award?.file) {
        await deleteFileFromS3(award?.file);
      }

      const file = (req.file as Express.MulterS3.File)?.key || award?.file;

      const requedtData: AwardRequestBody = req.body;
      const { year, title, description, alt_txt, status } = requedtData;

      await AwardModel.update(
        {
          year,
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
      next({
        status: 200,
        message: "Award Updated Succssfully",
      });
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
      const award = await AwardModel.findByPk(id);
      if (!award) {
        next({
          status: 404,
          message: "Award Not Found",
        });
      }

      if (award?.file) {
        await deleteFileFromS3(award?.file);
      }
      await AwardModel.destroy({
        where: { id },
      });

      if (award?.file) {
        await deleteFileFromS3(award?.file);
      }

      next({
        status: 200,
        message: "Award Deleted Successfully",
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

      const award = await AwardModel.findAndCountAll({
        where,
        limit,
        offset,
      });

      const result = await Promise.all(
        award.rows.map(async (data: any) => {
          let imageUrl = null;
          if (data.file) {
            data.file = await getPresignedUrl(data.file, 60 * 60 * 24); // 24h
          }
          return { ...data.toJSON(), imageUrl };
        })
      );

      const totlaRecords = award.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "award retrieved successfully", {
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
    res: Response<AwardResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const award = await AwardModel.findByPk(id);

      if (award?.file) {
        award.file = await getPresignedUrl(award.file, 60 * 60 * 24); // 24h
      }

      if (!award) {
        next({
          status: 404,
          message: "award Not Found",
        });
      }
    
      if (award?.file) {
        award.file = await getPresignedUrl(award.file, 60 * 60 * 24); // 24h
      }

      
      successResponse(res, "Success", award);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
