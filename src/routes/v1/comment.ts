import { Router } from 'express';

import commentBlog from 'src/controllers/v1/comment/comment-blog';
import authenticate from 'src/middlewares/authenticate';
import authorize from 'src/middlewares/authorize';
import { commentBlogRequestValidation } from 'src/middlewares/validations/comment-validations';

const router: Router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  commentBlogRequestValidation,
  commentBlog,
);

export default router;
