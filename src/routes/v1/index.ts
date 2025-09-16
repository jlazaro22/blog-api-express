import { Router } from 'express';

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

export default router;
