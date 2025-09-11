import express from "express";
import dotenv from "dotenv";
import musicRoutes from "./routes/musicRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3005;

app.use('/music', musicRoutes);
app.use('/artist', artistRoutes);

app.listen(port, () => {
  console.log(`Music service running on port ${port}`);
});
