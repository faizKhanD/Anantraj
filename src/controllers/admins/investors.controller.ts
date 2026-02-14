import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../utils/s3";
import {
  InvestorsRequestBody,
  InvestorsResponseBody,
  StatusRequestBody,
} from "../../interfaces/investors.interface";
import { InvestorSchema } from "../../validation/admin/investors.validate";
import { InvestorsModel } from "../../models/investors.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import { Op, Sequelize } from "sequelize";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import { buildHierarchy } from "../../utils/helper.utils"
import { receiveMessageOnPort } from "worker_threads";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}


export const Index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { filterTitle, filterParentId ,search} = req.query;
      const where: any = {};
      if (search) {
        where[Op.or] = ["title"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }


      const data = await InvestorsModel.findAndCountAll({
        where,
        order: [["created_at", "ASC"]],
        
      });

      const rows = await Promise.all(
        data.rows.map(async (item: any) => {
          const jsonItem = item.toJSON();

          // main file → signed URL
          jsonItem.file = jsonItem.file
            ? await getPresignedUrl(jsonItem.file, 60 * 60 * 24)
            : null;

          // file_list → replace value with signed URL but keep same key
          if (jsonItem.file_list && Array.isArray(jsonItem.file_list)) {
            jsonItem.file_list = await Promise.all(
              jsonItem.file_list.map(async (f: Record<string, string>) => {
                const entries = Object.entries(f);

                // make sure there's at least one entry
                const firstEntry = entries[0];
                if (!firstEntry) return f; // nothing to process

                const [key, value] = firstEntry; // now TS is happy

                if (typeof value === "string" && value !== "-") {
                  return {
                    [key]: await getPresignedUrl(value, 60 * 60 * 24),
                  };
                }

                return { [key]: value };
              })
            );
          }

          return jsonItem;
        })
      );

      // build hierarchy
      const hierarchy = buildHierarchy(rows, filterTitle as number | undefined, filterParentId as number | undefined);

      successResponse(res, "Investors retrieved successfully", {
        data: hierarchy,
      });
      
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
 

export const store = asyncHandler(
  async (
    req: MulterRequest<InvestorsRequestBody>,
    res: Response<InvestorsResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = InvestorSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const file= (req.files as any)?.file?.[0]?.key || null
      const q_1 = (req.files as any)?.q_1?.[0]?.key || '-';
      const q_2 = (req.files as any)?.q_2?.[0]?.key || '-';
      const q_3 = (req.files as any)?.q_3?.[0]?.key || '-';
      const q_4 = (req.files as any)?.q_4?.[0]?.key || '-';

  
      const Data: InvestorsRequestBody = req.body;
      let DataDesc: Record<string, any> | null = null;
      
      if (Data.other) {
        if (typeof Data.other === "string") {
          try {
            DataDesc = JSON.parse(Data.other);
          } catch (error : any) {
            next(error);
          }
        } else if (typeof Data.other === "object") {
          DataDesc = Data.other;
        }
      }
      
      const {
        parent_id,
        year,
        title,
        permissions,
        description,
        link,
        seq,
      } = Data;


      const  file_list = [
        { q_1 },
        { q_2 },
        { q_3 },
        { q_4 },
      ];
      // Build Sequelize literal safely
      let file_list_literal;
      if (file_list.length) {
        file_list_literal = Sequelize.literal(`ARRAY[
          '${JSON.stringify(file_list[0])}'::jsonb,
          '${JSON.stringify(file_list[1])}'::jsonb,
          '${JSON.stringify(file_list[2])}'::jsonb,
          '${JSON.stringify(file_list[3])}'::jsonb
        ]`);
      } else {
        file_list_literal = Sequelize.literal(`ARRAY[]::jsonb[]`);
      }
      console.log('file_list_literal',file_list_literal)
      console.log('file_list',file_list)
            
      
      const Records = await InvestorsModel.create({
        parent_id,
        year,
        title,
        file: file,
        file_list: file_list_literal,
        other: DataDesc,
        description,
        permissions,
        link,
        seq,
      });

      Records.file = Records?.file ? await getPresignedUrl(Records.file, 60 * 60 * 24) : null;

      successResponse(res, "Investors created successfully", Records);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const edit = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<InvestorsResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const record = await InvestorsModel.findByPk(id);

      if (!record) {
        return next({
          status: 404,
          message: "Record Not Found",
        });
      }

      let files = record?.file ? await getPresignedUrl(record.file, 60 * 60 * 24) : null;
      
      const Data = {
        ...record.toJSON(),
        file: files,
      };

      successResponse(res, "Investor record retrieved successfully", Data);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const update = asyncHandler(
  async (
    req: MulterRequest<InvestorsRequestBody>,
    res: Response<InvestorsResponseBody>,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id; // record id from route
      if (!id) {
        return next({ status: 400, message: "Missing investor ID" });
      }

      // Validate request body
      const { error } = InvestorSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const Data: InvestorsRequestBody = req.body;
      let DataDesc: Record<string, any> | null = null;
      if (req.body.other) {
        if (typeof req.body.other === "string") {
          try {
            DataDesc = JSON.parse(req.body.other);
          } catch (e) {
            throw new Error("Invalid JSON format for 'other'");
          }
        } else if (typeof req.body.other === "object") {
          DataDesc = req.body.other;
        }
      }

      const {
        parent_id,
        year,
        title,
        permissions,
        link,
        description,
        seq,
      } = Data;

      // Find existing record
      const record = await InvestorsModel.findByPk(id);
      if (!record) {
        return next({ status: 404, message: "Investor not found" });
      }

      // Handle file replacement
      const newFile = (req.files as any)?.file?.[0]?.key || null;
      let fileToSave = record.file;

      if (newFile) {
        // delete old file if it existed
        if (record.file) {
          await deleteFileFromS3(record.file);
        }
        fileToSave = newFile;
      }


      type QuarterlyFiles = { q_1?: string; q_2?: string; q_3?: string; q_4?: string };
      const oldFileList = (record.file_list as QuarterlyFiles[]) || [];


      // Handle quarterly files (q_1–q_4)
      const q_1 = (req.files as any)?.q_1?.[0]?.key || oldFileList[0]?.q_1 || '-';
      const q_2 = (req.files as any)?.q_2?.[0]?.key || oldFileList[1]?.q_2 || '-';
      const q_3 = (req.files as any)?.q_3?.[0]?.key || oldFileList[2]?.q_3 || '-';
      const q_4 = (req.files as any)?.q_4?.[0]?.key || oldFileList[3]?.q_4 || '-';
 
      const newFiles = { q_1, q_2, q_3, q_4 };

      
      for (const [key, value] of Object.entries(newFiles)) {
        const k = key as keyof QuarterlyFiles; // tell TS that key is valid
        const oldVal = oldFileList?.find((f) => f[k])?.[k];
        if (value && value !== "-" && oldVal && oldVal !== value) {
          await deleteFileFromS3(oldVal);
        }
      }
      const file_list = [
        { q_1 },
        { q_2 },
        { q_3 },
        { q_4 },
      ];

      const file_list_literal = Sequelize.literal(`ARRAY[
        '${JSON.stringify(file_list[0])}'::jsonb,
        '${JSON.stringify(file_list[1])}'::jsonb,
        '${JSON.stringify(file_list[2])}'::jsonb,
        '${JSON.stringify(file_list[3])}'::jsonb
      ]`);

      // Update record
      await record.update({
        parent_id,
        year,
        title,
        file: fileToSave,
        file_list: file_list_literal,
        other: DataDesc,
        description,
        link,
        permissions,
        seq,
      });

      // Add signed URL
      record.file = record?.file
        ? await getPresignedUrl(record.file, 60 * 60 * 24)
        : null;

      successResponse(res, "Investor updated successfully", record);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);



export const getInvestorListing = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await InvestorsModel.findAll({
        attributes: ["id", "title", "parent_id"],
        order: [["id", "ASC"]],
        raw: true,
      });

      // build a map for easy lookup
      const map: Record<number, any> = {};
      data.forEach((item) => {
        map[item.id] = item;
      });

      // recursive function to build path
      const buildPath = (item: any): string => {
        if (!item.parent_id) return item.title;
        const parent = map[item.parent_id];
        if (!parent) return item.title; // orphan case
        return buildPath(parent) + " < " + item.title;
      };

      const list = data.map((item) => ({
        id: item.id,
        parent_id: item.parent_id,
        path: buildPath(item), // 👈 navigation path
      }));

      successResponse(res, "Investor list retrieved successfully", {
        data: list,
      });
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
      const record = await InvestorsModel.findByPk(id);
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }

      record?.file && await deleteFileFromS3(record.file);

       // Delete all file_list files
      if (record?.file_list && Array.isArray(record.file_list)) {
        for (const f of record.file_list) {
          const entries = Object.entries(f);
          const firstEntry = entries[0];
          if (firstEntry) {
            const [, value] = firstEntry;
            if (typeof value === "string" && value !== "-") {
              await deleteFileFromS3(value);
            }
          }
        }
      }


      await InvestorsModel.destroy({
        where: { parent_id:id }
      })


      await InvestorsModel.destroy({
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



export const destroyFile = asyncHandler(
  async (
    req: Request<{ id: number, key: string }, {}, { key?: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, key } = req.params;
      // const { key } = req.body; // "file" | "q_1" | "q_2" | "q_3" | "q_4"

      if (!key) {
        return next({ status: 400, message: "File key is required" });
      }

      const record = await InvestorsModel.findByPk(id);
      if (!record) {
        return next({ status: 404, message: "Record Not Found" });
      }

      if (key === "file") {
        // Delete main file
        if (record.file) {
          await deleteFileFromS3(record.file);
          await record.update({ file: null });
        }
      } else {

        const fileList = (record.file_list as Record<string, string>[]) || [];
        const updatedList: Record<string, string>[] = [];

        for (const f of fileList) {
          const entries = Object.entries(f);
          const firstEntry = entries[0];

          if (!firstEntry) {
            updatedList.push(f);
            continue;
          }

          const k = firstEntry[0];
          const v = firstEntry[1];
 
          if (k === key && typeof v === "string" && v !== "-") {
            
            await deleteFileFromS3(v);
            
            console.log(updatedList)
          
            updatedList.push({ [k]: "-" });
          } else {
            updatedList.push(f);
          }
        }

          const file_list_literal = Sequelize.literal(`ARRAY[
            '${JSON.stringify(updatedList[0])}'::jsonb,
            '${JSON.stringify(updatedList[1])}'::jsonb,
            '${JSON.stringify(updatedList[2])}'::jsonb,
            '${JSON.stringify(updatedList[3])}'::jsonb
          ]`);


        await record.update({ file_list: file_list_literal });
      }

      successResponse(res, "File deleted successfully", record);



    } catch (error: any) {
      logger.error(`❌ File Delete Error: ${error.message}`);
      next(error);
    }
  }
);