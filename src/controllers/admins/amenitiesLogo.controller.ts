import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { amenitiesLogoSchema } from "../../validation/admin/amenitiesLogo.validate";
import {getPresignedUrl } from '../../utils/s3';
import { amenitiesLogoRequestBody, amenitiesLogoResponseBody, StatusRequestBody } from "../../interfaces/amenitiesLogo.interface";
import amenitiesLogoModel from "../../models/amenitiesLoog.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";

interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const Index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { offset, page } = paginate(req.query);
      const { search } = req.query;
const limit = 50;

      const where: any = {};
      if (search) {
        where[Op.or] = ["name"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const data = await amenitiesLogoModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]], // optional: latest first
      });

      const rows = await Promise.all(
        data.rows.map(async (item: any) => {
          item.logo = item.logo ? await getPresignedUrl(item.logo, 60 * 60 * 24) : null; // 24h
          return { ...item.toJSON() };
        })
      );

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


export const store = asyncHandler(
  async (
    req: MulterRequest<amenitiesLogoRequestBody>,
    res: Response<amenitiesLogoResponseBody>,
    next: NextFunction
  ) => {

    try {
      const { error } = amenitiesLogoSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map(err => err.message)
        });
      }
      
      const file= (req.file as Express.MulterS3.File)?.key || null
      const teamData: amenitiesLogoRequestBody = req.body;
      const {
        name,
        alt,
        status,
      } = teamData;

      const data = await amenitiesLogoModel.create({
        name,
        logo: file,
        alt,
        status
      });

      data.logo = data.logo ? await getPresignedUrl(data.logo, 60 * 60 * 24) : null;
 

      successResponse(res, "Amenities Logo created successfully", data);
      
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }

  }

);


export const edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<amenitiesLogoResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await amenitiesLogoModel.findByPk(id);

      if (!record) {
        return next({
          status: 404,
          message: "Record Not Found",
        }); // ✅ return here to exit
      }

      // TypeScript now knows 'record' is not null
      record.logo = record.logo ? await getPresignedUrl(record.logo, 60 * 60 * 24) : null; // 24h


      successResponse(res, "Success", record);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const update = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<amenitiesLogoResponseBody>,
    next: NextFunction
  ) => {

    try {
      const { error } = amenitiesLogoSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map(err => err.message)
        });
      }


      const { id } = req.params;
      const record = await amenitiesLogoModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }



      
      const file = (req.file as Express.MulterS3.File)?.key || record?.logo;
      if(file && record?.logo){
        record?.logo && await deleteFileFromS3(record.logo);
      }
     
      // Build update data
      const updateData: Partial<amenitiesLogoRequestBody> & { image?: string | null } = {
        ...req.body,
      };

      if (file) {
        updateData.logo = file; // replace old image with new one
      }

      await amenitiesLogoModel.update(updateData, {
        where: { id }
      });

      // Fetch updated record
      const updatedRecord = await amenitiesLogoModel.findByPk(id);

      // Generate presigned URL for image if exists
      let logoUrl: string | null = null;
      if (updatedRecord?.logo) {
        logoUrl = await getPresignedUrl(updatedRecord.logo, 60 * 60 * 24);
      }

      const timelineData = {
        ...updatedRecord?.toJSON(),
        logoUrl,
      };

      successResponse(res, "Record Updated Successfully", timelineData);


    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
 
  }
)


export const destroy = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {

    try {
      const { id } = req.params;
      const record = await amenitiesLogoModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }

      record?.logo && await deleteFileFromS3(record.logo);

      await amenitiesLogoModel.destroy({
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
)

