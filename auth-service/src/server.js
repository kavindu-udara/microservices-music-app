import express from "express";
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(express.json());
const port = process.env.PORT || 3004;

app.use(express.json());

app.listen(port, () => {
  console.log(`Auth service running on port ${port}`);
});
