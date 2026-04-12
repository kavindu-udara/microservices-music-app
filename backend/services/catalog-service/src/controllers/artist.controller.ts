import { prisma } from "@packages/shared/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

type CreateArtistRequestBody = {
  name: string;
  bio: string;
};

export const createArtist = async (
  request: FastifyRequest<{ Body: CreateArtistRequestBody }>,
  reply: FastifyReply,
) => {
  const { name, bio } = request.body;
  // Logic to create an artist in the database
  reply.send({ message: "Artist created successfully" });
};

export const getAllArtists = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {

    // Check Redis cache first
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

    // Cache the result in Redis for 60 seconds
    await request.server.redis.setex(
      key,
      60,
      JSON.stringify({ artists, message: "Artists fetched successfully" }),
    );

    reply.send({ artists, message: "Artists fetched successfully" });
  } catch (error) {
    reply.code(500).send({ error: "Failed to fetch artists" });
  }
};
