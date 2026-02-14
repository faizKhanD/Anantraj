import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { logger } from "../../config/logger.config";
import { Admin } from "../../models/admins.model";
import { errorResponse, successResponse } from "../../utils/responseHandler.util";
import { registerAdminSchema } from "../../validation/admin/auth/registeradmin.validate";
import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from "ms"; // this comes from the ms package

import { RegisterAdminRequestBody, AdminResponse, AdminCreationResponse,
  LoginRequestBody,
  LoginSuccessResponse

 } from "../../interfaces/admin.interface";
export const getAdminProfile = asyncHandler(async (req: Request, res: Response<AdminResponse>, next: NextFunction) => {
  try {
    if (!req.user) {
      return errorResponse(res, "Unauthorized: User not found", {}, 401);
    }
    successResponse(res, "Admin profile retrieved successfully", req.user);
  } catch (error: any) {
    logger.error(`❌ Error retrieving admin profile: ${error.stack}`);
    return next(error);
  }
});
export const registerAdmin = asyncHandler(async (req: Request<{}, {}, RegisterAdminRequestBody>, res: Response<AdminCreationResponse>, next: NextFunction) => {
  const { error } = registerAdminSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return next({
      status: 400,
      message: "Validation failed",
      details: error.details.map(err => err.message)
    });
  }
  const { email, name, password, phone_number } = req.body;
  try {

    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [
          { email: email }
        ]
      }
    });
    if (existingAdmin) {
      return next({
        status: 409,
        message: "Same email already exists"
      });
    }
    const admin = await Admin.create({
      name, email,
      phone_number,
      password: password
    });

    logger.info(`✅ Admin created successfully `);
    successResponse(res, "Admin created successfully, credentials sent via email", {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      phone_number: admin.phone_number,
    }, 201);
  } catch (error: any) {
    logger.error(`❌ Database Error: ${error.message}`);
    next(error);
  }
});

export const loginAdmin = 
    async (req: Request<{}, {}, LoginRequestBody>, res: Response<LoginSuccessResponse>, next: NextFunction) => {
        const { email, password } = req.body;
       
        if (!email || !password) {
            return next({
                status: 400,
                message: "Email and password are required",
                data: { email: !email, password: !password },
            });
        }
        try {
            const admin: Admin | null = await Admin.findOne({
                where: { email},
                attributes: ["id", "email","password"],
            });

            if (!admin) {
                return next({
                    status: 404,
                    message: 'Admin not found or not active',
                });
            }
            if (!admin.password) {
                return next({
                    status: 500,
                    message: "Internal server error: Password not found",
                });
            }
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return next({
                    status: 401,
                    message: 'Invalid password',
                });
            }
            const payload = { id: admin.id, email: admin.email, usertype: "admin" };
            const expiresIn: StringValue = (process.env.ANANTRAJ_JWT_EXPIRATION as StringValue) || "6h";
            const options: SignOptions = { expiresIn };
            const token = jwt.sign(
              payload,
              process.env.ANANTRAJ_JWT_SECRET as string,
              options
            );
            return successResponse(res, 'Login successful', {
                id: admin.id,
                email: email,
                token,
            });
        } catch (error: any) {
            return next(error);
        }
    }
