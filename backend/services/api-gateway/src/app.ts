import Fastify from "fastify";
import httpProxy from "@fastify/http-proxy";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { SERVICES } from "./config";
import fastifyRedis from '@fastify/redis';

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: { target: "pino-pretty" },
  },
});

// redis
await app.register(fastifyRedis, {
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT ?? 6379),
});

// 1. Cross-origin & Rate limiting
await app.register(cors, {
  origin: [process.env.WEBFRONT_URL || "http://localhost:3000"],
  credentials: true,
});
await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
  keyGenerator: (req) => req.ip,
});

// 2. JWT Setup
await app.register(jwt, {
  secret: process.env.JWT_SECRET || "dev-secret-change-me",
  sign: { expiresIn: "7d" },
});

// 3. Auth hook
app.decorate("authenticate", async (req: any, reply: any) => {
  try {
    3;
    await req.jwtVerify();
  } catch (err: any) {
    reply.code(401).send({ error: "Unauthorized", message: err.message });
  }
});

// 4. Register proxy routes
for (const [prefix, service] of Object.entries(SERVICES)) {
  app.register(httpProxy, {
    upstream: service.url,
    prefix: `/${prefix}`,
    rewritePrefix: "",
    undici: {
      bodyTimeout: 30_000,
      headersTimeout: 10_000,
    },
    // Handle downstream errors gracefully
    onError: (reply: any, error: any) => {
      app.log.error({ err: error, service: prefix }, "Proxy failed");
      reply.code(error.statusCode || 502).send({
        error: "Service Unavailable",
        message: "Downstream service error",
      });
    },
  });
}

// Health check
app.get("/health", async () => ({ status: "ok", timestamp: Date.now() }));

export { app };
