import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";

import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import fs from 'fs';
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../../utils/upload";
import StreamFile from "../../models/streamFiles.model";
import { CompleteMultipartUploadCommand, CreateMultipartUploadCommand, UploadPartCommand } from "@aws-sdk/client-s3";
const uploadProgress: Record<string, { percent: number }> = {};

const Bucket = process.env.ANANTRAJ_S3_BUCKET_NAME!;
export const startMultipartUpload = async (req: Request, res: Response) => {
  const { fileName, fileType } = req.body;

  const command = new CreateMultipartUploadCommand({
    Bucket,
    Key: `uploads/${Date.now()}-${fileName}`,
    ContentType: fileType,
  });

  const response = await s3Client.send(command);
  res.json({
    uploadId: response.UploadId,
    key: response.Key,
  });
};

export const uploadPart = async (req: Request, res: Response) => {
   const { uploadId, partNumber, key } = req.query;

  const contentLength = req.headers['content-length'];
  if (!contentLength) {
    return res.status(400).json({ error: "Missing Content-Length header" });
  }
  const body = req; // the chunk body
  const command = new UploadPartCommand({
    Bucket,
    Key: key as string,
    PartNumber: Number(partNumber),
    UploadId: uploadId as string,
    Body: body,
     ContentLength: Number(contentLength), // ✅ FIX
  });
  const response = await s3Client.send(command);
  res.json({
    ETag: response.ETag,
    PartNumber: Number(partNumber),
  });
};


export const completeMultipartUpload = async (req: Request, res: Response) => {
  const { uploadId, key, parts } = req.body;

  const command = new CompleteMultipartUploadCommand({
    Bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts, // [{ETag, PartNumber}, ...]
    },
  });

  const response = await s3Client.send(command);
  res.json({
    location: response.Location,
    key: response.Key,
  });
};


export const deleteStream = asyncHandler(
  async (
    req: Request<{ type: string, file:string }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { type ,file} = req.params;
      const record = await StreamFile.findOne({where:{type,file}});
      if (!record) {
        next({
          status: 404,
          message: "Record Not Found"
        })
      }
      record?.file && await deleteFileFromS3(record.file);
      await StreamFile.destroy(
        {where:{type,file}}
      )
      next({
        status: 200,
        message: "Record Deleted Successfully"
      });
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }

  }
);

