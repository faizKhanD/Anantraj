import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { BlogSchema } from "../../validation/admin/auth/blog.validate";
import {getPresignedUrl } from '../../utils/s3';
import {
  BlogRequestBody,
  BlogResponseBody,
} from "../../interfaces/blog.interface";
import Blog from "../../models/blog.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const AddBlog = asyncHandler(
  async (
    req: MulterRequest<BlogRequestBody>,
    res: Response<BlogResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = BlogSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
  //  const file= (req.file as Express.MulterS3.File)?.key || null;
  const image = (req.files as any)?.image?.[0]?.key || null;


  const mobile_image = (req.files as any)?.mobile_image?.[0]?.key || null;


  const blogData: BlogRequestBody = req.body;
      const {
        title,
        slug,
        short_description,
        long_description,
        alt,
        meta_title,
        meta_description,
        meta_keywords,
        seo_tags,
        status,
        date_at,
      } =blogData;
      const blog = await Blog.create({
        title,
        slug,
        short_description,
        image: image,
        mobile_image: mobile_image,
        alt,
        long_description,
        meta_title,
        meta_description,
        meta_keywords,
        seo_tags,
        status,
        date_at: date_at ? date_at : null,
      });

      if (blog?.image) {
        blog.image = await getPresignedUrl(blog.image, 60 * 60 * 24);
      }
      if (blog?.mobile_image) {
        blog.mobile_image = await getPresignedUrl(blog.mobile_image, 60 * 60 * 24);
      }
      const Records = {
        ...blog?.toJSON(),
      };

      successResponse(res, "Blog created successfully", blog);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const UpdateBlog = asyncHandler(
  async (
    req: MulterRequest<BlogRequestBody> & { params: { id: string } }, 
    res: Response<BlogResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = BlogSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const { id } = req.params;
      const blog = await Blog.findByPk(id);
      if (!blog) {
        next({
          status: 404,
          message: "Blog Not Found",
        });
      }

      const files = req.files as { [fieldname: string]: Express.MulterS3.File[] } | undefined;
 
      let image = blog?.image || null;
      let mobile_image = blog?.mobile_image || null;
      if (files?.image?.[0]) {
        image = files.image[0].key;
      }

      if (files?.mobile_image?.[0]) {
        mobile_image = files.mobile_image[0].key;
      }

      if(blog?.image && (req.files as any)?.image){
        // await deleteFileFromS3(blog?.image);
      }

      if(blog?.mobile_image && (req.files as any)?.mobile_image){
        // await deleteFileFromS3(blog?.mobile_image);
      }

      await Blog.update(
      {
        ...req.body,
        image,
        mobile_image,
        date_at: req.body.date_at ? req.body.date_at : null, // ✅ convert here
      },
      {
        where: { id },
      }
    );

      next({
        status: 200,
        message: "Blog Updated Succssfully",
      });
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
      const blog = await Blog.findByPk(id);
      if (!blog) {
        next({
          status: 404,
          message: "Blog Not Found",
        });
      }

      if(blog?.image && (req.files as any)?.image){
        await deleteFileFromS3(blog?.image);
      }

      if(blog?.mobile_image && (req.files as any)?.mobile_image){
        await deleteFileFromS3(blog?.mobile_image);
      }


      await Blog.destroy({
        where: { id },
      });

      next({
        status: 200,
        message: "Blog Deleted Successfully",
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const Index = asyncHandler(
  async (req: Request<{}, {}>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { tab, search } = req.query;
      const where: any = {};
      if (search) {
        where[Op.or] = ["title", "short_description"].map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }
      const blogs = await Blog.findAndCountAll({
        where,
        limit,
        offset,
      });
      const result = await Promise.all(
        blogs.rows.map(async (blog: any) => {
          let imageUrl = null;
          if (blog.image) {
            blog.image  = await getPresignedUrl(blog.image, 60 * 60 * 24); // 24h
          }

          if (blog.mobile_image) {
            blog.mobile_image  = await getPresignedUrl(blog.mobile_image, 60 * 60 * 24); // 24h
          }
          return { ...blog.toJSON(), imageUrl };
        })
      );

      const totlaRecords = blogs.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Blogs retrieved successfully", {
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

export const EditBlog = asyncHandler(
  async (
    req: Request<{ id: string }, {}>,
    res: Response<BlogResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const blog = await Blog.findByPk(id);
      if (!blog) {
        next({
          status: 404,
          message: "Blog Not Found",
        });
      }

      if (blog?.image) {
        blog.image  = await getPresignedUrl(blog.image, 60 * 60 * 24); // 24h
      }

      if (blog?.mobile_image) {
        blog.mobile_image  = await getPresignedUrl(blog.mobile_image, 60 * 60 * 24); // 24h
      }
      
      successResponse(res, "Success", blog);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);
