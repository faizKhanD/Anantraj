import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { CsrGallerieSchema } from "../../validation/admin/eventgalleries.validate";
import {getPresignedUrl } from '../../utils/s3';
import { EventGalleriesRequestBody, EventGalleriesResponseBody, StatusRequestBody } from "../../interfaces/eventgalleries.interface";
import { EventGalleriesModel } from "../../models/eventGalleries.model";
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
      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;

      const where: any = {};
      if (search) {
        where[Op.or] = ["alt", "short_description"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const data = await EventGalleriesModel.findAndCountAll({
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


export const store = asyncHandler(
  async (
    req: MulterRequest<EventGalleriesRequestBody>,
    res: Response<EventGalleriesResponseBody>,
    next: NextFunction
  ) => {

    try {
      const { error } = CsrGallerieSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map(err => err.message)
        });
      }
      
      const file= (req.file as Express.MulterS3.File)?.key || null
      const teamData: EventGalleriesRequestBody = req.body;
      const {
        year,
        alt,
        status,
      } = teamData;

      const data = await EventGalleriesModel.create({
        year,
        image: file,
        alt,
        status
      });

      data.image = data.image ? await getPresignedUrl(data.image, 60 * 60 * 24) : null;


      successResponse(res, "Event Galleries created successfully", data);
      
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }

  }

);


export const edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<EventGalleriesResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await EventGalleriesModel.findByPk(id);

      if (!record) {
        return next({
          status: 404,
          message: "Record Not Found",
        }); // ✅ return here to exit
      }

      // TypeScript now knows 'record' is not null
      record.image = record.image ? await getPresignedUrl(record.image, 60 * 60 * 24) : null; // 24h

      
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
    res: Response<EventGalleriesResponseBody>,
    next: NextFunction
  ) => {

    try {
      const { error } = CsrGallerieSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map(err => err.message)
        });
      }


      const { id } = req.params;
      const record = await EventGalleriesModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }

      
      const file = (req.file as Express.MulterS3.File)?.key || record?.image;

      // Build update data
      const updateData: Partial<EventGalleriesRequestBody> & { image?: string | null } = {
        ...req.body,
      };

      if (file) {
        updateData.image = file; // replace old image with new one
      }

      await EventGalleriesModel.update(updateData, {
        where: { id }
      });

      // Fetch updated record
      const updatedRecord = await EventGalleriesModel.findByPk(id);

      updatedRecord?.image ? updatedRecord.image = await getPresignedUrl(updatedRecord.image, 60 * 60 * 24) : null;
 
      successResponse(res, "Record Updated Successfully", updatedRecord);


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
      const record = await EventGalleriesModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }

      record?.image && await deleteFileFromS3(record.image);

      await EventGalleriesModel.destroy({
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

