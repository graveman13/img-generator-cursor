import { Router } from 'express';
import { 
  generateImageHandler, 
  saveImageHandler, 
  getUserImagesHandler 
} from '../controllers/imageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/images/generate
router.post('/generate', authenticateToken, generateImageHandler);

// POST /api/images/save
router.post('/save', authenticateToken, saveImageHandler);

// GET /api/images/user/:userId
router.get('/user', authenticateToken, getUserImagesHandler);

export default router;