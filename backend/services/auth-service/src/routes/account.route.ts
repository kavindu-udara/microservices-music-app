import { FastifyPluginAsync } from "fastify";
import accountController from "../controllers/account.controller";

export const accountRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/account', accountController);
}
