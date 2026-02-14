import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { GalleriesSchama, GalleriesUpdateSchama } from "../../../validation/admin/project";
import { getPresignedUrl } from '../../../utils/s3';
import { GalleriesRequestBody, GalleriesResponseBody, StatusRequestBody } from "../../../interfaces/project.interface";
import { ProjectGalleriesModel } from "../../../models/projects/projectGalleries.model";
import { logger } from "../../../config/logger.config";
import { successResponse } from "../../../utils/responseHandler.util";
import { paginate } from "../../../utils/paginate.util";
import { Op } from "sequelize";
import deleteFileFromS3 from "../../../utils/bucket.deleted.file";
import { CreateBucketMetadataTableConfigurationCommand } from "@aws-sdk/client-s3";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const indexGalleries = asyncHandler(
  async (req: Request<{id:number}>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const { id } = req.params;

      const where: any = { project_id: id };
      

      const data = await ProjectGalleriesModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]], // optional: latest first
      });

      const rows = await Promise.all(
        data.rows.map(async (item: any) => {
          item.image = item.image ? await getPresignedUrl(item.image, 60 * 60 * 24) : null; // 24h
          return { ...item.toJSON() };
        })
      );

      // ✅ include pagination info
      const totlaRecords = data.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Record retrieved successfully", {
        data: rows,
        pagination: {
          totlaRecords,
          totalPages,
          page: page,
          limit: limit,
        },
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const storeGalleries = asyncHandler(
  async (
    req: MulterRequest<GalleriesRequestBody>,
    res: Response<GalleriesResponseBody>,
    next: NextFunction
  ) => {

    try {
     
      const { error } = GalleriesSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map(err => err.message)
        });
      }
      
      const file = (req.file as Express.MulterS3.File)?.key || null
      const teamData: GalleriesRequestBody = req.body;
      const {
        project_id,
        alt,
        year,
        status,
        type,
        video_link,
        is_construction,
      } = teamData;

      const data = await ProjectGalleriesModel.create({
        project_id,
        type,
        video_link,
        is_construction,
        image: file,
        year,
        alt,
        status
      });

      data.image = data.image ? await getPresignedUrl(data.image, 60 * 60 * 24) : null;
 

      successResponse(res, "New Record created successfully", data);
      
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }

  }

);


export const editGalleries = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<GalleriesResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await ProjectGalleriesModel.findByPk(id);

      if (!record) {
        return next({
          status: 404,
          message: "Record Not Found",
        }); // ✅ return here to exit
      }

      record.image = record.image ? await getPresignedUrl(record.image, 60 * 60 * 24) : null; // 24h
 

      successResponse(res, "Success", record);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const updateGalleries = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<GalleriesResponseBody>,
    next: NextFunction
  ) => {

    try {
      const { error } = GalleriesUpdateSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map(err => err.message)
        });
      }
      


      const { id } = req.params;
      const record = await ProjectGalleriesModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }

      if(req.body.video_link){
           await deleteFileFromS3(req.body.video_link);
      }else{
        req.body.video_link = record?.video_link;
      }

      if((req.files as any)?.image?.[0]?.key && record?.image){
        await deleteFileFromS3(record?.image);
      }
      
      const file = (req.file as Express.MulterS3.File)?.key || record?.image;
      const updateData: Partial<GalleriesRequestBody> & { image?: string | null } = {
        ...req.body,
      };

      if (file) {
        updateData.image = file;
      }

      await ProjectGalleriesModel.update(updateData, {
        where: { id }
      });

      
      const updatedRecord = await ProjectGalleriesModel.findByPk(id);
       
      if(updatedRecord){
        if (updatedRecord.image) {
          updatedRecord.image = await getPresignedUrl(updatedRecord.image, 60 * 60 * 24); // 24h
        }
      }
      
      successResponse(res, "Record Updated Successfully", updatedRecord);


    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
 
  }
);


export const destroyGalleries = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {

    try {
      const { id } = req.params;
      const record = await ProjectGalleriesModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }
  
      record?.image && await deleteFileFromS3(record.image);

      await ProjectGalleriesModel.destroy({
        where: { id }
      })

      next({
        status: 200,
        message: "Record Deleted Successfully"
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }

  }
);

// true false for is_construction coum in database 
export const addAndUpdateUnderconstructionImageMark=asyncHandler(async(req: Request<{ id: number }, {}>, res: Response, next: NextFunction)=>{
    try {
        const { id } = req.params;
         const record = await ProjectGalleriesModel.findByPk(id);
      if (!record) {
        return next({
          status: 404,
          message: "Record Not Found",
        });
      }
        record.is_construction = record.is_construction ? 0 : 1;
  await record.save();
        successResponse(res, "Record Updated Successfully", record);
    } catch (error:any) {
         logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
})
