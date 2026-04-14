import fastify from "fastify";
import { trackRoutes } from "./routes/track.route";
import { albumRoutes } from "./routes/album.route";
import { artistRoutes } from "./routes/artist.route";
import fastifyRedis from "@fastify/redis";
import { fastifyKafka } from "@fastify/kafka";
import { countryRoutes } from "./routes/country.route";

const app = fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: { target: "pino-pretty" },
  },
});

// kafka
await app.register(fastifyKafka, {
  producer: {
    "metadata.broker.list": process.env.KAFKA_BROKER || "localhost:9094",
  },
  consumer: {
    "group.id": "catalog-service-group",
    "metadata.broker.list": process.env.KAFKA_BROKER || "localhost:9094",
  },
  consumerTopicConf: {
    "auto.offset.reset": "earliest",
  },
});

// redis
await app.register(fastifyRedis, {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
});

// Track routes
app.register(trackRoutes);
// Album routes
app.register(albumRoutes);
// Artist routes
app.register(artistRoutes);
// Country routes
app.register(countryRoutes);

app.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: Date.now() };
});

const start = async () => {
  try {
    await app.listen({ port: 3002 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
