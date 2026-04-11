import fastify from 'fastify';
import jwt from '@fastify/jwt';
import { loginRoutes } from './routes/login.route';
import { registerRoutes } from './routes/register.route';

const app = fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: { target: "pino-pretty" },
  },
});

// JWT Setup
await app.register(jwt, {
  secret: process.env.JWT_SECRET || "dev-secret-change-me",
  sign: { expiresIn: "7d" },
});

// login
app.register(loginRoutes);

// register
app.register(registerRoutes);

app.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: Date.now() };
});

const start = async () => {
  try {
    await app.listen({ port: 3001 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start();
