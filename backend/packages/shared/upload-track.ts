import { createClient } from '@supabase/supabase-js';

const endpoint = process.env.S3_ENDPOINT!
const accesskey = process.env.S3_SECRET_ACCESS_KEY!

export const supabase = createClient(endpoint, accesskey)

// Access storage
const storage = supabase.storage.from('uploads')

const uploadTrack = async (file: File) => {
    const { data, error } = await storage.upload(`tracks/${file.name}`, file)
    if (error) {
        console.error('Error uploading track:', error);
        throw new Error('Failed to upload track');
    }
    return data;
}
