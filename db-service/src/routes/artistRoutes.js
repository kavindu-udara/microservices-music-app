import express from "express"
import { createArtist, getAllArtists } from "../controllers/artistController.js";

const router = express.Router();

router.get('/', getAllArtists);
router.post('/', createArtist);

export default router;