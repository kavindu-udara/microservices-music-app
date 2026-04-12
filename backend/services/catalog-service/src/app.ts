import fastify from 'fastify';
import { trackRoutes } from './routes/track.route';
import { albumRoutes } from './routes/album.route';
import { artistRoutes } from './routes/artist.route';

const app = fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: { target: "pino-pretty" },
  },
});


// Track routes
app.register(trackRoutes);
// Album routes
app.register(albumRoutes);
// Artist routes
app.register(artistRoutes);

app.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: Date.now() };
});

const start = async () => {
  try {
    await app.listen({ port: 3002 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start();
