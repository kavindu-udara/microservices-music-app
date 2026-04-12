import { FastifyPluginAsync } from 'fastify';
import { createAlbum } from '../controllers/album.controller';

export const albumRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.post('/album', createAlbum); 
}
