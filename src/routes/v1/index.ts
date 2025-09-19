import { Router } from 'express';

import authRoutes from './auth';
import blogRoutes from './blog';
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

export default router;
