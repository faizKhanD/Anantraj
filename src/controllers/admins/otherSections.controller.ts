import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { OtherSections } from "../../validation/admin/auth/page.validate";
import {getPresignedUrl } from '../../utils/s3';
import deleteFileFromS3 from '../../utils/bucket.deleted.file';
import {
  OtherSectionsRequestBody,
  PageRequestBody,
  PageResponseBody,
  StatusRequestBody,
} from "../../interfaces/page.interface";
import OtherSectionModel from "../../models/otherSections.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { tryEach } from "async";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";




interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}
export const Store = asyncHandler(
  async (
    req: MulterRequest<OtherSectionsRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { error } = OtherSections.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const {
      type,
      title,
      description,
      link,
      other,
      alt_text
      } =req.body;

   
    const findRecord=await OtherSectionModel.findOne({
      where:{
        type:type
      }
    });



let otherData: Record<string, any> | null = null;
        if (other) {
          if (typeof other === "string") {
          try {
             otherData = JSON.parse(other);
          } catch (e) {
            throw new Error("Invalid JSON format for 'other'");
          }
          } else if (typeof other === "object") {
          otherData = other; // already parsed JSON
          }
          }
          
    if(findRecord){

    
      const mobile_file = (req.files as any)?.mobile_file?.[0]?.key || null;
      const desktop_file = (req.files as any)?.desktop_file?.[0]?.key || null;
      

      const oldBanner = findRecord.banner as { mobile_file?: string; desktop_file?: string } | null;
      const banner: Record<string, any> = {
        mobile_file:oldBanner?.mobile_file,
        desktop_file:oldBanner?.desktop_file,
      };
        if(mobile_file && oldBanner?.mobile_file){
             await deleteFileFromS3(oldBanner.mobile_file);
        }
        if(desktop_file && oldBanner?.desktop_file){
             await deleteFileFromS3(oldBanner.desktop_file);
        }
        
          if (mobile_file) {
            banner.mobile_file = mobile_file;
          }

          if (desktop_file) {
            banner.desktop_file = desktop_file;
          }
        const data =await  findRecord.update({
        title:title ?? null,
        banner,
        description,
        other:otherData,
        alt_text,
        status:'1'
      });
      if(data.banner){
          const mobile_image=(data.banner as any).mobile_file;
          const desktop_file=(data.banner as any).desktop_file;

            (data.banner as any).mobile_file =  mobile_image? await getPresignedUrl(mobile_image, 60 * 60 * 24) :null;
          (data.banner as any).desktop_file = desktop_file ?await getPresignedUrl(desktop_file, 60 * 60 * 24) : null;
      }

    

      return successResponse(res, `${type} updated
       successfully`,data);

    }else{

      const mobile_file = (req.files as any)?.mobile_file?.[0]?.key || null;
      const desktop_file = (req.files as any)?.desktop_file?.[0]?.key || null;
      const banner :object={
        mobile_file,desktop_file
      }
      const data= await OtherSectionModel.create({
        type,
        title:title ?? null,
        banner,
        other:otherData,
        description,
        alt_text,
        status:'1'
      });
      

          if(data.banner){
          const mobile_image=(data.banner as any).mobile_file;
          const desktop_file=(data.banner as any).desktop_file;

            (data.banner as any).mobile_file =  mobile_image? await getPresignedUrl(mobile_image, 60 * 60 * 24) :null;
          (data.banner as any).desktop_file = desktop_file ?await getPresignedUrl(desktop_file, 60 * 60 * 24) : null;
      }

    
      
      return successResponse(res, `${type} created successfully`,data);
    }

    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const getSectionByType = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { type } = req.params;
    const  sections = await OtherSectionModel.findOne({
          where: { type: type as string },
        });

      if (!sections) {
        return next({
          status: 404,
          message: "Page Not Found",
        });
      }
      
      if(sections?.banner){
          const mobile_image=(sections.banner as any).mobile_file;
          const desktop_file=(sections.banner as any).desktop_file;
          (sections.banner as any).mobile_file =  mobile_image? await getPresignedUrl(mobile_image, 60 * 60 * 24) :null;
          (sections.banner as any).desktop_file = desktop_file ?await getPresignedUrl(desktop_file, 60 * 60 * 24) : null;
 }
     

      return successResponse(res, "Success", sections);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);



// export const Index = asyncHandler(
//   async (req: Request<{}, {}>, res: Response, next: NextFunction) => {
//     try {
//       const { limit, offset, page } = paginate(req.query);
//       const { tab, search } = req.query;
//       const where: any = {};
//       if (search) {
//         where[Op.or] = ["name", "short_description"].map((field) => ({
//           [field]: { [Op.iLike]: `%${search}%` },
//         }));
//       }
//       const data = await Page.findAndCountAll({
//         where,
//         limit,
//         offset,
//       });

//        const result = await Promise.all(
//         data.rows.map(async (data: any) => {
//           let imageUrl = null;
//           if (data.banner) {
//             imageUrl = await getPresignedUrl(data.banner, 60 * 60 * 24); // 24h
//           }
//           return { ...data.toJSON(), imageUrl };
//         })
//       );

//       successResponse(res, "Pages retrieved successfully", result);
//     } catch (error: any) {
//       logger.error(`❌ Database Error: ${error.message}`);
//       next(error);
//     }
//   }
// );
// export const Show = asyncHandler(
//   async (
//     req: Request,
//     res: Response<PageResponseBody>,
//     next: NextFunction
//   ) => {
//     try {
//       const { id, slug } = req.query;

//       let blog = null; // 👈 declare outside

//       if (id) {
//         blog = await Page.findByPk(id as string); // cast needed for TS
//       } else if (slug) {
//         blog = await Page.findOne({
//           where: { slug: slug as string },
//         });
//       }

//       if (!blog) {
//         return next({
//           status: 404,
//           message: "Page Not Found",
//         });
//       }

//       return successResponse(res, "Success", blog);
//     } catch (error: any) {
//       logger.error(`❌ Database Error: ${error.message}`);
//       next(error);
//     }
//   }
// );
