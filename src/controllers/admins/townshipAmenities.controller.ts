import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { OtherSections } from "../../validation/admin/auth/page.validate";
import { getPresignedUrl } from '../../utils/s3';
import deleteFileFromS3 from '../../utils/bucket.deleted.file';
import {
  OtherSectionsRequestBody,
} from "../../interfaces/page.interface";
import OtherSectionModel from "../../models/otherSections.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { tryEach } from "async";
import { paginate } from "../../utils/paginate.util";
import { Op, WhereOptions } from "sequelize";

import { TownShipAmenitiesRequestBody } from "../../interfaces/township.interface";
import { TownshipAmenities } from "../../validation/admin/township";
import {TownshipAmenitiesModel} from "../../models/township-amenities.model";




interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}
export const Store = asyncHandler(
  async (
    req: MulterRequest<TownShipAmenitiesRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { error } = TownshipAmenities.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const {
        amenities_logo_id,
        title,
        alt_text,
      } = req.body;


      const findRecord = await TownshipAmenitiesModel.findOne({
        where: {
          amenities_logo_id: amenities_logo_id,
        }
      });

      if (findRecord) {

        const mobile_file = (req.files as any)?.mobile_file?.[0]?.key || null;
        const desktop_file = (req.files as any)?.desktop_file?.[0]?.key || null;


        const oldBanner = findRecord.banner as { mobile_file?: string; desktop_file?: string } | null;
        const banner: Record<string, any> = {
          mobile_file: oldBanner?.mobile_file,
          desktop_file: oldBanner?.desktop_file,
        };
        if (mobile_file && oldBanner?.mobile_file) {
          await deleteFileFromS3(oldBanner.mobile_file);
        }
        if (desktop_file && oldBanner?.desktop_file) {
          await deleteFileFromS3(oldBanner.desktop_file);
        }

        if (mobile_file) {
          banner.mobile_file = mobile_file;
        }

        if (desktop_file) {
          banner.desktop_file = desktop_file;
        }
        const data = await findRecord.update({
          title: title ?? null,
          banner,
          alt_text,
          status: '1'
        });
        if (data.banner) {
          const mobile_image = (data.banner as any).mobile_file;
          const desktop_file = (data.banner as any).desktop_file;

          (data.banner as any).mobile_file = mobile_image ? await getPresignedUrl(mobile_image, 60 * 60 * 24) : null;
          (data.banner as any).desktop_file = desktop_file ? await getPresignedUrl(desktop_file, 60 * 60 * 24) : null;
        }



        return successResponse(res, `amenities  updated
       successfully`, data);

      } else {

        const mobile_file = (req.files as any)?.mobile_file?.[0]?.key || null;
        const desktop_file = (req.files as any)?.desktop_file?.[0]?.key || null;
        const banner: object = {
          mobile_file, desktop_file
        }
        const data = await TownshipAmenitiesModel.create({
          title: title ?? null,
          banner,
          alt_text,
          status: '1',
          amenities_logo_id,
        });


        if (data.banner) {
          const mobile_image = (data.banner as any).mobile_file;
          const desktop_file = (data.banner as any).desktop_file;

          (data.banner as any).mobile_file = mobile_image ? await getPresignedUrl(mobile_image, 60 * 60 * 24) : null;
          (data.banner as any).desktop_file = desktop_file ? await getPresignedUrl(desktop_file, 60 * 60 * 24) : null;
        }



        return successResponse(res, `amenities added successfully`, data);
      }

    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Index = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const { limit, offset, page } = paginate(req.query);
      const { tab, search } = req.query;

      const where: any = {};
      if (search) {
        where[Op.or] = ["title"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const sections = await TownshipAmenitiesModel.findAndCountAll({
        where,
        limit,
        offset,
      })

      if (!sections) {
        return next({
          status: 404,
          message: "Page Not Found",
        });
      }


      const result = await Promise.all(
        sections.rows.map(async (item: any) => {

          const mobile_image = (item.banner as any).mobile_file;
          const desktop_file = (item.banner as any).desktop_file;
          (item.banner as any).mobile_file = mobile_image ? await getPresignedUrl(mobile_image, 60 * 60 * 24) : null;
          (item.banner as any).desktop_file = desktop_file ? await getPresignedUrl(desktop_file, 60 * 60 * 24) : null;


          return item;
        })
      );



      const totlaRecords = sections.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Amenties retrieved successfully", {
        data:result,
        pagination: {
          totlaRecords,
          totalPages,
          page: page,
          limit: limit,
        },      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const Delete = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await TownshipAmenitiesModel.findByPk(id);
      if (!result) {
        next({
          status: 404,
          message: "Amenities Not Found",
        });
      }

      const oldBanner = result?.banner as { mobile_file?: string; desktop_file?: string } | null;

      if (oldBanner?.mobile_file) {
        await deleteFileFromS3(oldBanner.mobile_file);
      }
      if (oldBanner?.desktop_file) {
        await deleteFileFromS3(oldBanner.desktop_file);
      }


      await TownshipAmenitiesModel.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: " Amenities Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);



export const Show = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await TownshipAmenitiesModel.findByPk(id);
      if (!result) {
        next({
          status: 404,
          message: "Amenities Not Found",
        });
      }

     
      if (result?.banner) {
        const mobile_image = (result.banner as any).mobile_file;
        const desktop_file = (result.banner as any).desktop_file;

        (result.banner as any).mobile_file = mobile_image ? await getPresignedUrl(mobile_image, 60 * 60 * 24) : null;
        (result.banner as any).desktop_file = desktop_file ? await getPresignedUrl(desktop_file, 60 * 60 * 24) : null;
      }



      return successResponse(res, `amenities retrived successfully`, result);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
