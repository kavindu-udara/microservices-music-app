import express from "express";
import dotenv from "dotenv";
import musicRoutes from "./routes/musicRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3005;

app.use('/', musicRoutes);

app.listen(port, () => {
  console.log(`Music service running on port ${port}`);
});
