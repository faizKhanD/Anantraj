import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../../utils/s3";
import { ProjectFloorplanModel } from "../../../models/projects/projectFloorplan.model";
import { logger } from "../../../config/logger.config";
import { successResponse } from "../../../utils/responseHandler.util";
import { paginate } from "../../../utils/paginate.util";
import {
  FloorplanRequestBody,
  FloorplanResponseBody,
} from "../../../interfaces/project.interface";
import { FloorplanSchama, FloorplanUpdateSchama } from "../../../validation/admin/project";
import deleteFileFromS3 from "../../../utils/bucket.deleted.file";
import { Op } from "sequelize";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}


export const indexFloorplan = asyncHandler(
  async (req: Request<{ type: string, id: number }>, res: Response, next: NextFunction) => {
    try {

      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const { type, id } = req.params;

      const where: any = { project_id: id };

      // ✅ filter by type from route param
      if (type) {
        where.type = type;
      }

      // (Optional) search filter
      if (search) {
        where.optional_sub_typologies = {
          [Op.iLike]: `%${search}%`,
        };
      }

      const award = await ProjectFloorplanModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const result = await Promise.all(
        award.rows.map(async (data: any) => {
          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24); // 24h
          }
          return { ...data.toJSON() };
        })
      );

      const totlaRecords = award.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Project floorplans retrieved successfully", {
        data: result,
        pagination: {
          totlaRecords,
          totalPages,
          page,
          limit,
        },
      });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const storeFloorplan = asyncHandler(
  async (
    req: MulterRequest<FloorplanRequestBody>,
    res: Response<FloorplanResponseBody>,
    next: NextFunction
  ) => {
    try {

      const { error } = FloorplanSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || null;
      const requestData: FloorplanRequestBody = req.body;
      const { project_id, sub_typologie_id, alt, title, type } = requestData;

      const response = await ProjectFloorplanModel.create({
        project_id,
        sub_typologie_id,
        image: file,
        alt,
        title,
        type,
        status: 1,
      });

      if (response.image) {
        response.image = await getPresignedUrl(response.image, 60 * 60 * 24);
      }
    
      successResponse(res, "Floorplan created successfully", response);
    
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const editFloorplan = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<FloorplanRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await ProjectFloorplanModel.findByPk(id);

      
      if (!response) {
        next({
          status: 404,
          message: "Banner Not Found",
        });
      }

      if(response?.image){  
        response.image = await getPresignedUrl(response.image, 60 * 60 * 24); // 24h
      }

      successResponse(res, "Success", response);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const updateFloorplan = asyncHandler(
  async (
    req: MulterRequest<FloorplanRequestBody> & { params: { id: string } },
    res: Response<FloorplanResponseBody>,
    next: NextFunction
  ) => {
    try {
      
      const { error } = FloorplanUpdateSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const result = await ProjectFloorplanModel.findByPk(id);
      if (!result) {
        next({
          status: 404,
          message: "Floorplan Not Found",
        });
      }

      
      if((req.files as any)?.image?.[0]?.key && result?.image){
        await deleteFileFromS3(result?.image);
      }
      
     
      const image = (req.file as Express.MulterS3.File)?.key || result?.image;
      const requedtData: FloorplanRequestBody = req.body;
      const { alt, sub_typologie_id, title, type, status } = requedtData;
      const response = await  ProjectFloorplanModel.update(
        {
          sub_typologie_id,
          image: image,
          alt,
          title,
          type,
          status: 1,
        },
        {
          where: { id },
        }
      );

      const data = await ProjectFloorplanModel.findByPk(id);
      if(data){
        if (data.image) {
          data.image = await getPresignedUrl(data.image, 60 * 60 * 24); // 24h
        }
      }

      successResponse(res, "Floorplan Updated successfully", data);

    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const destroyFloorplan = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await ProjectFloorplanModel.findByPk(id);

      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      record?.image && await deleteFileFromS3(record.image);

      await ProjectFloorplanModel.destroy({
        where: { id },
      });

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