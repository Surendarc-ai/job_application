import fs from 'fs/promises';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function saveExportFile(buffer, filename) {
  const bucket = process.env.EXPORT_BUCKET;

  if (bucket) {
    const key = `exports/${filename}`;
    const client = new S3Client({});
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: CONTENT_TYPE,
    }));
    return `s3://${bucket}/${key}`;
  }

  const dir = process.env.EXPORT_LOCAL_DIR || path.join(process.cwd(), 'exports');
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);
  return filePath;
}
