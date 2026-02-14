import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client ,DeleteObjectCommand } from "@aws-sdk/client-s3";
interface CustomMulterFile extends Express.Multer.File {
  name?: string;
}

const s3Client = new S3Client({

  region: process.env.ANANTRAJ_AWS_REGION || "ap-south-1",
  endpoint: process.env.ANANTRAJ_S3_ENDPOINT || "https://blob.anantrajlimited.com",
  forcePathStyle: true, // required for S3-compatible storage
  credentials: {
    accessKeyId: process.env.ANANTRAJ_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.ANANTRAJ_AWS_SECRET_ACCESS_KEY!,
  },

});


const deleteFileFromS3 = async (key: string) => {
  if (!key) return;
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.ANANTRAJ_S3_BUCKET_NAME!,
        Key: key,
      })
    );
  } catch (error) {
    console.error("Error deleting from S3:", error);
  }
};

export  default deleteFileFromS3;