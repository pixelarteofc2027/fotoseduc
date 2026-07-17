// S3 helper for MinIO / S3 compatible
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION || 'us-east-1';

const s3 = new S3Client({
  region: REGION,
  endpoint: process.env.STORAGE_ENDPOINT || 'http://localhost:9000',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS || 'fotoeduc',
    secretAccessKey: process.env.STORAGE_SECRET || 'fotoeducsenha'
  }
});

export async function createPresignedPut(key: string, contentType = 'application/octet-stream', expires = 900) {
  const cmd = new PutObjectCommand({
    Bucket: process.env.STORAGE_BUCKET || 'fotoeduc',
    Key: key,
    ContentType: contentType
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: expires });
  return url;
}

export default s3;
