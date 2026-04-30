import { prisma } from "@packages/shared/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

type CreateGenreRequestBody = {
  name: string;
  slug: string;
  description: string;
};

export const getGenres = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const key = "catalog:genres:list:v1";
    const cachedGenres = await request.server.redis.get(key);

    if (cachedGenres) {
      console.log("Cache hit for genres");
      return reply.code(200).send(JSON.parse(cachedGenres));
    }

    const genres = await prisma.genre.findMany();

    await request.server.redis.setex(
      key,
      60,
      JSON.stringify({ genres, message: "Genres fetched successfully" }),
    );

    return reply
      .code(200)
      .send({ genres, message: "Genres fetched successfully" });
  } catch (error) {
    console.error("Error fetching genres:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return reply.code(500).send({ error: "Internal Server Error", message });
  }
};

export const createGenre = async (
  request: FastifyRequest<{ Body: CreateGenreRequestBody }>,
  reply: FastifyReply,
) => {
  try {
    const { name, slug, description } = request.body;

    if (!name) {
      return reply.code(400).send({ error: "Genre name is required" });
    }

    const existingGenre = await prisma.genre.findUnique({
      where: { slug },
    });

    if (existingGenre) {
      return reply
        .code(409)
        .send({ error: "Genre with this slug already exists" });
    }

    const newGenre = await prisma.genre.create({
      data: { name, slug, description },
    });

    return reply.code(201).send(newGenre);
  } catch (error) {
    console.error("Error creating genre:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return reply.code(500).send({ error: "Internal Server Error", message });
  }
};

export const getGenreById = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params as { id: string };

    const genre = await prisma.genre.findUnique({
      where: { id: Number(id) },
    });

    if (!genre) {
      return reply.code(404).send({ error: "Genre not found" });
    }

    return reply.code(200).send(genre);
  } catch (error) {
    console.error("Error fetching genre by ID:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return reply.code(500).send({ error: "Internal Server Error", message });
  }
};

export const updateGenre = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params as { id: string };
    const { name } = request.body as { name: string };

    if (!name) {
      return reply.code(400).send({ error: "Genre name is required" });
    }

    const updatedGenre = await prisma.genre.update({
      where: { id: Number(id) },
      data: { name },
    });

    return reply.code(200).send(updatedGenre);
  } catch (error) {
    console.error("Error updating genre:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return reply.code(500).send({ error: "Internal Server Error", message });
  }
};
