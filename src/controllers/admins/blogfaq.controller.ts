import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { BlogFaqSchema } from "../../validation/admin/auth/blogfaq.validate";
import {getPresignedUrl } from '../../utils/s3';
import {
  BlogFaqRequestBody,
  BlogFaqResponseBody,
} from "../../interfaces/blogfaq.interface";
import BlogFaq from "../../models/blogfaq.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const AddBlogFaq = asyncHandler(
  async (
    req: MulterRequest<BlogFaqRequestBody>,
    res: Response<BlogFaqResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = BlogFaqSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      
     const { id } = req.params;  // blog ID from URL

      const blogData: BlogFaqRequestBody = req.body;
      const { question, answer } = blogData;  // only destructure question & answer

      console.log("Blog ID:", id);  // log blog ID to verify

      const blogFaq = await BlogFaq.create({   // assuming your model is BlogFaq
        blog_id: id as any,  // assign blog ID here
        question,
        answer,
      });

     

      successResponse(res, "Blog created successfully", blogFaq);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const UpdateBlogFaq = asyncHandler(
  async (
    req: MulterRequest<BlogFaqRequestBody> & { params: { blog_id: number, id: string } }, 
    res: Response<BlogFaqResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = BlogFaqSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const blog = await BlogFaq.findByPk(id);
      if (!blog) {
        next({
          status: 404,
          message: "Blog Not Found",
        });
      }
      
      await BlogFaq.update(
      {
        ...req.body,
      },
      {
        where: { id },
      }
    );

      next({
        status: 200,
        message: "BlogFaq Updated Succssfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const DeleteFaq = asyncHandler(
  async (
    req: Request<{ id: number }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const blog = await BlogFaq.findByPk(id);
      if (!blog) {
        next({
          status: 404,
          message: "BlogFaq Not Found",
        });
      }
 

      await BlogFaq.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "BlogFaq Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Index = asyncHandler(
  async (req: Request<{id: number}, {}>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { id }  = req.params; // blog ID from URL
      const { tab, search } = req.query;
      const where: any = { blog_id : id };
      if (search) {
        where[Op.or] = ["title", "short_description"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }
      const blogs = await BlogFaq.findAndCountAll({
        where,
        limit,
        offset,
      });
       

      const totlaRecords = blogs.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Blogs retrieved successfully", {
        data:blogs.rows,
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

export const EditBlogFaq = asyncHandler(
  async (
    req: Request<{ blog_id: number, id: string }, {}>,
    res: Response<BlogFaqResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      console.log('edit id', id);
      const blog = await BlogFaq.findByPk(id);
      if (!blog) {
        next({
          status: 404,
          message: "BlogFaq Not Found",
        });
      }

      
      successResponse(res, "Success", blog);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
