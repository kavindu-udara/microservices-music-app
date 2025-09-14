import express from "express"
import { createArtist, getArtists } from "../controllers/artistController.js";

const router = express.Router();

router.get('/get-all', getArtists);
router.post('/', createArtist);

export default router;
