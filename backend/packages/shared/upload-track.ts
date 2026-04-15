import { createClient } from '@supabase/supabase-js';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

const endpoint = process.env.SUPABASE_URL || process.env.S3_ENDPOINT;
const accesskey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.S3_SECRET_ACCESS_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';
const s3Endpoint = process.env.S3_ENDPOINT;
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID;
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const s3Region = process.env.S3_REGION || 'us-east-1';

const useSupabaseJs = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const useS3Compatible = Boolean(s3Endpoint && s3AccessKeyId && s3SecretAccessKey);

if (!useSupabaseJs && !useS3Compatible) {
    throw new Error(
        'Storage credentials are not configured. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY or S3_ENDPOINT + S3_ACCESS_KEY_ID + S3_SECRET_ACCESS_KEY.'
    );
}

export const supabase = useSupabaseJs
    ? createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    : null;

const storage = supabase?.storage.from(bucket);
const s3Client = useS3Compatible
    ? new S3Client({
            endpoint: s3Endpoint,
            region: s3Region,
            forcePathStyle: true,
            credentials: {
                accessKeyId: s3AccessKeyId!,
                secretAccessKey: s3SecretAccessKey!,
            },
        })
    : null;

const sanitizeFileName = (name: string) =>
    name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9.-]/g, '');

type UploadTrackInput = {
    fileBuffer: Buffer;
    fileName: string;
    contentType: string;
    artistId?: number;
};

const getPublicBaseUrl = () => {
    if (process.env.SUPABASE_URL) return process.env.SUPABASE_URL;
    if (!s3Endpoint) return '';

    try {
        const parsed = new URL(s3Endpoint);
        const projectRef = parsed.hostname.split('.storage.supabase.co')[0];
        if (!projectRef) return '';
        return `https://${projectRef}.supabase.co`;
    } catch {
        return '';
    }
};

export const uploadTrack = async ({
    fileBuffer,
    fileName,
    contentType,
    artistId,
}: UploadTrackInput) => {
    const safeName = sanitizeFileName(fileName || 'track.mp3') || 'track.mp3';
    const folder = artistId ? `tracks/${artistId}` : 'tracks';
    const path = `${folder}/${Date.now()}-${randomUUID()}-${safeName}`;

    if (storage) {
        const { data, error } = await storage.upload(path, fileBuffer, {
            contentType,
            upsert: false,
        });

        if (error) {
            throw new Error(`Failed to upload track: ${error.message}`);
        }

        const { data: publicData } = storage.getPublicUrl(path);

        return {
            path: data.path,
            audioUrl: publicData.publicUrl,
        };
    }

    if (!s3Client) {
        throw new Error('Storage client is not initialized');
    }

    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: path,
                Body: fileBuffer,
                ContentType: contentType,
            })
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown upload error';
        throw new Error(`Failed to upload track: ${message}`);
    }

    const publicBaseUrl = getPublicBaseUrl();
    const audioUrl = publicBaseUrl
        ? `${publicBaseUrl}/storage/v1/object/public/${bucket}/${path}`
        : '';

    return {
        path,
        audioUrl,
    };
}
