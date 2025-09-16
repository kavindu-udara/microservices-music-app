import express from "express"
import { uploadFile } from "../controllers/filesController.js";

const router = express.Router();

router.post('/upload', uploadFile);
router.get('/:filename', uploadFile);

export default router;
