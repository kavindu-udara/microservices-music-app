import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 3004;

app.use(express.json());

app.use(cookieParser());

// Routes
app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Auth service running on port ${port}`);
});
