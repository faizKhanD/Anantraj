import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../utils/s3";
import ConstructionUpdateSubProjectModel from "../../models/construction_update_sub_projects.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { Op } from "sequelize";
import {
  ConstructionUpdateSubProjectRequestBody,
  ConstructionUpdateSubProjectResponseBody,
} from "../../interfaces/construction_update.interface";
import { ConstructionUpdateSubProjectSchema } from "../../validation/admin/construction_update_sub_project.validate";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import { paginate } from "../../utils/paginate.util";

interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const Store = asyncHandler(
  async (
    req: MulterRequest<ConstructionUpdateSubProjectRequestBody>,
    res: Response<ConstructionUpdateSubProjectResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = ConstructionUpdateSubProjectSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const file = (req.file as Express.MulterS3.File)?.key || null;
      const payload: ConstructionUpdateSubProjectRequestBody = req.body;
      const { title,construction_project_id } = payload;
      const datata = await ConstructionUpdateSubProjectModel.create({
        title,
       construction_project_id,
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
    req: MulterRequest<ConstructionUpdateSubProjectRequestBody> & { params: { id: string } },
    res: Response<ConstructionUpdateSubProjectResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = ConstructionUpdateSubProjectSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const data = await ConstructionUpdateSubProjectModel.findByPk(id);
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

      const requedtData: ConstructionUpdateSubProjectRequestBody = req.body;
      const {  title,construction_project_id  } = requedtData;

      await ConstructionUpdateSubProjectModel.update(
        {
          title,
          construction_project_id,
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
      const data = await ConstructionUpdateSubProjectModel.findByPk(id);
      if (!data) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      if (data?.file) {
        await deleteFileFromS3(data?.file);
      }
      await ConstructionUpdateSubProjectModel.destroy({
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


export const DeleteConstructionUpdateSubProjectByParentId =async (construction_project_id:number) => {
    try {
      const data = await ConstructionUpdateSubProjectModel.findAll({
        where: { construction_project_id },
      });
     
      // loop fp for delete 
      for (const item of data) {
        if (item?.file) {
          await deleteFileFromS3(item?.file);
        }
      }
     
      await ConstructionUpdateSubProjectModel.destroy({
        where: { construction_project_id },
      });
   
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
    
    }
  }

export const Index = asyncHandler(
  async (req: Request<{id:number}, {}>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const {paltter_id} = req.query;
      const where: any = {};
      if(paltter_id){
        where.construction_project_id = paltter_id;
      }

      if (search) {
        where[Op.or] = ["title"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const data = await ConstructionUpdateSubProjectModel.findAndCountAll({
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
    res: Response<ConstructionUpdateSubProjectResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const data = await ConstructionUpdateSubProjectModel.findByPk(id);

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
