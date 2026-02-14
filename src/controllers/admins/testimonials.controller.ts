import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { TestimonialSchema } from "../../validation/admin/testimonials.validate";
import { getPresignedUrl } from "../../utils/s3";
import {
  TestimonialRequestBody,
  TestimonialResponseBody,
  StatusRequestBody,
} from "../../interfaces/testimonials.interface";
import TestimonialsModel from "../../models/testimonials.model";
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
        where[Op.or] = ["name", "short_description"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const data = await TestimonialsModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]], // optional: latest first
      });

      const rows = await Promise.all(
        data.rows.map(async (item: any) => {
          item.image = await getPresignedUrl(item.image, 60 * 60 * 24); // 24h
          return { ...item.toJSON() };
        })
      );

      // ✅ include pagination info
      const totlaRecords = data.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Testimonials retrieved successfully", {
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
    req: MulterRequest<TestimonialRequestBody>,
    res: Response<TestimonialResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = TestimonialSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || null;
      const teamData: TestimonialRequestBody = req.body;
      const { name, alt, short_description, status, video_link, rating, seq } = teamData;

      const data = await TestimonialsModel.create({
        name,
        image: file,
        alt,
        short_description,
        rating,
        video_link,
        status,
        seq: seq
      });

      data.image = data.image ? await getPresignedUrl(data.image, 60 * 60 * 24) : null;


      successResponse(res, "Team created successfully", data);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<TestimonialResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await TestimonialsModel.findByPk(id, {
        attributes: [
          "id",
          "name",
          "image",
          "alt",
          "short_description",
          "rating",
          "video_link",
          "status",
          "seq",
        ],
      });

      if (!record) {
        return next({
          status: 404,
          message: "Record Not Found",
        }); // ✅ return here to exit
      }

      record.image = record.image ? await getPresignedUrl(record.image, 60 * 60 * 24) : null; // 24h

      const Data = {
        ...record.toJSON()
      };

      successResponse(res, "Success", Data);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const update = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<TestimonialResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = TestimonialSchema.validate(req.body, {
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
      const record = await TestimonialsModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Testimonial Not Found",
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || record?.image;
      const updateData: Partial<TestimonialRequestBody> & {
        image?: string | null;
      } = {
        ...req.body,
      };

      if (file) {
        updateData.image = file;
      }

      if(record?.image && (req.files as any)?.image){
        await deleteFileFromS3(record?.image);
      }

      await TestimonialsModel.update(updateData, {
        where: { id },
      });

     
      const updatedRecord = await TestimonialsModel.findByPk(id);
      if (updatedRecord?.image) {
        updatedRecord.image = updatedRecord.image ? await getPresignedUrl(updatedRecord.image, 60 * 60 * 24) : null;
      }

      successResponse(res, "Team Updated Successfully", updatedRecord);

    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const destroy = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await TestimonialsModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      record?.image && await deleteFileFromS3(record.image);

      await TestimonialsModel.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "Testimonial Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
