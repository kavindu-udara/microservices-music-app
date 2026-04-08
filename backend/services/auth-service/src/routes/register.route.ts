import { FastifyPluginAsync } from "fastify";
import registerController from "../controllers/register.controller";

export const registerRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.post("/register", registerController);
}
