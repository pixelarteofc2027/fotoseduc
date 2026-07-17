import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  // Returns presigned URL to upload a file directly to MinIO/S3
  @UseGuards(AuthGuard('jwt'))
  @Post('presign')
  async presign(@Body() body: { filename: string; contentType?: string }) {
    const { filename, contentType } = body;
    const url = await this.uploadService.getPresignedUrl(filename, contentType);
    return { ok: true, url };
  }

  // After successful upload, create Photo record and enqueue processing
  @UseGuards(AuthGuard('jwt'))
  @Post('complete')
  async complete(@Body() body: { key: string; galleryId: number }) {
    const photo = await this.uploadService.completeUpload(body.key, body.galleryId);
    return { ok: true, photo };
  }
}
