import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responseHandler.util";
interface Admin {
  id: number; 
  name:string;
  email:string;
}


declare global {
  namespace Express {
    interface Request {
      admin?: Admin;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate("jwt", { session: false }, (err: Error | null, admin: any) => {
    if (err) {
      return errorResponse(res, "Internal server error" ,{},500);
    }
    if (!admin) {
      console.warn("❌ Unauthorized: Invalid token or user not found");
      return errorResponse(res, "Unauthorized" ,{},401);
    }
    console.debug("🔍 Passport returned user:", admin);
    try {
      const { password, ...adminWithoutPassword } = admin;
      req.user = adminWithoutPassword; 
      next();
    } catch (error) {
      console.error("❌ Error processing authentication:", error);
      return errorResponse(res,"Authentication error",{},500);
    }
  })(req, res, next);
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {

    if (!req.user || !("role" in req.user) || typeof req.user.role != "string") {
      return errorResponse(res,"Forbidden: No role found",{},403);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res,"Forbidden: Insufficient permissions",{},403);;
    }

    next();
  };
};
