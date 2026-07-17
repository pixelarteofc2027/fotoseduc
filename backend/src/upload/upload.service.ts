import { Injectable } from '@nestjs/common';
import { createPresignedPut } from '../s3/s3.service';
import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private queue: Queue;
  constructor(private prisma: PrismaService) {
    const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.queue = new Queue('image-processing', { connection });
  }

  async getPresignedUrl(filename: string, contentType = 'image/jpeg') {
    const key = `${uuidv4()}-${filename}`;
    const url = await createPresignedPut(key, contentType, 900);
    return { url, key };
  }

  async completeUpload(key: string, galleryId: number) {
    // create Photo record (basic)
    const photo = await this.prisma.photo.create({
      data: {
        galleryId,
        filename: key.split('/').pop() || key,
        url: `${process.env.STORAGE_ENDPOINT || 'http://localhost:9000'}/${process.env.STORAGE_BUCKET || 'fotoeduc'}/${key}`,
        watermarked: true
      }
    });
    // enqueue processing job
    await this.queue.add('process', { photoId: photo.id, key });
    return photo;
  }
}
