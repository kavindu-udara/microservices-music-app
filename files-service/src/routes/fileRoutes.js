import express from "express"
import { getImage, uploadFile } from "../controllers/filesController.js";

const router = express.Router();

router.post('/upload', uploadFile);
router.get('/:filename', getImage);

export default router;
