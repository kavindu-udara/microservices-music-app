import { FastifyPluginAsync } from "fastify";
import { createGenre, getGenreById, getGenres, updateGenre } from "../controllers/genre.controller";

export const genreRoutes : FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/genres', getGenres);
    fastify.post('/genre', createGenre);
    fastify.get('/genre/:id', getGenreById);
    fastify.patch('/genre/:id', updateGenre);
}
