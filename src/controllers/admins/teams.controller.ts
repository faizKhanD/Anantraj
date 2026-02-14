import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { TeamSchema } from "../../validation/admin/teams.validate";
import { getPresignedUrl } from "../../utils/s3";
import {
  TeamRequestBody,
  TeamResponseBody,
  StatusRequestBody,
} from "../../interfaces/teams.interface";
import TeamCategories from "../../models/teamcategories.model";
import Team from "../../models/team.model";
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
        where[Op.or] = ["name", "designation"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const data = await Team.findAndCountAll({
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

      successResponse(res, "Teams retrieved successfully", {
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
    req: MulterRequest<TeamRequestBody>,
    res: Response<TeamResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = TeamSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
    }

      const file = (req.file as Express.MulterS3.File)?.key || null;
      const teamData: TeamRequestBody = req.body;

      
      

      const {
        name,
        is_team_board,
        designation,
        alt,
        short_description,
        long_description,
        status,
        is_leadership,
        home_seq,
        seq,
        directorship,
        din_number,
      } = teamData;

        let otherData: Record<string, any> | null = null;

        if (directorship) {
          if (typeof directorship === "string") {
            try {
              otherData = JSON.parse(directorship);
            } catch (e) {
              throw new Error("Invalid JSON format for 'other'");
            }
          } else if (typeof directorship === "object") {
            otherData = directorship; // already parsed JSON
          }
        }

      const data = await Team.create({
        name,
        is_team_board,
        designation,
        image: file,
        alt,
        short_description,
        long_description,
        is_leadership,
        home_seq,
        status,
        seq,
        directorship: otherData,
        din_number,
      });

        data.image = data.image ? await getPresignedUrl(data.image, 60 * 60 * 24) : null;
      

      const Records = {
        ...data?.toJSON(),
      };

      successResponse(res, "Team created successfully", Records);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<TeamResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await Team.findByPk(id);

      if (!record) {
        return next({
          status: 404,
          message: "Record Not Found",
        }); // ✅ return here to exit
      }


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
    res: Response<TeamResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = TeamSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const { id } = req.params;
      const record = await Team.findByPk(id);
      if (!record) {
        return next({
          status: 404,
          message: "Team Not Found",
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || record?.image;
      const updateData: Partial<TeamRequestBody> & { image?: string | null } = {
        ...req.body,
      };

      // ✅ Handle directorship (string → JSON or object)
      if (updateData.directorship) {
        let otherData: Record<string, any> | null = null;
        if (typeof updateData.directorship === "string") {
          try {
            otherData = JSON.parse(updateData.directorship);
          } catch (e) {
            return next({
              status: 400,
              message: "Invalid JSON format for 'directorship'",
            });
          }
        } else if (typeof updateData.directorship === "object") {
          otherData = updateData.directorship;
        }
        updateData.directorship = otherData;
      }

      // ✅ Handle image replacement
      if (file) {
        // delete old file if exists
        if (record.image) {
          await deleteFileFromS3(record.image);
        }
        updateData.image = file;
      }

      // Update record
      await Team.update(updateData, {
        where: { id },
      });

      // Fetch updated record
      const updatedRecord = await Team.findByPk(id);
      if (updatedRecord) {
        updatedRecord.image = updatedRecord.image
          ? await getPresignedUrl(updatedRecord.image, 60 * 60 * 24)
          : null;
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
      const record = await Team.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }

      record?.image && await deleteFileFromS3(record.image);

      await Team.destroy({
        where: { id }
      })

      next({
        status: 200,
        message: "Team Deleted Successfully"
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }

  }
);


export const getTeamCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await TeamCategories.findAndCountAll();
      successResponse(res, "Team Categories retrieved successfully", data);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const changeStatusLeadership = asyncHandler(
  async (
    req: Request<{ id: string }, {}, TeamResponseBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { is_leadership } = req.body;
      const record = await Team.findByPk(id);
      if (!record) {
        return next({
          status: 404,
          message: "Record Not Found",
        });
      }
      await Team.update(
        { is_leadership },
        { where: { id } }
      );
      successResponse(res, "Your Leadership selected successfully", null);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    } 
  }
);