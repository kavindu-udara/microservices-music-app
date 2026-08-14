export type Track = {
    id: string,
    originalFilename: string,
    storagePath: string,
    mimeType: string,
    sizeBytes: number,
    durationSec: number | null,
    status: "uploaded",
    createdAt: string
}

let tracks: Track[] = [];

export const getAllTracks = () => {
    return tracks;
}

export const addTrack = (track: Track) => {
    tracks.push(track);
}

export const getTrackById = (id: string) => {
    return tracks.find(track => track.id === id);
}
