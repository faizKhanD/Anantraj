import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import {getPresignedUrl } from '../../utils/s3';

import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import { OurStoryAndManifastoSchema, OurStoryAndManifastoUpdateSchema } from "../../validation/admin/ourstryandmanifato.validate";
import { OurStoryAndManifatoRequestBody,OurStoryAndManifatoResponseBody, OurStoryAndManifatoUpdateRequestBody } from "../../interfaces/ourstoryandmanifasto";
import OurStoryAndManifasto from "../../models/OurStoryAndManifasto.model";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const Store = asyncHandler(
  async (
    req: MulterRequest<OurStoryAndManifatoRequestBody>,
    res: Response<OurStoryAndManifatoResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = OurStoryAndManifastoSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

   const file= (req.file as Express.MulterS3.File)?.key || null
   const requestData: OurStoryAndManifatoRequestBody = req.body;
      const {
        type,
        alt_text,
        status,
        sequence
      } =requestData;
      const response = await OurStoryAndManifasto.create({
        type,
        alt_text,
        image:file,
        status,
        sequence
      });

      let imageUrl: string | null = null;
      if (response?.image) {
        response.image = await getPresignedUrl(response.image, 60 * 60 * 24);
      }
      const Records = {
        ...response?.toJSON(),
      };

      successResponse(res, "Data created successfully", response);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Update = asyncHandler(
  async (
    req: MulterRequest<OurStoryAndManifatoUpdateRequestBody> & { params: { id: string } }, 
    res: Response<OurStoryAndManifatoResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = OurStoryAndManifastoUpdateSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const result = await OurStoryAndManifasto.findByPk(id);
      if (!result) {
        next({
          status: 404,
          message: "Data Not Found",
        });
      }
      const oldBanner = (req.file as Express.MulterS3.File)?.key || result?.image; 

      if(result?.image && req.file){
        await deleteFileFromS3(result?.image);
       
      }
      await OurStoryAndManifasto.update(
        {
          ...req.body,
          image:oldBanner
        },
        {
          where: { id },
        }
      );
      next({
        status: 200,
        message: "Data Updated Succssfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Delete = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const data = await OurStoryAndManifasto.findByPk(id);
      if (!data) {
        next({
          status: 404,
          message: "Data Not Found",
        });
      }

      await OurStoryAndManifasto.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "Data Deleted Successfully",
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
      const { type } = req.query;
      const where: any = {};
      if (type) {
          where.type = type;
      }
      const data = await OurStoryAndManifasto.findAndCountAll({
        where,
        limit,
        offset,
        order:[['sequence','ASC']]
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

      successResponse(res, "Data retrieved successfully", {
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

export const Edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<OurStoryAndManifatoRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await OurStoryAndManifasto.findByPk(id);
      if (!result) {
        next({
          status: 404,
          message: "Data Not Found",
        });
      }

      if (result?.image) {
        result.image = await getPresignedUrl(result.image, 60 * 60 * 24);
      }
      successResponse(res, "Success", result);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
