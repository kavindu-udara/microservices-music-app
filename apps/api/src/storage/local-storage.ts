import path from "path";
import { SaveFileInput, SaveFileResult, StorageService } from "./ types";
import fs from "node:fs/promises";

interface LocalStorageOptions {
  rootDir: string;
  baseUrl: string;
}

export class LocalStorageService implements StorageService {
  private rootDir: string;
  private baseUrl: string;

  constructor(options: LocalStorageOptions) {
    this.rootDir = options.rootDir;
    this.baseUrl = options.baseUrl;
  }

  private resolveSafePath(key: string): string {
    const fullPath = path.normalize(path.join(this.rootDir, key));
    const rootPath = path.normalize(this.rootDir + path.sep);

    if (!fullPath.startsWith(rootPath)) {
      throw new Error("Invalid storage key");
    }

    return fullPath;
  }

  async saveFile(params: SaveFileInput): Promise<SaveFileResult> {
    const { key, filePath } = params;

    const destinationPath = this.resolveSafePath(key);

    await fs.mkdir(path.dirname(destinationPath), {
      recursive: true,
    });

    await fs.copyFile(filePath, destinationPath);

    const stats = await fs.stat(destinationPath);

    return {
      key,
      sizeBytes: stats.size,
    };
  }

  async getSignedUrl(key: string): Promise<string> {
    const encodedKey = key
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");

    return `${this.baseUrl}/files/${encodedKey}`;
  }

  async downloadToFile(key: string, destinationPath: string): Promise<void> {
    const sourcePath = this.resolveSafePath(key);

    await fs.mkdir(path.dirname(destinationPath), {
      recursive: true,
    });

    await fs.copyFile(sourcePath, destinationPath);
  }

  async delete(key: string): Promise<void> {
    const fullPath = this.resolveSafePath(key);

    await fs.unlink(fullPath).catch(() => {});
  }
}
