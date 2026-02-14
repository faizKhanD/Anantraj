import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { TimelineSchema } from "../../validation/admin/timeline.validate";
import { getPresignedUrl } from "../../utils/s3";
import {
  TimelineRequestBody,
  TimelineResponseBody,
  StatusRequestBody,
} from "../../interfaces/timeline.interface";
import Timeline from "../../models/timeline.model";
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
        where[Op.or] = ["short_description"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const data = await Timeline.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]], // optional: latest first
      });

      const rows = await Promise.all(
        data.rows.map(async (item: any) => {
            item.image = item.image ? await getPresignedUrl(item.image, 60 * 60 * 24) : null;
            return { ...item.toJSON()};
        })
      );

      // ✅ include pagination info
      const totlaRecords = data.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Timeline retrieved successfully", {
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
    req: MulterRequest<TimelineRequestBody>,
    res: Response<TimelineResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = TimelineSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const image = (req.file as Express.MulterS3.File)?.key || null;
      const Data: TimelineRequestBody = req.body;
      const { year, alt, short_description, status } = Data;

      const timeline = await Timeline.create({
        year,
        image,
        alt,
        short_description,
        status,
      });

      // TypeScript now knows 'timeline' is not null
        timeline.image = timeline.image ? await getPresignedUrl(timeline.image, 60 * 60 * 24) : null; // 24h

      const timelineData = {
        ...timeline.toJSON()
      };

      successResponse(res, "Timeline created successfully", timelineData);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<TimelineResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const timeline = await Timeline.findByPk(id, {
        attributes: [
          "id",
          "year",
          "image",
          "alt",
          "short_description",
          "status",
        ],
      });

      if (!timeline) {
        return next({
          status: 404,
          message: "Record Not Found",
        });
      }

      // TypeScript now knows 'timeline' is not null
        timeline.image = timeline.image ? await getPresignedUrl(timeline.image, 60 * 60 * 24) : null;

      const timelineData = {
        ...timeline.toJSON(),
      };

      successResponse(res, "Success", timelineData);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const update = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<TimelineResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = TimelineSchema.validate(req.body, {
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
      const record = await Timeline.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || record?.image;
      const updateData: Partial<TimelineRequestBody> & {
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

      await Timeline.update(updateData, {
        where: { id },
      });

      const updatedRecord = await Timeline.findByPk(id);
      if (updatedRecord) {
        updatedRecord.image = updatedRecord.image ? await getPresignedUrl(updatedRecord.image, 60 * 60 * 24) : null;
      }
      
      successResponse(res, "Timeline Updated Successfully", updatedRecord);
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
      const record = await Timeline.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      record?.image && await deleteFileFromS3(record.image);

      await Timeline.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "Timeline Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
