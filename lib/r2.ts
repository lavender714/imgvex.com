import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.R2_ENDPOINT!;
const bucket = process.env.R2_BUCKET_NAME!;
const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;

export const r2Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export function getUserPrefix(userId: string) {
  return `assets/${userId}/`;
}

export async function listUserAssets(userId: string) {
  const prefix = getUserPrefix(userId);
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  const response = await r2Client.send(command);
  return (response.Contents || []).map((obj) => {
    const key = obj.Key || "";
    const filename = key.replace(prefix, "");
    return {
      key,
      filename,
      size: obj.Size || 0,
      lastModified: obj.LastModified?.toISOString() || "",
      url: `${endpoint}/${bucket}/${key}`,
    };
  }).filter((item) => item.filename !== "");
}

export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn: 300 }); // 5 minutes
}

export async function getDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour
}

export async function deleteAsset(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await r2Client.send(command);
}

export { bucket };
