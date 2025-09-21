import express from "express"
import { createMusic, deleteMusicById, findMusicById, getMusic, updateMusicById } from "../controllers/musicController.js";
import { multerMultiUpload } from "../../util/multerConfig.js";

const router = express.Router();

router.post('/', multerMultiUpload.fields([
    {name : "image", maxCount : 1},
    {name : "songFile", maxCount : 1},
]), createMusic);

router.get('/', getMusic);

router.get('/:id', findMusicById);

router.put('/:id', updateMusicById);

router.delete('/:id', deleteMusicById);

export default router;
