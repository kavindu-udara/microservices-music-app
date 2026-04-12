import { prisma } from "@packages/shared/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

type CreateArtistRequestBody = {
    name: string;
    bio: string;
};

export const createArtist = async (request : FastifyRequest<{Body : CreateArtistRequestBody}> , reply : FastifyReply) => {
    const { name, bio,  } = request.body;
    // Logic to create an artist in the database
    reply.send({ message: 'Artist created successfully' });
};

export const getAllArtists = async (request : FastifyRequest, reply : FastifyReply) => {
    try {
        const artists = await prisma.artist.findMany({
            select : {
                id : true,
                name : true,
                bio : true,
                imageUrl : true,
                Country : {
                    select : {
                        name : true,
                        code : true
                    }
                }
            }
        });

        reply.send({artists, message : "Artists fetched successfully"});
    } catch (error) {
        reply.code(500).send({ error: 'Failed to fetch artists' });
    }
}
