import fastify from 'fastify';

const app = fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: { target: "pino-pretty" },
  },
});

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