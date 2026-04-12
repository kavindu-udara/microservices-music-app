import { FastifyPluginAsync } from 'fastify';
import { createTrack } from '../controllers/track.controller';

export const trackRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.post('/track', createTrack); 
}
