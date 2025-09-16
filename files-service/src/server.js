import express from "express";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3006;

app.use('/', fileRoutes);

// Basic route
app.get('/about', (req, res) => {
    res.json({
        message: 'File Service API',
        version: '1.0.0'
    });
});

app.listen(port, () => {
  console.log(`Music service running on port ${port}`);
});
