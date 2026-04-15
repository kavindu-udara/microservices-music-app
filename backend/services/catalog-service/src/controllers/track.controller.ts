import { prisma } from "@packages/shared/prisma";
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

export const createTrack = async (
	request: FastifyRequest<{ Body: CreateTrackRequestBody }>,
	reply: FastifyReply,
) => {
	try {
		const {
			title,
			albumId,
			duration,
			audioUrl,
			language,
			isExplicit = false,
			isPublished = false,
			artistIds,
			genreIds = [],
		} = request.body;

		if (!title?.trim()) {
			return reply.code(400).send({ error: "Track title is required" });
		}

		if (!audioUrl?.trim()) {
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
