import express from "express"
import { createArtist, getAllArtists } from "../controllers/artistController.js";

const router = express.Router();

router.post('/', createArtist);
router.get('/', getAllArtists);

export default router;