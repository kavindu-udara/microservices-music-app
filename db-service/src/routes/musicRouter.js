import express from "express"
import { createMusic, getMusic } from "../controllers/musicController.js";

const router = express.Router();

router.post('/', createMusic);
router.get('/', getMusic);

export default router;