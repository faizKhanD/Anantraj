import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import {
  SubTypologySchema,
  TypologySchema,
  UpdateSubTypologySchema,
  UpdateTypologySchema,
} from "../../validation/admin/typologies";
import {
  SubTypologyRequestBody,
  TypologyRequestBody,
  TypologyResponseBody,
} from "../../interfaces/typologies.interface";
import Typology from "../../models/typologies.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import SubTypology from "../../models/subtypologies.model";

export const AddTypology = asyncHandler(async (req, res, next) => {
  try {
    const { error } = TypologySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return next({
        status: 400,
        message: "Validation failed",
        details: error.details.map((e) => e.message),
      });
    }

    const typology = await Typology.create({
      name: req.body.name,
      status: req.body.status ?? 1,
    });

    successResponse(res, "Typology created successfully", typology);
  } catch (error: any) {
    logger.error(`Database Error: ${error.message}`);
    next(error);
  }
});

export const UpdateTypology = asyncHandler(
  async (
    req: Request<{ id: string }, {}, Partial<TypologyRequestBody>>,
    res: Response<TypologyResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = UpdateTypologySchema.validate(req.body, {
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
      const typology = await Typology.findByPk(id);

      if (!typology) {
        return next({ status: 404, message: "Typology not found" });
      }

      await typology.update(req.body);

      successResponse(res, "Typology updated successfully", typology);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const DeleteTypology = asyncHandler(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const typology = await Typology.findByPk(id);
      if (!typology) {
        return next({ status: 404, message: "Typology not found" });
      }

      await Typology.destroy({ where: { id } });
      successResponse(res, "Typology deleted successfully", null);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const GetTypologies = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query as any);
      const { search, status } = req.query;

      const where: any = {};

      if (search) {
        where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

      if (status !== undefined) {
        where.status = Number(status);
      }

      const { count, rows } = await Typology.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    const totlaRecords = count;
    const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Typologies retrieved successfully", {
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

export const GetTypologyById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const typology = await Typology.findByPk(id, {
        attributes: ["id", "name", "status"],
      });

      if (!typology) {
        return next({
          status: 404,
          message: "Typology Not Found",
        });
      }

      successResponse(res, "Typology retrieved successfully", typology);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

//Subtypologies

export const AddSubTypology = asyncHandler(async (req, res, next) => {
  try {
    const { error } = SubTypologySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return next({
        status: 400,
        message: "Validation failed",
        details: error.details.map((e) => e.message),
      });
    }

    const subtypology = await SubTypology.create({
      name: req.body.name,
      status: req.body.status ?? 1,
    });

    successResponse(res, "Sub Typology created successfully", subtypology);
  } catch (error: any) {
    logger.error(`Database Error: ${error.message}`);
    next(error);
  }
});

export const UpdateSubTypology = asyncHandler(
  async (
    req: Request<{ id: string }, {}, Partial<SubTypologyRequestBody>>,
    res: Response<SubTypologyRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = UpdateSubTypologySchema.validate(req.body, {
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
      const subtypology = await SubTypology.findByPk(id);
      if (!subtypology) {
        return next({ status: 404, message: "Sub Typology not found" });
      }

      await subtypology.update(req.body);
      successResponse(res, "Sub Typology updated successfully", subtypology);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const DeleteSubTypology = asyncHandler(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const subtypology = await SubTypology.findByPk(id);
      if (!subtypology) {
        return next({ status: 404, message: "Sub typology not found" });
      }

      await SubTypology.destroy({ where: { id } });
      successResponse(res, "Sub typology deleted successfully", null);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const GetSubTypologies = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query as any);
      const { search, status } = req.query;

      const where: any = {};

      if (search) {
        where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
      }

      if (status !== undefined) {
        where.status = Number(status);
      }

      const { count, rows } = await SubTypology.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      successResponse(res, "Sub Typologies retrieved successfully", {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const GetSubTypologyById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const subTypology = await SubTypology.findByPk(id, {
        attributes: ["id", "name", "status"],
      });
      if (!subTypology) {
        return next({
          status: 404,
          message: "SubTypology Not Found",
        });
      }

      successResponse(res, "SubTypology retrieved successfully", subTypology);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);
