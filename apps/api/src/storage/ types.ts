export interface SaveFileInput {
    key: string,
    filePath: string,
    contentType?: string,
}

export interface SaveFileResult {
    key: string,
    sizeBytes: number,
}

export interface StorageService{
    saveFile(params: SaveFileInput): Promise<SaveFileResult>;
    getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
    downloadToFile(key: string, destinationPath: string): Promise<void>;
    delete(key: string): Promise<void>;
}
