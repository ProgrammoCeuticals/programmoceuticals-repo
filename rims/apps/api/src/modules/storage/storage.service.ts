/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket: string | undefined;
  private readonly region: string | undefined;
  private readonly configured: boolean;
  private s3: any = null;
  private getSignedUrlFn: any = null;

  constructor(private readonly config: ConfigService) {
    this.bucket = config.get<string>('S3_BUCKET');
    this.region = config.get<string>('AWS_REGION');
    this.configured = !!(
      this.bucket &&
      this.region &&
      config.get<string>('AWS_ACCESS_KEY_ID') &&
      config.get<string>('AWS_SECRET_ACCESS_KEY')
    );

    if (!this.configured) {
      this.logger.warn(
        'S3 not configured — file upload/download features disabled. ' +
          'Set AWS_REGION, S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY to enable.',
      );
    }
  }

  private async getS3(): Promise<{ s3: any; getSignedUrl: any }> {
    if (!this.configured) {
      throw new InternalServerErrorException('S3 storage is not configured on this server.');
    }
    if (!this.s3) {
      const { S3Client } = await import('@aws-sdk/client-s3' as any);
      const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner' as any);
      this.s3 = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.config.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
        },
      });
      this.getSignedUrlFn = getSignedUrl;
    }
    return { s3: this.s3, getSignedUrl: this.getSignedUrlFn };
  }

  async getPresignedUploadUrl(
    storageKey: string,
    mimeType: string,
    expiresInSeconds = 900,
  ): Promise<{ uploadUrl: string; storageKey: string; expiresIn: number }> {
    const { s3, getSignedUrl } = await this.getS3();
    const { PutObjectCommand } = await import('@aws-sdk/client-s3' as any);
    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: this.bucket, Key: storageKey, ContentType: mimeType }),
      { expiresIn: expiresInSeconds },
    );
    return { uploadUrl, storageKey, expiresIn: expiresInSeconds };
  }

  async getPresignedDownloadUrl(storageKey: string, expiresInSeconds = 3600): Promise<string> {
    const { s3, getSignedUrl } = await this.getS3();
    const { GetObjectCommand } = await import('@aws-sdk/client-s3' as any);
    return getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: storageKey }),
      { expiresIn: expiresInSeconds },
    );
  }

  async deleteObject(storageKey: string): Promise<void> {
    if (!this.configured) return;
    try {
      const { s3 } = await this.getS3();
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3' as any);
      await s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: storageKey }));
    } catch (err) {
      this.logger.error(`Failed to delete S3 object ${storageKey}`, err);
    }
  }
}
