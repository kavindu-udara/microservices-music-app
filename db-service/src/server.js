import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// connect to db
connectDB();

// Middleware
app.use(cors());

// Routes
app.use('/api', userRoutes);

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

// 404 handler
app.use(/(.*)/, (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

app.listen(port, () => {
    console.log(`Database service running on port ${port}`);
});