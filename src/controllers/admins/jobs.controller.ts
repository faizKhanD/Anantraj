import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import {
  SubTypologySchema,
  TypologySchema,
  UpdateSubTypologySchema,
  UpdateTypologySchema,
} from "../../validation/admin/typologies";

import Typology from "../../models/typologies.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import { JobSchema } from "../../validation/admin/jobs.validate";
import Jobs from "../../models/jobs.model";
import JobForm from "../../models/jobform.model";
import { getPresignedUrl } from "../../utils/s3";

export const Store = asyncHandler(async (req, res, next) => {
  try {
    const { error } = JobSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return next({
        status: 400,
        message: "Validation failed",
        details: error.details.map((e) => e.message),
      });
    }

    const job = await Jobs.create({
      job_title: req.body.job_title,
      location: req.body.location,
      education_required: req.body.education_required,
      experience_required: req.body.experience_required,
      skills_required: req.body.skills_required,
      status: req.body.status ?? 1,
    });

    successResponse(res, "Job created successfully", job);
  } catch (error: any) {
    logger.error(`Database Error: ${error.message}`);
    next(error);
  }
});

export const Update = asyncHandler(
  async (
    req: Request<{ id: string }, {}, {}>,
    res: Response<{}>,
    next: NextFunction
  ) => {
    try {
      const { error } = JobSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((e) => e.message),
        });
      }

      const { id } = req.params;
      const job = await Jobs.findByPk(id);

      if (!job) {
        return next({ status: 404, message: "Job not found" });
      }

      await job.update(req.body);

      successResponse(res, "Job updated successfully", job);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Delete = asyncHandler(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const job = await Jobs.findByPk(id);
      if (!job) {
        return next({ status: 404, message: "job not found" });
      }

     const result= await Jobs.destroy({ where: { id } });
      successResponse(res, "job deleted successfully", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query as any);
      const { search, status } = req.query;

      const where: any = {};

      if (search) {
        where[Op.or] = [{ job_title: { [Op.iLike]: `%${search}%` } }];
      }

      if (status !== undefined) {
        where.status = Number(status);
      }

      const { count, rows } = await Jobs.findAndCountAll({
        where,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

    const totlaRecords = count;
    const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Jobs retrieved successfully", {
        data: rows,
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

export const Show = asyncHandler(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const jobs = await Jobs.findByPk(id);

      if (!jobs) {
        return next({
          status: 404,
          message: "Job Not Found",
        });
      }

      successResponse(res, "Jobs retrieved successfully", jobs);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const getJobAllEnquiry = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query as any);
      const { search } = req.query;

      const where: any = {};

      if (search) {
        where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

    

      const result= await JobForm.findAndCountAll({
        where,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });


        const rows = await Promise.all(
          result.rows.map(async (item: any) => {
                item.resume = item.resume ? await getPresignedUrl(item.resume, 60 * 60 * 24) : null; // 24h
                return { ...item.toJSON() };
              })
            );

    const totlaRecords = result.count;
    const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Jobs Enquiry successfully", {
        data: rows,
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

