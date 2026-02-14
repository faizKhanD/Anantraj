import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../utils/s3";
import ConstructionProjectModel from "../../models/construction_projects.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { Op } from "sequelize";
import {
  ConstructionUpdateRequestBody,
  ConstructionUpdateResponseBody,
} from "../../interfaces/construction_update.interface";
import { ConstructionUpdateSchema } from "../../validation/admin/construction_update.validate";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import { paginate } from "../../utils/paginate.util";
import { DeleteConstructionUpdateSubProjectByParentId } from "./construction_update_sub_projects.controller";

interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const Store = asyncHandler(
  async (
    req: MulterRequest<ConstructionUpdateRequestBody>,
    res: Response<ConstructionUpdateResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = ConstructionUpdateSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const file = (req.file as Express.MulterS3.File)?.key || null;
      const payload: ConstructionUpdateRequestBody = req.body;
      const { title,platter_id } = payload;
      const datata = await ConstructionProjectModel.create({
        title,
       platter_id,
        file,
        status: 1
      });

      if (datata?.file) {
        datata.file = await getPresignedUrl(datata.file, 60 * 60 * 24);
      }
      const Records = {
        ...datata?.toJSON(),
      };

      successResponse(res, "Consruction Project created successfully", Records);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Update = asyncHandler(
  async (
    req: MulterRequest<ConstructionUpdateRequestBody> & { params: { id: string } },
    res: Response<ConstructionUpdateResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = ConstructionUpdateSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const data = await ConstructionProjectModel.findByPk(id);
      if (!data) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      if (req.file && data?.file) {
        await deleteFileFromS3(data?.file);
      }
      const file = (req.file as Express.MulterS3.File)?.key || data?.file;

      const requedtData: ConstructionUpdateRequestBody = req.body;
      const {  title,platter_id  } = requedtData;

      await ConstructionProjectModel.update(
        {
          title,
          platter_id,
          file,
        },
        {
          where: { id },
        }
      );
      next({
        status: 200,
        message: "Record Updated Succssfully",
      });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Destroy = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const data = await ConstructionProjectModel.findByPk(id);
      if (!data) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }
      await DeleteConstructionUpdateSubProjectByParentId(id);
      if (data?.file) {
        await deleteFileFromS3(data?.file);
      }
      
      await ConstructionProjectModel.destroy({
        where: { id },
      });

      if (data?.file) {
        await deleteFileFromS3(data?.file);
      }

      next({
        status: 200,
        message: "Record Deleted Successfully",
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

      const data = await ConstructionProjectModel.findAndCountAll({
        where,
        limit,
        offset,
      });

      const result = await Promise.all(
        data.rows.map(async (data: any) => {
          let imageUrl = null;
          if (data.file) {
            data.file = await getPresignedUrl(data.file, 60 * 60 * 24); // 24h
          }
          return { ...data.toJSON(), imageUrl };
        })
      );

      const totlaRecords = data.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Project retrieved successfully", {
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

export const Show = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<ConstructionUpdateResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const data = await ConstructionProjectModel.findByPk(id);

      if (data?.file) {
        data.file = await getPresignedUrl(data.file, 60 * 60 * 24); // 24h
      }

      if (!data) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }
    
      if (data?.file) {
        data.file = await getPresignedUrl(data.file, 60 * 60 * 24); // 24h
      }

      
      successResponse(res, "Success", data);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
