import fastify from 'fastify';
import jwt from '@fastify/jwt';
import { loginRoutes } from './routes/login.route';
import { registerRoutes } from './routes/register.route';
import { accountRoutes } from './routes/account.route';
import {fastifyOauth2} from "@fastify/oauth2";
import { oauthRoutes } from './routes/oauth.route';
import 'dotenv/config';

const app = fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: { target: "pino-pretty" },
  },
});

// OAuth2 Setup for Google
app.register(fastifyOauth2, {
  name: 'googleOAuth2',
  scope: ['email', 'profile'],
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID || "your-google-client-id",
      secret: process.env.GOOGLE_CLIENT_SECRET || "your-google-client-secret",
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/google',
  callbackUri: `${process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001'}/google/callback`,
});

// JWT Setup
await app.register(jwt, {
  secret: process.env.JWT_SECRET || "dev-secret-change-me",
  sign: { expiresIn: "7d" },
  cookie: {
    cookieName: "token",
    signed: false,
  },
});

// login
app.register(loginRoutes);

// OAuth
app.register(oauthRoutes);

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
