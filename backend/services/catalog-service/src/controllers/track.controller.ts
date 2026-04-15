import { prisma } from "@packages/shared/prisma";
import { uploadTrack } from "@packages/shared/upload-track";
import { FastifyReply, FastifyRequest } from "fastify";

type CreateTrackRequestBody = {
	title: string;
	albumId?: number | null;
	duration: number;
	audioUrl: string;
	language: string;
	isExplicit?: boolean;
	isPublished?: boolean;
	artistIds: number[];
	genreIds?: number[];
};

const parseBoolean = (value: unknown, defaultValue = false) => {
	if (typeof value === "boolean") return value;
	if (typeof value === "string") {
		if (value.toLowerCase() === "true") return true;
		if (value.toLowerCase() === "false") return false;
	}
	return defaultValue;
};

const parseNumberArray = (value: unknown): number[] => {
	if (Array.isArray(value)) {
		return value
			.map((entry) => Number(entry))
			.filter((entry) => !Number.isNaN(entry));
	}

	if (typeof value === "string") {
		if (value.trim() === "") return [];

		return value
			.split(",")
			.map((entry) => entry.trim())
			.filter((entry) => entry.length > 0)
			.map((entry) => Number(entry))
			.filter((entry) => !Number.isNaN(entry));
	}

	if (value === undefined || value === null || value === "") {
		return [];
	}

	return [Number(value)];
};

export const createTrack = async (
	request: FastifyRequest<{ Body: CreateTrackRequestBody }>,
	reply: FastifyReply,
) => {
	try {
		let title = "";
		let albumId: number | null | undefined;
		let duration = 0;
		let audioUrl = "";
		let language = "";
		let isExplicit = false;
		let isPublished = false;
		let artistIds: number[] = [];
		let genreIds: number[] = [];
		let pendingUpload:
			| {
					fileBuffer: Buffer;
					fileName: string;
					contentType: string;
			  }
			| null = null;
		const contentType = String(request.headers["content-type"] || "");
		const shouldParseMultipart =
			typeof request.isMultipart === "function"
				? request.isMultipart() || contentType.includes("multipart/form-data")
				: contentType.includes("multipart/form-data");

		if (shouldParseMultipart) {
			const fields: Record<string, string> = {};
			let fileBuffer: Buffer | null = null;
			let fileName = "track.mp3";
			let contentType = "audio/mpeg";

			for await (const part of request.parts()) {
				if (part.type === "file") {
					const allowedMimeTypes = ["audio/mpeg", "audio/mp3", "audio/x-mpeg-3"];
					if (!allowedMimeTypes.includes(part.mimetype)) {
						return reply.code(400).send({ error: "Only MP3 files are allowed" });
					}

					fileBuffer = await part.toBuffer();
					fileName = part.filename;
					contentType = part.mimetype;
				} else {
					fields[part.fieldname] = String(part.value);
				}
			}

			if (!fileBuffer) {
				return reply.code(400).send({ error: "Audio file is required" });
			}

			title = fields.title?.trim() || "";
			albumId = fields.albumId ? Number(fields.albumId) : null;
			duration = Number(fields.duration);
			language = fields.language?.trim() || "";
			isExplicit = parseBoolean(fields.isExplicit, false);
			isPublished = parseBoolean(fields.isPublished, false);
			artistIds = parseNumberArray(fields.artistIds);
			genreIds = parseNumberArray(fields.genreIds);

			pendingUpload = {
				fileBuffer,
				fileName,
				contentType,
			};
		} else {
			const body = request.body;
			if (!body || typeof body !== "object") {
				return reply.code(400).send({ error: "Invalid request payload" });
			}

			title = body.title;
			albumId = body.albumId;
			duration = Number(body.duration);
			audioUrl = body.audioUrl;
			language = body.language;
			isExplicit = body.isExplicit ?? false;
			isPublished = body.isPublished ?? false;
			artistIds = body.artistIds ?? [];
			genreIds = body.genreIds ?? [];
		}

		if (!title?.trim()) {
			return reply.code(400).send({ error: "Track title is required" });
		}

		if (!audioUrl?.trim() && !pendingUpload) {
			return reply.code(400).send({ error: "audioUrl is required" });
		}

		if (!language?.trim()) {
			return reply.code(400).send({ error: "language is required" });
		}

		if (!duration || Number.isNaN(Number(duration)) || Number(duration) <= 0) {
			return reply.code(400).send({ error: "duration must be a positive number" });
		}

		if (!Array.isArray(artistIds) || artistIds.length === 0) {
			return reply.code(400).send({ error: "artistIds must contain at least one artist" });
		}

		const normalizedArtistIds = [...new Set(artistIds.map((id) => Number(id)))];
		if (normalizedArtistIds.some((id) => Number.isNaN(id) || id <= 0)) {
			return reply.code(400).send({ error: "artistIds must be valid positive numbers" });
		}

		const normalizedGenreIds = [...new Set((genreIds || []).map((id) => Number(id)))];
		if (normalizedGenreIds.some((id) => Number.isNaN(id) || id <= 0)) {
			return reply.code(400).send({ error: "genreIds must be valid positive numbers" });
		}

		if (albumId !== undefined && albumId !== null) {
			const existingAlbum = await prisma.album.findUnique({ where: { id: Number(albumId) } });
			if (!existingAlbum) {
				return reply.code(404).send({ error: "Album not found" });
			}
		}

		const artistCount = await prisma.artist.count({
			where: {
				id: { in: normalizedArtistIds },
			},
		});

		if (artistCount !== normalizedArtistIds.length) {
			return reply.code(404).send({ error: "One or more artists were not found" });
		}

		if (normalizedGenreIds.length > 0) {
			const genreCount = await prisma.genre.count({
				where: {
					id: { in: normalizedGenreIds },
				},
			});

			if (genreCount !== normalizedGenreIds.length) {
				return reply.code(404).send({ error: "One or more genres were not found" });
			}
		}

		if (pendingUpload) {
			const firstArtistId = normalizedArtistIds[0];
			const uploaded = await uploadTrack({
				fileBuffer: pendingUpload.fileBuffer,
				fileName: pendingUpload.fileName,
				contentType: pendingUpload.contentType,
				artistId: Number.isNaN(firstArtistId) ? undefined : firstArtistId,
			});

			audioUrl = uploaded.audioUrl;
		}

		if (!audioUrl?.trim()) {
			return reply.code(400).send({ error: "audioUrl is required" });
		}

		const track = await prisma.track.create({
			data: {
				title: title.trim(),
				albumId: albumId ?? null,
				duration: Number(duration),
				audioUrl: audioUrl.trim(),
				language: language.trim(),
				isExplicit,
				isPublished,
				TrackHasArtist: {
					createMany: {
						data: normalizedArtistIds.map((artistId) => ({ artistId })),
					},
				},
				TrackHasGenre:
					normalizedGenreIds.length > 0
						? {
								createMany: {
									data: normalizedGenreIds.map((genreId) => ({ genreId })),
								},
							}
						: undefined,
			},
			select: {
				id: true,
				title: true,
				albumId: true,
				duration: true,
				audioUrl: true,
				language: true,
				isExplicit: true,
				isPublished: true,
			},
		});

		return reply.code(201).send({ track, message: "Track created successfully" });
	} catch (error) {
		request.server.log.error(error);
		return reply.code(500).send({ error: "Failed to create track" });
	}
};
