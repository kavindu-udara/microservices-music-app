import { prisma } from "@packages/shared/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export const getAllCountries = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const key = "catalog:countries:list:v1";
    const cached = await request.server.redis.get(key);
    if (cached) return reply.send(JSON.parse(cached));

    const countries = await prisma.country.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    await request.server.redis.setex(
      key,
      60,
      JSON.stringify({ countries, message: "Countries fetched successfully" }),
    );

    reply.send({ countries, message: "Countries fetched successfully" });
  } catch (error) {
    request.server.log.error("Error fetching countries:", error);
    reply.status(500).send({ error: "Failed to fetch countries" });
  }
};
