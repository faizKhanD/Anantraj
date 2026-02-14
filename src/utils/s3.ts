process.env.AWS_REQUEST_CHECKSUM_CALCULATION = 'WHEN_REQUIRED'
process.env.AWS_RESPONSE_CHECKSUM_VALIDATION = 'WHEN_REQUIRED'
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
const  bucketName=process.env.ANANTRAJ_S3_BUCKET_NAME!;
const s3Client = new S3Client({

  region: process.env.ANANTRAJ_AWS_REGION || "ap-south-1",
  endpoint: process.env.ANANTRAJ_S3_ENDPOINT || "https://blob.inneryatra.com",
  forcePathStyle: true, // required for S3-compatible storage
  credentials: {
    accessKeyId: process.env.ANANTRAJ_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.ANANTRAJ_AWS_SECRET_ACCESS_KEY!,
  },

});


// export async function getPresignedUrl(key: string, expiresIn: number = 60 * 60) {
//   const command = new GetObjectCommand({
//     Bucket: process.env.ANANTRAJ_S3_BUCKET_NAME!,
//     Key: key,
//   });

//   return await getSignedUrl(s3Client, command, { expiresIn });
// }
export async function getPresignedUrl(key: string, expiresIn: number = 60 * 60) {
  const command = new GetObjectCommand({
    Bucket: process.env.ANANTRAJ_S3_BUCKET_NAME!,
    Key: key,
    
  });
  // const url = await getSignedUrl(s3Client, command);
  const url=`${process.env.ANANTRAJ_S3_ENDPOINT}/${bucketName}/${key}`;
  return url;
  }



  export async function getPresignedUrlForDownload(
    key: string,
    expiresIn: number = 60 * 60
  ) {
    const command = new GetObjectCommand({
      Bucket: process.env.ANANTRAJ_S3_BUCKET_NAME!,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${key}"`, // 👈 Force download
    });
  
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  }
  
export default s3Client;
