import { FastifyPluginAsync } from "fastify";
import path from "path";
import fs from "fs/promises";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import { getTracks, saveTrack, Track } from "../store/tracks";
import { storageService } from "../storage";

const TMP_DIR = path.resolve(process.env.TMP_DIR ?? "./tmp");
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp3",
]);

const ALLOWED_EXTENSIONS = new Set([".mp3", ".wav", ".mpeg"]);

export const trackRoutes: FastifyPluginAsync = async (app) => {
  app.post("/api/tracks/upload", async (req, reply) => {
    let tempPath: string | null = null;

    try {
      if (!req.isMultipart()) {
        return reply.code(400).send({
          error: "Request must be multipart/form-data",
        });
      }

      const file = await req.file();

      if (!file) {
        return reply.code(400).send({
          error: 'No file uploaded. Expected field name "file".',
        });
      }

      const originalFileName = file.filename ?? "unknown";
      const ext = path.extname(originalFileName).toLowerCase();

      const isAllowedMime = ALLOWED_MIME_TYPES.has(file.mimetype);
      const isAllowedExtension = ALLOWED_EXTENSIONS.has(ext);

      if (!isAllowedMime || !isAllowedExtension) {
        return reply.code(415).send({
          error:
            "Unsupported file type. Please upload .mp3, .wav, or .m4a audio.",
        });
      }

      await fs.mkdir(TMP_DIR, { recursive: true });

      const id = crypto.randomUUID();
      const safeTempName = `${id}${ext}`;

      tempPath = path.join(TMP_DIR, safeTempName);

      await pipeline(file.file, createWriteStream(tempPath));

      if (file.file.truncated) {
        await fs.unlink(tempPath).catch(() => {});

        return reply.code(413).send({
          error: "File too large.",
        });
      }

      const stats = await fs.stat(tempPath);

      if (stats.size > MAX_FILE_SIZE_BYTES) {
        await fs.unlink(tempPath).catch(() => {});

        return reply.code(413).send({
          error: "File too large.",
        });
      }

      let durationSec: number | null = null;

      try {
        const { parseFile } = await import("music-metadata");

        const metadata = await parseFile(tempPath);

        durationSec = metadata.format.duration ?? null;
      } catch (err) {
        req.log.warn(err, "Failed to extract audio metadata");
      }

      const storageKey = `tracks/${id}${ext}`;

      await storageService.saveFile({
        key: storageKey,
        filePath: tempPath,
        contentType: file.mimetype,
      });

      await fs.unlink(tempPath).catch(() => {});
      tempPath = null;

      const url = await storageService.getSignedUrl(storageKey, 3600);

      const track: Track = {
        id,
        originalFileName,
        storageKey,
        mimeType: file.mimetype,
        sizeBytes: stats.size,
        durationSec,
        status: "uploaded" as const,
        createdAt: new Date().toISOString(),
      };

      saveTrack(track);

      return reply.code(201).send({
        track: {
          ...track,
          url,
        },
      });
    } catch (err) {
      if (tempPath) {
        await fs.unlink(tempPath).catch(() => {});
      }

      req.log.error(err);

      return reply.code(500).send({
        error: "Upload failed",
      });
    }
  });

  app.get("/api/tracks", async () => {
    const tracks = getTracks();

    const tracksWithUrl = await Promise.all(
      tracks.map(async (track) => {
        const url = await storageService.getSignedUrl(track.storageKey, 3600);

        return {
          ...track,
          url,
        };
      }),
    );

    return {
      tracks: tracksWithUrl,
    };
  });
};
