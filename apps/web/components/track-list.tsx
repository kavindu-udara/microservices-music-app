"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Track = {
  id: string;
  originalFileName: string;
  storageKey: string;
  durationSec: number | null;
  url: string;
};

export function TrackList() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTracks() {
      try {
        const res = await fetch(`${API_URL}/api/tracks`);
        const json = await res.json();

        setTracks(json.tracks ?? []);
      } finally {
        setLoading(false);
      }
    }

    loadTracks();
  }, []);

  if (loading) {
    return <p>Loading tracks...</p>;
  }

  if (!tracks.length) {
    return <p>No tracks uploaded yet.</p>;
  }

  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div key={track.id} className="rounded border p-4 space-y-2">
          <p className="font-medium">{track.originalFileName}</p>

          <p className="text-sm text-gray-600">
            Duration:{" "}
            {track.durationSec
              ? `${Math.round(track.durationSec)}s`
              : "Unknown"}
          </p>

          <audio controls src={track.url} className="w-full" />
        </div>
      ))}
    </div>
  );
}