import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // if you want to allow cookies/authorization headers
}));

// app.use(
//   "/api/db",
//   createProxyMiddleware({
//     target: process.env.DB_SERVICE_ROUTER, 
//     changeOrigin: true,
//     pathRewrite: { "^/api/db": "" }, // strip the prefix
//   })
// );

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_ROUTER, 
    changeOrigin: true,
    pathRewrite: { "^/api/music": "" },
  })
);

app.use(
  "/api/music",
  createProxyMiddleware({
    target: process.env.MUSIC_SERVICE_ROUTER, 
    changeOrigin: true,
    pathRewrite: { "^/api/music": "" },
  })
);

app.use(
  "/api/email",
  createProxyMiddleware({
    target: process.env.EMAIL_SERVICE_ROUTER, 
    changeOrigin: true,
    pathRewrite: { "^/api/email": "" },
  })
);

app.use(
  "/api/payment",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_ROUTER,
    changeOrigin: true,
    pathRewrite: { "^/api/payment": "" },
  })
);

app.use(
  "/api/file",
  createProxyMiddleware({
    target: process.env.FILES_SERVICE_ROUTER,
    changeOrigin: true,
    pathRewrite: { "^/api/file": "" },
  })
);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    services: ["email", "db", "payment"],
  });
});

app.listen(port, () => {
  console.log(`API gateway running on port ${port}`);
});
