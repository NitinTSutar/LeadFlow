import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "../config/env.js";

const r2Client = new S3Client({
  region: "auto",
  endpoint: config.r2.endpoint,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
});

export async function uploadToR2({ key, body, contentType }) {
  await r2Client.send(new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
}

export async function deleteFromR2(key) {
  await r2Client.send(new DeleteObjectCommand({ Bucket: config.r2.bucketName, Key: key }));
}
