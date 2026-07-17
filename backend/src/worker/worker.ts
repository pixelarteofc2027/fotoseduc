import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import s3 from '../s3/s3.service';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

const bucket = process.env.STORAGE_BUCKET || 'fotoeduc';

const worker = new Worker(
  'image-processing',
  async (job: Job) => {
    const { photoId, key } = job.data as { photoId: number; key: string };
    console.log('Processing job for', key);

    // download object
    const getCmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    const resp = await s3.send(getCmd);
    const stream = resp.Body as any;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    const buffer = Buffer.concat(chunks);

    // create thumbnail
    const thumb = await sharp(buffer).resize(800).jpeg({ quality: 80 }).toBuffer();

    // upload thumbnail
    const thumbKey = `thumbs/${key}`;
    const putThumb = new PutObjectCommand({ Bucket: bucket, Key: thumbKey, Body: thumb, ContentType: 'image/jpeg' });
    await s3.send(putThumb);

    // apply watermark (simple text overlay)
    const watermarked = await sharp(buffer)
      .composite([
        {
          input: Buffer.from(
            `<svg width="800" height="200"><text x="10" y="40" font-size="32" fill="rgba(255,255,255,0.6)">FotoEduc</text></svg>`
          ),
          gravity: 'southeast'
        }
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    const waterKey = `watermarked/${key}`;
    const putWater = new PutObjectCommand({ Bucket: bucket, Key: waterKey, Body: watermarked, ContentType: 'image/jpeg' });
    await s3.send(putWater);

    // update photo record
    await prisma.photo.update({ where: { id: photoId }, data: { url: `${process.env.STORAGE_ENDPOINT || 'http://localhost:9000'}/${bucket}/${waterKey}`, watermarked: true } });

    console.log('Processed', key);
  },
  { connection }
);

worker.on('completed', (job) => console.log('Job completed', job.id));
worker.on('failed', (job, err) => console.error('Job failed', job.id, err));

console.log('Worker started for image-processing');
