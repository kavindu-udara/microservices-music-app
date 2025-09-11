import express from "express"
import { createMusic, deleteMusicById, findMusicById, getMusic, updateMusicById } from "../controllers/musicController.js";

const router = express.Router();

router.post('/', createMusic);

router.get('/', getMusic);

router.get('/:id', findMusicById);

router.put('/:id', updateMusicById);

router.delete('/:id', deleteMusicById);

export default router;
