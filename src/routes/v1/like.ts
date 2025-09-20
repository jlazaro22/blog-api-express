import { Router } from 'express';

import likeBlog from 'src/controllers/v1/like/likeBlog';
import authenticate from 'src/middlewares/authenticate';
import authorize from 'src/middlewares/authorize';
import { likeBlogRequestValidation } from 'src/middlewares/validations/like-validations';

const router: Router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  likeBlogRequestValidation,
  likeBlog,
);

export default router;
