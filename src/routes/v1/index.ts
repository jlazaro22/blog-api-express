import { Router } from 'express';

import authRoutes from './auth';
import blogRoutes from './blog';
import commentRoutes from './comment';
import likeRoutes from './like';
import userRoutes from './user';

const router: Router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live.',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://docs.blog-api.tutorial.com',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/likes', likeRoutes);
router.use('/comments', commentRoutes);

export default router;
