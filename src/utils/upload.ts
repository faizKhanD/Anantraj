import multer, { StorageEngine } from "multer";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

interface S3File {
  key: string;
  location: string;
  size: number;
}

interface CustomMulterFile extends Express.Multer.File {
  key?: string;
  location?: string;
}

export const s3Client = new S3Client({

  region: process.env.ANANTRAJ_AWS_REGION || "ap-south-1",
  endpoint: process.env.ANANTRAJ_S3_ENDPOINT || "https://blob.anantrajlimited.com",
  forcePathStyle: true, // required for S3-compatible storage
  credentials: {
    accessKeyId: process.env.ANANTRAJ_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.ANANTRAJ_AWS_SECRET_ACCESS_KEY!,
  },

});

// Custom Multer Storage Engine
class S3Storage implements StorageEngine {
  async _handleFile(
    req: Express.Request,
    file: CustomMulterFile,
    cb: (error?: any, info?: Partial<S3File>) => void
  ): Promise<void> {
    try {
      const fileName = file.originalname || "uploaded_file";
      const key = `${Date.now()}-${fileName}`;

      const chunks: Buffer[] = [];
      file.stream.on("data", (chunk) => chunks.push(chunk));

      file.stream.on("end", async () => {
        try {
          const buffer = Buffer.concat(chunks);

          const command = new PutObjectCommand({
            Bucket: process.env.ANANTRAJ_S3_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: file.mimetype,
            //  ACL: "public-read"
          });

          await s3Client.send(command);

        
          const fileInfo: S3File = {
            key,
            location: `${process.env.ANANTRAJ_S3_ENDPOINT}/${process.env.ANANTRAJ_S3_BUCKET_NAME}/${key}`,
            size: buffer.length,
          };


          // Attach info on req.file
          file.key = fileInfo.key;
          file.location = fileInfo.location;

          cb(null, fileInfo);
        } catch (err) {
          cb(err as Error);
        }
      });

      file.stream.on("error", (err) => cb(err));
    } catch (err) {
      cb(err);
    }
  }

  _removeFile(
    _req: Express.Request,
    _file: CustomMulterFile,
    cb: (error: Error | null) => void
  ): void {
    // No cleanup needed, we don’t store files locally
    cb(null);
  }
}

// Export middleware
export const uploadMiddleware = multer({ storage: new S3Storage() });
