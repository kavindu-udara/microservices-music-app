export const SERVICES = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    requiresAuth: false, // login/register don't need JWT
  },
  catalog: {
    url: process.env.CATALOG_SERVICE_URL || "http://localhost:3002",
    requiresAuth: false, // public browsing
  },
  playlist: {
    url: process.env.PLAYLIST_SERVICE_URL || "http://localhost:3003",
    requiresAuth: true,
  },
  analytics: {
    url: process.env.ANALYTICS_SERVICE_URL || "http://localhost:3004",
    requiresAuth: true,
  },
} as const;
