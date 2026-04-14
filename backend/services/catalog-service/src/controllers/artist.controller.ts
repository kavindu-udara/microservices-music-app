import { prisma } from "@packages/shared/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

type CreateArtistRequestBody = {
  name: string;
  bio: string;
  imageUrl: string;
  conuntryId: number;
};

export const createArtist = async (
  request: FastifyRequest<{ Body: CreateArtistRequestBody }>,
  reply: FastifyReply,
) => {
  const { name, bio, imageUrl, conuntryId } = request.body;

  // check is there any artist with the same name and countryId
  const existingArtist = await prisma.artist.findFirst({
    where: {
      name,
      countryId: conuntryId,
    },
  });

  if (existingArtist) {
    return reply
      .code(400)
      .send({ error: "An artist with the same name and country already exists" });
  }

  await prisma.artist.create({
    data: {
      name,
      bio,
      imageUrl,
      countryId: conuntryId,
    },
  });

  await request.server.redis.del("catalog:artists:list:v1");

  reply.send({ message: "Artist created successfully" });
};

export const updateArtist = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: CreateArtistRequestBody;
  }>,
  reply: FastifyReply,
) => {
  const artistId = Number(request.params.id);

  if (Number.isNaN(artistId)) {
    return reply.code(400).send({ error: "Invalid artist id" });
  }

  const { name, bio, imageUrl, conuntryId } = request.body;

  const artist = await prisma.artist.findUnique({ where: { id: artistId } });
  if (!artist) {
    return reply.code(404).send({ error: "Artist not found" });
  }

  const duplicateArtist = await prisma.artist.findFirst({
    where: {
      name,
      countryId: conuntryId,
      NOT: { id: artistId },
    },
  });

  if (duplicateArtist) {
    return reply
      .code(400)
      .send({ error: "An artist with the same name and country already exists" });
  }

  await prisma.artist.update({
    where: { id: artistId },
    data: {
      name,
      bio,
      imageUrl,
      countryId: conuntryId,
    },
  });

  await request.server.redis.del("catalog:artists:list:v1");
  await request.server.redis.del(`catalog:artist:${artistId}:v1`);

  reply.send({ message: "Artist updated successfully" });
};

export const getAllArtists = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const key = "catalog:artists:list:v1";
    const cached = await request.server.redis.get(key);
    if (cached) return reply.send(JSON.parse(cached));

    const artists = await prisma.artist.findMany({
      select: {
        id: true,
        name: true,
        bio: true,
        imageUrl: true,
        Country: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });

    await request.server.redis.setex(
      key,
      60,
      JSON.stringify({ artists, message: "Artists fetched successfully" }),
    );

    // Publish event to Kafka
    await request.server.kafka.push({
      topic: "catalog-events",
      partition: 0,
      key: String(Date.now()),
      payload: JSON.stringify({
        eventId: crypto.randomUUID(),
        eventType: "artists.fetched", // not "artist.created"
        occurredAt: new Date().toISOString(),
        producer: "catalog-service",
        schemaVersion: 1,
        data: { count: artists.length },
      }),
    });

    reply.send({ artists, message: "Artists fetched successfully" });
  } catch (error) {
    reply.code(500).send({ error: "Failed to fetch artists" });
  }
};

export const getSingleArtist = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  const cacheKey = `catalog:artist:${id}:v1`;
  const cached = await request.server.redis.get(cacheKey);
  if (cached) return reply.send(JSON.parse(cached));

  const artist = await prisma.artist.findUnique({
    where: { id: parseInt(id, 10) },
    select: {
      id: true,
      name: true,
      bio: true,
      imageUrl: true,
      countryId: true,
      Country: {
        select: {
          name: true,
          code: true,
        },
      },
      Album: {
        select: {
          id: true,
          title: true,
          coverUrl: true,
          releaseDate: true,
        },
      },
    },
  });

  if (!artist) {
    return reply.code(404).send({ error: "Artist not found" });
  }

  await request.server.redis.setex(
    cacheKey,
    60,
    JSON.stringify({ artist, message: "Artist fetched successfully" }),
  );

  reply.send({ artist, message: `Artist with ID ${id} fetched successfully` });
};
