import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { GalleriesSchama, GalleriesUpdateSchama } from "../../validation/admin/project";
import { getPresignedUrl } from '../../utils/s3';
import { GalleriesRequestBody, GalleriesResponseBody, StatusRequestBody } from "../../interfaces/project.interface";
import { ConstructionUpdateProjectGalleryModel } from "../../models/ConstructionUpdateprojectGalleries";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import { CreateBucketMetadataTableConfigurationCommand } from "@aws-sdk/client-s3";
import { ConstructionUpdateProjectGalleryRequestBody, ConstructionUpdateProjectGalleryResponseBody } from "../../interfaces/construction_update.interface";
import { ConstructionUpdateProjectGallerySchema } from "../../validation/admin/construction_update.validate";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const Index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const { construction_update_project_id } = req.params;

     
      

      const data = await ConstructionUpdateProjectGalleryModel.findAndCountAll({
 
        limit,
        offset,
        order: [["created_at", "DESC"]], // optional: latest first
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


export const Store = asyncHandler(
  async (
    req: MulterRequest<ConstructionUpdateProjectGalleryRequestBody>,
    res: Response<ConstructionUpdateProjectGalleryResponseBody>,
    next: NextFunction
  ) => {

    try {
     
      const { error } = ConstructionUpdateProjectGallerySchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map(err => err.message)
        });
      }
      
      const file = (req.file as Express.MulterS3.File)?.key || null
      const teamData: ConstructionUpdateProjectGalleryRequestBody = req.body;
      const {
        month_year,
        construction_update_project_id,
        construction_update_sub_project_id,
        status,
        type,
        video_link,
        alt
      } = teamData;

      const data = await ConstructionUpdateProjectGalleryModel.create({
        month_year,
        construction_update_project_id,
        construction_update_sub_project_id,
        type,
        video_link,
        image:file,
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
export const Update = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<ConstructionUpdateProjectGalleryRequestBody>,
    next: NextFunction
  ) => {

    try {
      const { error } = ConstructionUpdateProjectGallerySchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map(err => err.message)
        });
      }
      


      const { id } = req.params;
      const record = await ConstructionUpdateProjectGalleryModel.findByPk(id);
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

      if(req.file && record?.image){
        await deleteFileFromS3(record?.image);
      }
    
      
      const file = (req.file as Express.MulterS3.File)?.key || record?.image;
      console.log('v',file);
      const updateData: Partial<ConstructionUpdateProjectGalleryRequestBody> & { image?: string | null } = {
        ...req.body,
      };

      if (file) {
        updateData.image = file;
      }

      await ConstructionUpdateProjectGalleryModel.update(updateData, {
        where: { id }
      });

      
      const updatedRecord = await ConstructionUpdateProjectGalleryModel.findByPk(id);
       
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


export const Show = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<GalleriesResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await ConstructionUpdateProjectGalleryModel.findByPk(id);

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





export const Destroy = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {

    try {
      const { id } = req.params;
      const record = await ConstructionUpdateProjectGalleryModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }
  
      record?.image && await deleteFileFromS3(record.image);

      await ConstructionUpdateProjectGalleryModel.destroy({
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
