"use client"
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type uploadStatus =
    | "idle"
    | "uploading"
    | "success"
    | "error";

const UploadTrack = () => {

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<uploadStatus>("idle");
    const [message, setMessage] = useState<string>("");

    async function handleUpload() {
        if (!file) {
            setMessage("No file selected");
            return;
        }

        try {
            setStatus("uploading");
            setMessage("");

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_URL}/api/tracks/upload`, {
                method: "POST",
                body: formData
            });

            const jsonResponse = await response.json();

            if (!response.ok) {
                setStatus("error");
                setMessage(jsonResponse.error || "Upload failed");
                return;
            }

            setStatus("success");
            setMessage("Upload successful : " + jsonResponse.originalFilename);

            setFile(null);

        } catch (error: any) {
            setStatus(error.message);

            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("An unknown error occurred");
            }
        }
    }

    return (
        <div className="rounded-lg border p-6 space-y-4 max-w-md">
            <h2 className="text-lg font-semibold">Upload Track</h2>

            <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white hover:file:bg-gray-700"
            />

            <button
                onClick={handleUpload}
                disabled={!file || status === "uploading"}
                className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
                {status === "uploading" ? "Uploading..." : "Upload"}
            </button>

            {message && (
                <p
                    className={
                        status === "error"
                            ? "text-sm text-red-600"
                            : "text-sm text-green-600"
                    }
                >
                    {message}
                </p>
            )}
        </div>
    )
}

export default UploadTrack;
