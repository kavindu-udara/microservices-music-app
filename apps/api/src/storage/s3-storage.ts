import { createReadStream, createWriteStream } from "node:fs";
import { SaveFileInput, SaveFileResult, StorageService } from "./ types";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "node:fs/promises";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

interface S3StorageOptions {
  bucketName: string;
}

export class S3StorageService implements StorageService {
  private client: S3Client;
  private bucket: string;

  constructor(options: S3StorageOptions) {
    this.bucket = options.bucketName;

    this.client = new S3Client({
      region: process.env.S3_REGION ?? "us-east-1",
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      },
      forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    });
  }

  async saveFile(params: SaveFileInput): Promise<SaveFileResult> {
    const { key, filePath, contentType } = params;

    const body = createReadStream(filePath);

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
    });

    await upload.done();

    const stats = await fs.stat(filePath);

    return {
      key,
      sizeBytes: stats.size,
    };
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  async downloadToFile(key: string, destinationPath: string): Promise<void> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    if (!response.Body) {
      throw new Error("Empty object body");
    }

    await fs.mkdir(path.dirname(destinationPath), {
      recursive: true,
    });

    await pipeline(
      response.Body as Readable,
      createWriteStream(destinationPath),
    );
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
