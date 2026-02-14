import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../../utils/s3";
import {ProjectHighlightsModel} from "../../../models/projects/projectHighlights.model";
import { logger } from "../../../config/logger.config";
import { successResponse } from "../../../utils/responseHandler.util";
import { paginate } from "../../../utils/paginate.util";
import {
  HighlightsRequestBody,
  HighlightsResponseBody,
} from "../../../interfaces/project.interface";
import { HighlightSchama, HighlightUpdateSchama } from "../../../validation/admin/project";
import deleteFileFromS3 from "../../../utils/bucket.deleted.file";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}



export const indexHighlight = asyncHandler(
  async (req: Request<{id:number}, {}>, res: Response, next: NextFunction) => {
    try {


      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const project_id  = req.params.id;
      const where: any = { project_id };

    
      const award = await ProjectHighlightsModel.findAndCountAll({
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

      successResponse(res, "Highlight retrieved successfully", {
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


export const storeHighlight = asyncHandler(
  async (
    req: MulterRequest<HighlightsRequestBody>,
    res: Response<HighlightsResponseBody>,
    next: NextFunction
  ) => {
    try {

      const { error } = HighlightSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || null;
      const requestData: HighlightsRequestBody = req.body;
      const { title, project_id, alt, } = requestData;

      const response = await ProjectHighlightsModel.create({
        project_id,
        title,
        image: file,
        alt,
        status: 1,
      });

      if (response.image) {
        response.image = await getPresignedUrl(response.image, 60 * 60 * 24);
      }
    
      successResponse(res, "Highlight created successfully", response);
    
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const editHighlight = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<HighlightsRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await ProjectHighlightsModel.findByPk(id);
 
 
      if (!response) {
        next({
          status: 404,
          message: "Highlight Not Found",
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


export const updateHighlight = asyncHandler(
  async (
    req: MulterRequest<HighlightsRequestBody> & { params: { id: string } },
    res: Response<HighlightsResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = HighlightUpdateSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const result = await ProjectHighlightsModel.findByPk(id);
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

      const requedtData: HighlightsRequestBody = req.body;
      const {title, alt, } = requedtData;
      const response = await  ProjectHighlightsModel.update(
        {
          title,
          image: file,
          alt,
        },
        {
          where: { id },
        }
      );
      const data = await ProjectHighlightsModel.findByPk(id);
      if(data){
        if (data.image) {
          data.image = await getPresignedUrl(data.image, 60 * 60 * 24); // 24h
        }
      }
      successResponse(res, "Highlights Updated successfully", data);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const destroyHighlight = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await ProjectHighlightsModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }
      record?.image && await deleteFileFromS3(record.image);

      await ProjectHighlightsModel.destroy({
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