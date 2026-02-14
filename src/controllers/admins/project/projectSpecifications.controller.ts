import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../../utils/s3";
import { ProjectSpecificationsModel } from "../../../models/projects/projectSpecifications.model";
import { logger } from "../../../config/logger.config";
import { successResponse } from "../../../utils/responseHandler.util";
import { paginate } from "../../../utils/paginate.util";
import {
  SpecificationsRequestBody,
  SpecificationsResponseBody,
} from "../../../interfaces/project.interface";
import { SpecificationSchama, SpecificationUpdateSchama } from "../../../validation/admin/project";
import deleteFileFromS3 from "../../../utils/bucket.deleted.file";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}



export const indexSpecification = asyncHandler(
  async (req: Request<{id:number}, {}>, res: Response, next: NextFunction) => {
    try {


      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const project_id  = req.params.id;
      const where: any = { project_id };

    
      const award = await ProjectSpecificationsModel.findAndCountAll({
        where,
        limit,
        offset,
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

      successResponse(res, "Specification retrieved successfully", {
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


export const storeSpecification = asyncHandler(
  async (
    req: MulterRequest<SpecificationsRequestBody>,
    res: Response<SpecificationsResponseBody>,
    next: NextFunction
  ) => {
    try {

      const { error } = SpecificationSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || null;
      const requestData: SpecificationsRequestBody = req.body;
      const { title, project_id, alt, } = requestData;

      const response = await ProjectSpecificationsModel.create({
        project_id,
        title,
        image: file,
        alt,
        status: 1,
      });

      if (response.image) {
        response.image = await getPresignedUrl(response.image, 60 * 60 * 24);
      }
    
      successResponse(res, "Specification created successfully", response);
    
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const editSpecification = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<SpecificationsRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await ProjectSpecificationsModel.findByPk(id);
 
 
      if (!response) {
        next({
          status: 404,
          message: "Specification Not Found",
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


export const updateSpecification = asyncHandler(
  async (
    req: MulterRequest<SpecificationsRequestBody> & { params: { id: string } },
    res: Response<SpecificationsResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = SpecificationUpdateSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const result = await ProjectSpecificationsModel.findByPk(id);
      if (!result) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }



      if((req.files as any)?.image?.[0]?.key && result?.image){
        await deleteFileFromS3(result?.image);
      }
     
      const file = (req.file as Express.MulterS3.File)?.key || result?.image;

      const requedtData: SpecificationsRequestBody = req.body;
      const {title, alt, } = requedtData;
      const response = await  ProjectSpecificationsModel.update(
        {
          title,
          image: file,
          alt,
        },
        {
          where: { id },
        }
      );
      const data = await ProjectSpecificationsModel.findByPk(id);
      if(data){
        if (data.image) {
          data.image = await getPresignedUrl(data.image, 60 * 60 * 24); // 24h
        }
      }
      successResponse(res, "Specifications Updated successfully", data);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const destroySpecification = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await ProjectSpecificationsModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }
      record?.image && await deleteFileFromS3(record.image);

      await ProjectSpecificationsModel.destroy({
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