import express from "express";
import dotenv from "dotenv";
import {createProxyMiddleware} from "http-proxy-middleware"

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Proxy middleware options
const options = {
  target: 'http://localhost:3000',
  changeOrigin: true,
  router: {
    '/email': process.env.EMAIL_SERVICE_ROUTER,
    '/db': process.env.DB_SERVICE_ROUTER,
    '/payment': process.env.PAYMENT_SERVICE_ROUTER,
    '/auth': process.env.AUTH_SERVICE_ROUTER,
    '/music': process.env.MUSIC_SERVICE_ROUTER
  }
};

// Use the proxy middleware
app.use('/api', createProxyMiddleware(options));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    services: ['email', 'db', 'payment'] 
  });
});

app.listen(port, () => {
  console.log(`API getway running on port ${port}`);
});
