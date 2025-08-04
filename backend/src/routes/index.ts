import { Router } from 'express';
import authRoutes from './authRoutes';
import imageRoutes from './imageRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/images', imageRoutes);

export default router;