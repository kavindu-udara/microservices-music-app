import { FastifyPluginAsync } from "fastify";
import googleCallbackController from "../controllers/oauth.controller";

export const oauthRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.get("/auth/google/callback", googleCallbackController);
}
