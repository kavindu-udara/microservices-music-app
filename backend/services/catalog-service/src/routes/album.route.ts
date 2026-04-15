import { FastifyPluginAsync } from 'fastify';
import { createAlbum, getAlbumById } from '../controllers/album.controller';

export const albumRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.post('/album', createAlbum);
    fastify.get('/album/:id', getAlbumById);
}
