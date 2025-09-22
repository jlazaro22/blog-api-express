import { Router } from 'express';

import commentBlog from 'src/controllers/v1/comment/comment-blog';
import deleteComment from 'src/controllers/v1/comment/delete-comment';
import getCommentsByBlogId from 'src/controllers/v1/comment/get-comments-by-blog-id';
import authenticate from 'src/middlewares/authenticate';
import authorize from 'src/middlewares/authorize';
import {
  commentBlogRequestValidation,
  deleteCommentRequestValidation,
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

router.delete(
  '/:commentId',
  authenticate,
  authorize(['admin', 'user']),
  deleteCommentRequestValidation,
  deleteComment,
);

export default router;
