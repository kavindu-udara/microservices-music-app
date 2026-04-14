import { FastifyPluginAsync } from 'fastify';
import { createArtist, getAllArtists, getSingleArtist, updateArtist } from '../controllers/artist.controller';

export const artistRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/artists', getAllArtists);
    fastify.get('/artist/:id', getSingleArtist);
    fastify.post('/artist', createArtist);
    fastify.put('/artist/:id', updateArtist);
}
