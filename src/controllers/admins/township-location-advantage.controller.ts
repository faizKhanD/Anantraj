import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getPresignedUrl } from "../../utils/s3";
import { TownShipLocationModel } from "../../models/TownshipLocation.model";
import { ProjectLocationDestinationModel } from "../../models/projects/projectLocationDestination.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import {
  LocationRequestBody,
  LocationResponseBody,
} from "../../interfaces/township.interface";
import { LocationSchama, LocationUpdateSchama } from "../../validation/admin/platter";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import { Op } from "sequelize";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}



export const indexLocation = asyncHandler(
  async (req: Request<{id:number}, {}>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      const { id } = req.params;

        const where: any = {};
            if (search) {
              where[Op.or] = ["title"].map((field) => ({
                [field]: { [Op.iLike]: `%${search}%` },
              }));
            }
      

    
      const award = await TownShipLocationModel.findAndCountAll({
        where,
        limit,
        offset,
      });

      const result = await Promise.all(
        award.rows.map(async (data: any) => {
          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24); // 24h
          }
          return { ...data.toJSON() };
        })
      );

      const totlaRecords = award.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Location retrieved successfully", {
        data: result,
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


export const storeLocation = asyncHandler(
  async (
    req: MulterRequest<LocationRequestBody>,
    res: Response<LocationResponseBody>,
    next: NextFunction
  ) => {
    try {

      const { error } = LocationSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const requestData: LocationRequestBody = req.body;
      const { title, distance_time } = requestData;

      const response = await TownShipLocationModel.create({
        title,
        distance_time,  
        status: 1,
      });
      
      successResponse(res, "Location created successfully", response);
    
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const editLocation = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<LocationRequestBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await TownShipLocationModel.findByPk(id);
 
      if (!response) {
        next({
          status: 404,
          message: "Location Not Found",
        });
      }
  
      successResponse(res, "Success", response);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const updateLocation = asyncHandler(
  async (
    req: MulterRequest<LocationRequestBody> & { params: { id: string } },
    res: Response<LocationResponseBody>,
    next: NextFunction
  ) => {
    try {
      
      const { error } = LocationUpdateSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const result = await TownShipLocationModel.findByPk(id);
      if (!result) {
        next({
          status: 404,
          message: "Location Not Found",
        });
      }

     
      const requedtData: LocationRequestBody = req.body;
      const { title, distance_time, status } = requedtData;
      const response = await  TownShipLocationModel.update(
        {
          title,
          distance_time,
          status: 1,
        },
        {
          where: { id },
        }
      );

      const data = await TownShipLocationModel.findByPk(id);
       
      successResponse(res, "Location Updated successfully", data);

    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const destroyLocation = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await TownShipLocationModel.findByPk(id);

      if (!record) {
        next({
          status: 404,
          message: "Location Not Found",
        });
      }
 
      await TownShipLocationModel.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "Record Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

 