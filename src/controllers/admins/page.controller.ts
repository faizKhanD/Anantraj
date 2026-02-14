import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { PageSchema } from "../../validation/admin/auth/page.validate";
import {getPresignedUrl } from '../../utils/s3';
import {
  PageRequestBody,
  PageResponseBody,
  StatusRequestBody,
} from "../../interfaces/page.interface";
import Page from "../../models/pages.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { tryEach } from "async";
import { paginate } from "../../utils/paginate.util";
import { cast, col, Op,where as sequelizeWhere } from "sequelize";




interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}
export const Store = asyncHandler(
  async (
    req: MulterRequest<PageRequestBody>,
    res: Response<PageResponseBody>,
    next: NextFunction
  ) => {
    try {
   
      const { error } = PageSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const {
        name,
        meta_title,
        meta_description,
        meta_keywords,
        seo_tags,
        description,
        status,
      } =req.body;

        
         const image = (req.files as any)?.file?.[0]?.key || null;

         const mobile_image = (req.files as any)?.mobile_image?.[0]?.key || null;

         
      const blog = await Page.create({
        name,
        meta_title,
        meta_description,
        meta_keywords,
        seo_tags,
        description,
        status,
        banner:image,
        mobile_image:mobile_image
      });
      successResponse(res, "Page created successfully", blog);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Update = asyncHandler(
  async (
   
     req: MulterRequest<PageRequestBody> & { params: { id: string } }, 
    res: Response<PageRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = PageSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const response = await Page.findByPk(id);
      if (!response) {
        next({
          status: 404,
          message: "Page Not Found",
        });
      }
     


        const files = req.files as { [fieldname: string]: Express.MulterS3.File[] } | undefined;
        let image = response?.banner || null;
        let mobile_image = response?.mobile_image || null;
        if (files?.file?.[0]) {
          image = files.file[0].key;
        }
  
        if (files?.mobile_image?.[0]) {
          mobile_image = files.mobile_image[0].key;
        }

    
        
      await Page.update(
        {
          ...req.body,
           banner:image,
           mobile_image:mobile_image
        },
        {
          where: { id },
        }
      );
      successResponse(res, "Page Updated Succssfully", response);
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
      const { tab, search } = req.query;

      const whereCondition: any = {};

      if (search) {
        whereCondition[Op.or] = [
          // Cast enum column "name" to TEXT for ILIKE
          sequelizeWhere(cast(col("name"), "TEXT"), {
            [Op.iLike]: `%${search}%`
          }),
        ];
      }
      

       
      const data = await Page.findAndCountAll({
        where:whereCondition,
        limit,
        offset,
      });

       const result = await Promise.all(
        data.rows.map(async (data: any) => {
          let imageUrl = null;
          if (data.banner) {
            imageUrl = await getPresignedUrl(data.banner, 60 * 60 * 24); // 24h
          }
          if (data.mobile_image) {
            data.mobile_image = await getPresignedUrl(data.mobile_image, 60 * 60 * 24); // 24h
          }
          return { ...data.toJSON(), imageUrl };
        })
      );
      const totlaRecords = data.count;
      const totalPages = Math.ceil(totlaRecords / limit);
      successResponse(res, "Pages retrieved successfully", {
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
export const Show = asyncHandler(
  async (
    req: Request<{id:number}>,
    res: Response<PageResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      let response = null; 

      response = await Page.findByPk(id); 

      if (!response) {
        return next({
          status: 404,
          message: "Page Not Found",
        });
      } 

      if (response.banner) {
        response.banner = await getPresignedUrl(response.banner, 60 * 60 * 24); // 24h
      }
      if (response.mobile_image) {
        response.mobile_image = await getPresignedUrl(response.mobile_image, 60 * 60 * 24); // 24h
      }
      return successResponse(res, "Success", response);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
