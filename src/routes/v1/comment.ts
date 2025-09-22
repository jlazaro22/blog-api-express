import { Router } from 'express';

import commentBlog from 'src/controllers/v1/comment/comment-blog';
import getCommentsByBlogId from 'src/controllers/v1/comment/get-comments-by-blog-id';
import authenticate from 'src/middlewares/authenticate';
import authorize from 'src/middlewares/authorize';
import {
  commentBlogRequestValidation,
  getCommentsByBlogIdRequestValidation,
} from 'src/middlewares/validations/comment-validations';

const router: Router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  commentBlogRequestValidation,
  commentBlog,
);

router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  getCommentsByBlogIdRequestValidation,
  getCommentsByBlogId,
);

export default router;
