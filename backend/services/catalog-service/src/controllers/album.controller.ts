import { prisma } from "@packages/shared/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

type CreateAlbumRequestBody = {
	title: string;
	artistId: number;
	releaseDate: string;
	coverUrl: string;
};

export const createAlbum = async (
	request: FastifyRequest<{ Body: CreateAlbumRequestBody }>,
	reply: FastifyReply,
) => {
	const { title, artistId, releaseDate, coverUrl } = request.body;

	if (!title?.trim()) {
		return reply.code(400).send({ error: "Album title is required" });
	}

	if (!artistId || Number.isNaN(Number(artistId))) {
		return reply.code(400).send({ error: "Valid artistId is required" });
	}

	const parsedReleaseDate = new Date(releaseDate);
	if (Number.isNaN(parsedReleaseDate.getTime())) {
		return reply.code(400).send({ error: "Valid releaseDate is required" });
	}

	const artist = await prisma.artist.findUnique({ where: { id: Number(artistId) } });
	if (!artist) {
		return reply.code(404).send({ error: "Artist not found" });
	}

	const duplicateAlbum = await prisma.album.findFirst({
		where: {
			title: title.trim(),
			artistId: Number(artistId),
		},
	});

	if (duplicateAlbum) {
		return reply
			.code(400)
			.send({ error: "An album with the same title already exists for this artist" });
	}

	const album = await prisma.album.create({
		data: {
			title: title.trim(),
			artistId: Number(artistId),
			releaseDate: parsedReleaseDate,
			coverUrl,
		},
		select: {
			id: true,
			title: true,
			artistId: true,
			releaseDate: true,
			coverUrl: true,
		},
	});

	await request.server.redis.del(`catalog:artist:${artistId}:v1`);

	return reply.code(201).send({ album, message: "Album created successfully" });
};

export const getAlbumById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
) => {
    const albumId = Number(request.params.id);  
    
    if (Number.isNaN(albumId)) {
        return reply.code(400).send({ error: "Invalid album id" });
    }

    const album = await prisma.album.findUnique({
        where: { id: albumId },
        select: {
            id: true,
            title: true,
            artistId: true,
            releaseDate: true,
            coverUrl: true,
            track : {
                select: {
                    id: true,
                    title: true,
                    duration: true,
                    audioUrl: true,
                }
            }
        },
    });

    if (!album) {
        return reply.code(404).send({ error: "Album not found" });
    }

    return reply.send({ album });
};
