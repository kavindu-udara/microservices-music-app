import { FastifyPluginAsync } from 'fastify';
import { createTrack, testUpload } from '../controllers/track.controller';

export const trackRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.post('/track', createTrack);
    fastify.post('/track/upload', testUpload); 
}
