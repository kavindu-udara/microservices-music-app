import { FastifyPluginAsync } from "fastify";
import path from "path";
import fs from "fs/promises";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import { addTrack, getAllTracks, Track } from "../store/tracks";

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./uploads");
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "audio/mp3"
]);

const ALLOWED_EXTENSIONS = new Set([
    ".mp3",
    ".wav",
    ".mpeg"
]);

export const trackRoutes: FastifyPluginAsync = async (app) => 
{

    app.get("/api/tracks", 
        async () => {
            return getAllTracks();
        }
    );

    app.post("/api/tracks/upload", { bodyLimit: MAX_FILE_SIZE_BYTES }, async (req, reply) => {
        try {
            await fs.mkdir(UPLOAD_DIR, { recursive: true });

            const id = crypto.randomUUID();
            let originalFilename = "unknown";
            let ext = "";
            let filePath = "";
            let mimeType = "";

            if(req.isMultipart()){
                const file = await req.file();

                if(!file){
                    return reply.code(400).send({
                        error: "No file uploaded"
                    });
                }

                originalFilename = file.filename ?? "unknown";
                ext = path.extname(originalFilename).toLowerCase();
                mimeType = file.mimetype;

                const isAllowedMimeType = ALLOWED_MIME_TYPES.has(file.mimetype);
                const isAllowedExtension = ALLOWED_EXTENSIONS.has(ext);

                if(!isAllowedMimeType || !isAllowedExtension){
                    return reply.code(415).send({
                        error: "Invalid file type. Only mp3, wav, and mpeg files are allowed."
                    });
                }

                filePath = path.join(UPLOAD_DIR, `${id}${ext}`);

                await pipeline(file.file, createWriteStream(filePath));

                const multipartFile = file as typeof file & { truncated?: boolean };

                if(multipartFile.truncated){
                    await fs.unlink(filePath).catch(() => {});

                    return reply.code(413).send({
                        error: "File size exceeds the limit of 50MB"
                    });
                }
            } else {
                const contentType = String(req.headers["content-type"] ?? "").split(";")[0].trim().toLowerCase();
                const rawBody = req.body;

                if(!Buffer.isBuffer(rawBody)){
                    return reply.code(415).send({
                        error: "Unsupported media type. Send audio/mpeg, audio/wav, or multipart/form-data."
                    });
                }

                mimeType = contentType;

                if(!ALLOWED_MIME_TYPES.has(contentType)){
                    return reply.code(415).send({
                        error: "Invalid file type. Only mp3, wav, and mpeg files are allowed."
                    });
                }

                const extensionFromMimeType = contentType === "audio/wav" ? ".wav" : ".mp3";
                ext = extensionFromMimeType;
                originalFilename = `upload${ext}`;
                filePath = path.join(UPLOAD_DIR, `${id}${ext}`);

                await fs.writeFile(filePath, rawBody);
            }

            const stats = await fs.stat(filePath);

            let durationSec: number | null = null;

            try {
                const {parseFile} = await import("music-metadata");
                const metadata = await parseFile(filePath);
                durationSec = metadata.format.duration ?? null;
            } catch (error) {
                req.log.warn("Failed to extract metadata");
            }

            const track: Track = {
                id,
                originalFilename,
                storagePath: filePath,
                mimeType,
                sizeBytes: stats.size,
                durationSec,
                status: "uploaded",
                createdAt: new Date().toISOString()
            }

            addTrack(track);

            return reply.code(201).send(track);

        } catch (error : any) {
            req.log.error("Error occurred while uploading file:", error);
            return reply.code(500).send({
                error: "Internal server error"
            });
        }
    })
}
