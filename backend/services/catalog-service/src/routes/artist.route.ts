import { FastifyPluginAsync } from 'fastify';
import { createArtist, getAllArtists } from '../controllers/artist.controller';

export const artistRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/artists', getAllArtists);
    fastify.post('/artist', createArtist); 
}
