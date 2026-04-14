import { FastifyPluginAsync } from "fastify";
import { getAllCountries } from "../controllers/country.controller";

export const countryRoutes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get("/countries", getAllCountries);
};
