import { Router } from 'express';

import likeBlog from 'src/controllers/v1/like/likeBlog';
import unlikeBlog from 'src/controllers/v1/like/unlikeBlog';
import authenticate from 'src/middlewares/authenticate';
import authorize from 'src/middlewares/authorize';
import { likeUnlikeBlogRequestValidation } from 'src/middlewares/validations/like-validations';

const router: Router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  likeUnlikeBlogRequestValidation,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  likeUnlikeBlogRequestValidation,
  unlikeBlog,
);

export default router;
