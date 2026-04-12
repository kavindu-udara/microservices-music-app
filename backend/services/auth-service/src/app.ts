import fastify from 'fastify';
import jwt from '@fastify/jwt';
import { loginRoutes } from './routes/login.route';
import { registerRoutes } from './routes/register.route';
import { accountRoutes } from './routes/account.route';
import cookie from '@fastify/cookie';

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

app.register(cookie, {
  secret: process.env.COOKIE_SECRET || "dev-cookie-secret-change-me",
});

// login
app.register(loginRoutes);

// register
app.register(registerRoutes);

// account
app.register(accountRoutes);

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
