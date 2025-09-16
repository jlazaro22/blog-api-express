import { Router } from 'express';

import authRoutes from './auth';

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

export default router;
