export type Track = {
    id: string,
    originalFileName: string,
    storageKey: string,
    mimeType: string,
    sizeBytes: number,
    durationSec: number | null,
    status: "uploaded" | "queued" | "analyzing" | "analyzed" | "failed",
    createdAt: string
}

const tracks = new Map<string, Track>();

export function saveTrack(track: Track) {
  tracks.set(track.id, track);
}

export function getTracks() {
  return Array.from(tracks.values());
}

export function getTrackById(id: string) {
  return tracks.get(id);
}
