import { FastifyPluginAsync } from 'fastify';
import loginController from '../controllers/login.controller';

export const loginRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.post('/login',loginController); 
}
