import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import {
  PlatterSchema,
  UpdatePlatterSchema,
} from "../../validation/admin/platter";
import {
  PlatterRequestBody,
  PlatterResponseBody,
} from "../../interfaces/township.interface";
import Platter from "../../models/platter.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import { getPresignedUrl } from "../../utils/s3";
 


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}



export const AddPlatter = asyncHandler(
  async (
    req: MulterRequest<PlatterRequestBody>,
    res: Response<PlatterResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = PlatterSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }``

      const image = (req.files as any)?.image?.[0]?.key || null;
      const mobile_image = (req.files as any)?.mobile_image?.[0]?.key || null;
      const platter = await Platter.create({
        ...req.body,
        image,
        mobile_image,
      });
      
        platter.image = platter.image ? await getPresignedUrl(platter.image, 60 * 60 * 24) : null; // 24h
        platter.mobile_image = platter.mobile_image ? await getPresignedUrl(platter.mobile_image, 60 * 60 * 24) : null; // 24h
      
      successResponse(res, "Platter created successfully", platter);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

 
export const UpdatePlatter = asyncHandler(

  async (
    req: MulterRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { error, value } = UpdatePlatterSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const { id } = req.params;
      const platter = await Platter.findByPk(id);
      if (!platter) {
        return next({
          status: 404,
          message: "Platter Not Found",
        });
      }


      const files = req.files as { [fieldname: string]: Express.MulterS3.File[] } | undefined;

         
      

      const updatedData: Partial<typeof value> & { image?: string } = {
        ...value,
      };

      if (files?.image?.[0]) {
        if (platter.image) {
          await deleteFileFromS3(platter.image); 
        }
        updatedData.image = files.image[0].key; 
      }
      
      if (files?.mobile_image?.[0]) {
        if (platter.mobile_image) {
          await deleteFileFromS3(platter.mobile_image); 
        }
        updatedData.mobile_image = files.mobile_image[0].key; 
      }


      await Platter.update(updatedData, { where: { id } });
      

      successResponse(
        res,
        "Platter updated successfully",
        await Platter.findByPk(id)
      );
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const DeletePlatter = asyncHandler(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const platter = await Platter.findByPk(id);

      if (!platter) {
        return next({
          status: 404,
          message: "Platter Not Found",
        });
      }

      platter?.image && await deleteFileFromS3(platter.image);
      platter?.mobile_image && await deleteFileFromS3(platter.mobile_image);


      await Platter.destroy({ where: { id } });

      successResponse(res, "Platter deleted successfully", null);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const GetPlatters = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query as any);
      const { search } = req.query;

      const where: any = {};

      if (search) {
        where[Op.or] = ["name", "heading"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const  platters = await Platter.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const result = await Promise.all(
        platters.rows.map(async (data: any) => {          
          data.image = data.image ? await getPresignedUrl(data.image, 60 * 60 * 24) : null; // 24h
          data.mobile_image = data.mobile_image ? await getPresignedUrl(data.mobile_image, 60 * 60 * 24) : null; // 24h
          return { ...data.toJSON() };
        })
      );

      const totlaRecords = platters.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      
      successResponse(res, "Platters retrieved successfully", {
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


export const GetPlatterById = asyncHandler(
  async (
    req: Request<{ id: string }>,
    res: Response<PlatterResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const platter = await Platter.findByPk(id);

      if (!platter) {
        return next({
          status: 404,
          message: "Platter Not Found",
        });
      }
      
      platter.image = platter.image ? await getPresignedUrl(platter.image, 60 * 60 * 24) : null; // 24h
      platter.mobile_image = platter.mobile_image ? await getPresignedUrl(platter.mobile_image, 60 * 60 * 24) : null; // 24h
      
      successResponse(res, "Platter retrieved successfully", platter);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const addAndUpdateUnderconstructionMark=asyncHandler(async(req: Request<{ id: number }, {}>, res: Response, next: NextFunction)=>{
    try {
        const { id } = req.params;
         const record = await Platter.findByPk(id);
      if (!record) {
        return next({
          status: 404,
          message: "Record Not Found",
        });
      }
        record.show_in_construction = record.show_in_construction ? 0 : 1;
    await record.save();
        successResponse(res, "Record Updated Successfullyss", record);
    } catch (error:any) {
         logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
})
