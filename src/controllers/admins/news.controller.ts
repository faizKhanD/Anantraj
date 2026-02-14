import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { NewsSchema } from "../../validation/admin/news.validate";
import { getPresignedUrl } from "../../utils/s3";
import {
  NewsRequestBody,
  NewsResponseBody,
  StatusRequestBody,
} from "../../interfaces/news.interface";
import News from "../../models/news.model";
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

      const news = await News.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const rows = await Promise.all(
        news.rows.map(async (item: any) => {
          if (item?.image) {
            item.image = await getPresignedUrl(item.image, 60 * 60 * 24); // 24h
          }
          if (item?.logo) {
            item.logo = await getPresignedUrl(item.logo, 60 * 60 * 24); // 24h
          }
          return { ...item.toJSON() };
        })
      );

      // ✅ include pagination info
      const totlaRecords = news.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "News retrieved successfully", {
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

export const AddNews = asyncHandler(
  async (
    req: MulterRequest<NewsRequestBody>,
    res: Response<NewsResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = NewsSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      // const file = (req.file as Express.MulterS3.File)?.key || null;
      const logo = (req.files as any)?.logo?.[0]?.key || null;
      const image = (req.files as any)?.image?.[0]?.key || null;

      const newsData: NewsRequestBody = req.body;
      const { alt, link, short_description, status ,date_at} = newsData;

      const news = await News.create({
        image,
        alt,
        link,
        short_description,
        status,
        logo,
        date_at
      });

      if (news?.image) {
        news.image = await getPresignedUrl(news.image, 60 * 60 * 24);
      }
      if (news?.logo) {
        news.logo = await getPresignedUrl(news.logo, 60 * 60 * 24);
      }

      const Records = {
        ...news?.toJSON(),
      };

      successResponse(res, "News created successfully", Records);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const EditNews = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<NewsResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      // const news = await News.findByPk(id);

      const news = await News.findByPk(id);
      if (!news) {
        return next({
          status: 404,
          message: "Record Not Found",
        }); // ✅ return here to exit
      }

      // TypeScript now knows 'news' is not null
      news.image = news.image ? await getPresignedUrl(news.image, 60 * 60 * 24) : null; // 24h
      news.logo = news.logo ? await getPresignedUrl(news.logo, 60 * 60 * 24) : null; // 24h


      const newsData = {
        ...news.toJSON(),
      };

      successResponse(res, "Success", newsData);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const UpdateNews = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<NewsResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = NewsSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const { id } = req.params;
      const record = await News.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "News Not Found",
        });
      }

      const files = req.files as { [fieldname: string]: Express.MulterS3.File[] } | undefined;

      const updateData: Partial<NewsRequestBody> & { image?: string | null } = {
        ...req.body,
      };

      if (files?.image?.[0]) {
        updateData.image = files.image[0].key;
      }

      if (files?.logo?.[0]) {
        updateData.logo = files.logo[0].key;
      }

      if(record?.image && (req.files as any)?.image){
        await deleteFileFromS3(record?.image);
      }

      if(record?.logo && (req.files as any)?.logo){
        await deleteFileFromS3(record?.logo);
      }

      await News.update(updateData, {
        where: { id },
      });

      const updatedRecord = await News.findByPk(id);
      if (updatedRecord?.image) {
        updatedRecord.image = await getPresignedUrl(updatedRecord.image, 60 * 60 * 24);
      }
      if (updatedRecord?.logo) {
        updatedRecord.logo = await getPresignedUrl(updatedRecord.logo, 60 * 60 * 24);
      }
      successResponse(res, "News Updated Successfully", updatedRecord);

    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const DeleteNews = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await News.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      record?.image && await deleteFileFromS3(record.image);
      record?.logo && await deleteFileFromS3(record.logo);          

      await News.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "News Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
