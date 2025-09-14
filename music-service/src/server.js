import express from "express";
import dotenv from "dotenv";
import musicRoutes from "./routes/musicRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3005;

app.use('/artist', artistRoutes);
app.use('/', musicRoutes);

// Basic route
app.get('/about', (req, res) => {
    res.json({
        message: 'Music Service API',
        version: '1.0.0'
    });
});

app.listen(port, () => {
  console.log(`Music service running on port ${port}`);
});
