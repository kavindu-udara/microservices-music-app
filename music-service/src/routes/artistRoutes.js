import express from "express"
import { createArtist, getArtists } from "../controllers/artistController.js";
import { uploadArtistImage } from "../middlewares/uploadArtistImage.js";

const router = express.Router();

router.get('/get-all', getArtists);
router.post('/', uploadArtistImage, createArtist);

export default router;
