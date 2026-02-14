import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../../utils/s3";

import {ProjectBannerModel} from "../../../models/projects/projectBanner.model";
import { logger } from "../../../config/logger.config";
import { successResponse } from "../../../utils/responseHandler.util";
import { paginate } from "../../../utils/paginate.util";
import {
  BannerRequestBody,
  BannerResponseBody,
} from "../../../interfaces/project.interface";
import { BannerSchama, BannerUpdateSchama } from "../../../validation/admin/project";
import deleteFileFromS3 from "../../../utils/bucket.deleted.file";

interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const StoreBanner = asyncHandler(
  async (
    req: MulterRequest<BannerRequestBody>,
    res: Response<BannerResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = BannerSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const mobile_file = (req.files as any)?.mobile_file?.[0]?.key || null;
      const desktop_file = (req.files as any)?.desktop_file?.[0]?.key || null;
      const requestData: BannerRequestBody = req.body;
      const { project_id, alt_text } = requestData;
      const response = await ProjectBannerModel.create({
        mobile_file,
        desktop_file,
        project_id,
        status: 1,
        alt_text,
      });

      if (response.mobile_file) {
        response.mobile_file= await getPresignedUrl(response.mobile_file, 60 * 60 * 24); // 24h
      }


      if (response.desktop_file) {
        response.desktop_file= await getPresignedUrl(response.desktop_file, 60 * 60 * 24); // 24h
      }


      successResponse(res, "Banner created successfully", response);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const UpdateBanner = asyncHandler(
  async (
    req: MulterRequest<BannerRequestBody> & { params: { id: string } },
    res: Response<BannerResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = BannerUpdateSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const result = await ProjectBannerModel.findByPk(id);
      if (!result) {
        next({
          status: 404,
          message: "Banner Not Found",
        });
      }



      if((req.files as any)?.desktop_file?.[0]?.key && result?.desktop_file){
        await deleteFileFromS3(result?.desktop_file);
  }
      if((req.files as any)?.mobile_file?.[0]?.key && result?.mobile_file){
            await deleteFileFromS3(result?.mobile_file);
      }
      const mobile_file = (req.files as any)?.mobile_file?.[0]?.key || result?.mobile_file;
      const desktop_file = (req.files as any)?.desktop_file?.[0]?.key || result?.desktop_file;
      const requedtData: BannerRequestBody = req.body;
      const {alt_text } = requedtData;
      const response=await  ProjectBannerModel.update(
        {
          mobile_file,
          desktop_file,
          alt_text,
        },
        {
          where: { id },
        }
      );
      const data = await ProjectBannerModel.findByPk(id);
      if(data){
        if (data.mobile_file) {
          data.mobile_file= await getPresignedUrl(data.mobile_file, 60 * 60 * 24); // 24h
        }
  
  
        if (data.desktop_file) {
          data.desktop_file= await getPresignedUrl(data.desktop_file, 60 * 60 * 24); // 24h
        }
      }
      successResponse(res, "Banner Updated successfully", data);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const DeleteBanner = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const award = await ProjectBannerModel.findByPk(id);
      if (!award) {
        next({
          status: 404,
          message: "Banner Not Found",
        });
      }
      award?.desktop_file && await deleteFileFromS3(award.desktop_file);
      award?.mobile_file && await deleteFileFromS3(award.mobile_file);

      await ProjectBannerModel.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "Banner Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const BannerList = asyncHandler(
  async (req: Request<{id:number}, {}>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const { id } = req.params;
      
      const where: any = { project_id: id };

    
      const award = await ProjectBannerModel.findAndCountAll({
        where,
        limit,
        offset,
      });

      const result = await Promise.all(
        award.rows.map(async (data: any) => {
          let imageUrl = null;
          if (data.mobile_file) {
            data.mobile_file = await getPresignedUrl(data.mobile_file, 60 * 60 * 24); // 24h
          }
          if (data.desktop_file) {
            data.desktop_file = await getPresignedUrl(data.desktop_file, 60 * 60 * 24); // 24h
          }
          return { ...data.toJSON() };
        })
      );

      const totlaRecords = award.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Banner retrieved successfully", {
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

export const EditBanner = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<BannerRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await ProjectBannerModel.findByPk(id, {
        attributes: ["id", "project_id", "status", "desktop_file", "mobile_file", "alt_text"],
      });

      if (response?.desktop_file) {
        response.desktop_file = await getPresignedUrl(response.desktop_file, 60 * 60 * 24); // 24h
      }

      if (response?.mobile_file) {
        response.mobile_file = await getPresignedUrl(response.mobile_file, 60 * 60 * 24); // 24h
      }

      if (!response) {
        next({
          status: 404,
          message: "Banner Not Found",
        });
      }
      successResponse(res, "Success", response);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
