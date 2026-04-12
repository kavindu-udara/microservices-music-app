import { FastifyPluginAsync } from 'fastify';
import { createArtist, getAllArtists, getSingleArtist } from '../controllers/artist.controller';

export const artistRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/artists', getAllArtists);
    fastify.get('/artist/:id', getSingleArtist);
    fastify.post('/artist', createArtist); 
}
