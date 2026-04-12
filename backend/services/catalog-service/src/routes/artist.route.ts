import { FastifyPluginAsync } from 'fastify';
import { createArtist } from '../controllers/artist.controller';

export const artistRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.post('/artist', createArtist); 
}
