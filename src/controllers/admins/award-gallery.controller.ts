import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { AwardGallerySchema, AwardGalleryUpdateSchema } from "../../validation/admin/auth/award-gallery.validate";
import {getPresignedUrl } from '../../utils/s3';
import {
  BlogRequestBody,
  BlogResponseBody,
} from "../../interfaces/blog.interface";
import Blog from "../../models/blog.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { tryEach } from "async";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import path from "path";
import { AwardGalleryRequestBody, AwardGalleryResponseBody } from "../../interfaces/award.interface";
import AwardGallery from "../../models/award-gallery.model";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const storeGallery = asyncHandler(
  async (
    req: MulterRequest<AwardGalleryRequestBody>,
    res: Response<AwardGalleryResponseBody>,
    next: NextFunction
  ) => {
    try {
   
      const { error } = AwardGallerySchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

   const file= (req.file as Express.MulterS3.File)?.key || null
   const galleryData: AwardGalleryRequestBody = req.body;
      const {
        alt_text,
        status,
        award_id
      } =galleryData;
      const result = await AwardGallery.create({
        alt_text,
        award_id,
        status,
        image:file,
      });

      let imageUrl: string | null = null;
      if (result?.image) {
        result.image = await getPresignedUrl(result.image, 60 * 60 * 24);
      }
      const Records = {
        ...result?.toJSON(),
      };

      successResponse(res, "Award Gallery created successfully", result);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const UpdateGallery = asyncHandler(
  async (
    req: MulterRequest<AwardGalleryRequestBody> & { params: { id: string } }, 
    res: Response<AwardGalleryResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = AwardGalleryUpdateSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const data = await AwardGallery.findByPk(id);
      if (!data) {
        next({
          status: 404,
          message: "Blog Not Found",
        });
      }
      const oldBanner = (req.file as Express.MulterS3.File)?.key || data?.image; 

      if(data?.image && req.file){
        await deleteFileFromS3(data?.image);
       
      }
      const result=await  AwardGallery.update(
        {
          ...req.body,
          image:oldBanner
        },
        {
          where: { id },
        }
      );
      const updatedAward = await AwardGallery.findByPk(id);
      if (updatedAward?.image) {
        updatedAward.image = await getPresignedUrl(updatedAward.image, 60 * 60 * 24);
      }
      successResponse(res, "Award Gallery Updated successfully", updatedAward);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const DeleteGallery = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const blog = await AwardGallery.findByPk(id);
      if (!blog) {
        next({
          status: 404,
          message: "Award gallery Not Found",
        });
      }

      await AwardGallery.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "Award Gallery Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const GalleryList = asyncHandler(
  async (req: Request<{}, {}>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const data = await AwardGallery.findAndCountAll({
        limit,
        offset,
      });
      const result = await Promise.all(
        data.rows.map(async (item: any) => {
          let imageUrl = null;
          if (item.image) {
            item.image  = await getPresignedUrl(item.image, 60 * 60 * 24); // 24h
          }
          return { ...item.toJSON(), imageUrl };
        })
      );

      const totlaRecords = data.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Gallery retrieved successfully", {
        data:result,
        pagination: {
          totlaRecords,
          totalPages,
          page: page,
          limit: limit,
        },      });
        
      } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const EditGallery = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<AwardGalleryResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const data = await AwardGallery.findByPk(id);
      if (!data) {
        next({
          status: 404,
          message: "Award Gallery Not Found",
        });
      }
      if (data?.image) {
        data.image  = await getPresignedUrl(data.image, 60 * 60 * 24); // 24h
      }
      successResponse(res, "Success", data);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
