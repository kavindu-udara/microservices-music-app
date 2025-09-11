import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import userRoutes from './routes/userRoutes.js';
import artistRoutes from "./routes/artistRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// connect to db
connectDB();

// Middleware
app.use(cors());

// Routes
app.use('/user', userRoutes);
app.use('/artist', artistRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Database Service API',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// Health check endpoint

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    services: ['email', 'db', 'payment'] 
  });
});

app.listen(port, () => {
    console.log(`Database service running on port ${port}`);
});