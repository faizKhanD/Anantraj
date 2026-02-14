import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../../utils/s3";
import {ProjectAmenitiesModel} from "../../../models/projects/projectAmenities.model";
import { logger } from "../../../config/logger.config";
import { successResponse } from "../../../utils/responseHandler.util";
import { paginate } from "../../../utils/paginate.util";
import {
  AmenitiesRequestBody,
  AmenitiesResponseBody,
} from "../../../interfaces/project.interface";
import { AmenitieSchama, AmenitieUpdateSchama } from "../../../validation/admin/project";
import deleteFileFromS3 from "../../../utils/bucket.deleted.file";
import logoModel from "../../../models/logo.model";
import AmenitiesLogo from "../../../models/amenitiesLoog.model";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}



export const index = asyncHandler(
  async (req: Request<{id:number}, {}>, res: Response, next: NextFunction) => {
    try {


      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const project_id = req.params.id;
      const where: any = { project_id };

    
      const award = await ProjectAmenitiesModel.findAndCountAll({
        where,
        limit,
        offset,
        include:[
          {
            model:AmenitiesLogo,
            as:"logo_data",
          },
        ]
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

      successResponse(res, "Amenities retrieved successfully", {
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


export const store = asyncHandler(
  async (
    req: MulterRequest<AmenitiesRequestBody>,
    res: Response<AmenitiesResponseBody>,
    next: NextFunction
  ) => {
    try {

      const { error } = AmenitieSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || null;
      const requestData: AmenitiesRequestBody = req.body;
      const { title, project_id, logo_id, alt, short_description } = requestData;

      const response = await ProjectAmenitiesModel.create({
        project_id,
        logo_id,
        title,
        image: file,
        alt,
        short_description,
        status: 1,
      });

      if (response.image) {
        response.image = await getPresignedUrl(response.image, 60 * 60 * 24);
      }
    
      successResponse(res, "Amenities created successfully", response);
    
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<AmenitiesRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await ProjectAmenitiesModel.findByPk(id);
 
      if (!response) {
        next({
          status: 404,
          message: "Record Not Found",
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


export const update = asyncHandler(
  async (
    req: MulterRequest<AmenitiesRequestBody> & { params: { id: string } },
    res: Response<AmenitiesResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = AmenitieUpdateSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const result = await ProjectAmenitiesModel.findByPk(id);
      if (!result) {
        next({
          status: 404,
          message: "Amenities Not Found",
        });
      }



      if((req.files as any)?.image?.[0]?.key && result?.image){
        await deleteFileFromS3(result?.image);
      }
     
      const image = (req.file as Express.MulterS3.File)?.key || result?.image;
      const requedtData: AmenitiesRequestBody = req.body;
      const {title, alt, logo_id, short_description } = requedtData;
      const response = await  ProjectAmenitiesModel.update(
        {
          title,
          logo_id,
          image,
          alt,
          short_description,
        },
        {
          where: { id },
        }
      );
      const data = await ProjectAmenitiesModel.findByPk(id);
      if(data){
        if (data.image) {
          data.image = await getPresignedUrl(data.image, 60 * 60 * 24); // 24h
        }
      }
      successResponse(res, "Ameniteis Updated successfully", data);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const destroy = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await ProjectAmenitiesModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }
      record?.image && await deleteFileFromS3(record.image);

      await ProjectAmenitiesModel.destroy({
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