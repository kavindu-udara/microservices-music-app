import express from "express"
import { createArtist } from "../controllers/artistController.js";

const router = express.Router();

router.post('/', createArtist);

export default router;
