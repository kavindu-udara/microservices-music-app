import "dotenv/config";
import { LocalStorageService } from "./local-storage";
import { S3StorageService } from "./s3-storage";
import { StorageService } from "./ types";

function createStorageService(): StorageService {
  const driver = process.env.STORAGE_DRIVER || "local";

  if (driver === "local") {
    return new LocalStorageService({
      rootDir: process.env.LOCAL_STORAGE_ROOT_DIR ?? "./uploads",
      baseUrl: process.env.LOCAL_STORAGE_BASE_URL ?? "http://localhost:4000",
    });
  }

  if (driver === "s3") {
    const bucket = process.env.S3_BUCKET_NAME;
    if (!bucket) {
      throw new Error("S3_BUCKET_NAME environment variable is not set");
    }

    return new S3StorageService({
      bucketName: bucket,
    });
  }

  throw new Error(`Unsupported storage driver: ${driver}`);
}

export const storageService = createStorageService();
