import { Response } from "express";

export const successResponse = (
    res: Response,
    message: string,
    data: any = {},
    status: number = 200
): void => {
    res.status(status).json({
        message,
        success: true,
        data,
    });
};

export const errorResponse = (
    res: Response,
    message: string,
    error: any = {},
    status: number = 500
): void => {
    res.status(status).json({
        message,
        success: false,
        error,
    });
};