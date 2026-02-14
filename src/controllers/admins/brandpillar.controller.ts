import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { BrandPillarSchema } from "../../validation/admin/brandpillar.validate";
import { getPresignedUrl } from "../../utils/s3";
import {
  BrandPillarRequestBody,
  BrandPillarResponseBody,
  StatusRequestBody,
} from "../../interfaces/brandpillar.interface";
import BrandPillar from "../../models/brandpillar.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";

export const Index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;

      const where: any = {};
      if (search) {
        where[Op.or] = ["title"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const data = await BrandPillar.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]], // optional: latest first
      });

      const rows = await Promise.all(
        data.rows.map(async (item: any) => {
          let imageUrl = null;
          if (item.image) {
            imageUrl = await getPresignedUrl(item.image, 60 * 60 * 24); // 24h
          }
          return { ...item.toJSON(), imageUrl };
        })
      );

      // ✅ include pagination info
      const totalItems = data.count;
      const totalPages = Math.ceil(totalItems / limit);

      successResponse(res, "BrandPillar retrieved successfully", {
        data: rows,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          pageSize: limit,
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
    req: Request<{}, {}, BrandPillarRequestBody>,
    res: Response<BrandPillarResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = BrandPillarSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const Data: BrandPillarRequestBody = req.body;
      const { title, short_description, status } = Data;

      const data = await BrandPillar.create({
        title,
        short_description,
        status,
      });

      successResponse(res, "BrandPillar created successfully", data);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<BrandPillarResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const timeline = await BrandPillar.findByPk(id);

      if (!timeline) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      successResponse(res, "Success", timeline);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const update = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<BrandPillarResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error, value } = BrandPillarSchema.validate(req.body, {
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
      const record = await BrandPillar.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      await BrandPillar.update(value, { where: { id } });

      successResponse(
        res,
        "BrandPillar updated successfully",
        await BrandPillar.findByPk(id)
      );
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
      const record = await BrandPillar.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found",
        });
      }

      await BrandPillar.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "BrandPillar Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
