import { s3Client } from "../utils/s3Client.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getRecordsByUserId } from "./record.service.js";
import { Readable } from "stream";

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export async function exportUserRecords(userId) {
  const records = await getRecordsByUserId(userId); 

  const fileContent = JSON.stringify(records, null, 2);
  const fileName = `records/user-${userId}-${Date.now()}.json`;

  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: "application/json",
  });

  await s3Client.send(uploadCommand);

  const getCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  const presignedUrl = await getSignedUrl(s3Client, getCommand, {
    expiresIn: 3600, // 1 hour
  });

  return { presignedUrl, fileName };
}
