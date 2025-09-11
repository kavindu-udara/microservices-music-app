import express from "express"
import {login, register} from "../controllers/authController.js"

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/:id', async (req, res) => {
  try {
    const result = await getUserById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await updateUser(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;