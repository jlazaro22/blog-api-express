import { Router } from 'express';
import multer from 'multer';
import createBlog from 'src/controllers/v1/blog/create-blog';
import getAllBlogs from 'src/controllers/v1/blog/get-all-blogs';
import getBlogsByUserId from 'src/controllers/v1/blog/get-blogs-by-user-id';
import authenticate from 'src/middlewares/authenticate';
import authorize from 'src/middlewares/authorize';
import uploadBlogBanner from 'src/middlewares/uploadBlogBanner';
import {
  createBlogRequestValidation,
  getAllBlogsRequestValidation,
  getBlogsByUserIdRequestValidation,
} from 'src/middlewares/validations/blog-validations';

const upload = multer();

const router: Router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  createBlogRequestValidation,
  uploadBlogBanner('post'),
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  getAllBlogsRequestValidation,
  getAllBlogs,
);

router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  getBlogsByUserIdRequestValidation,
  getBlogsByUserId,
);

export default router;
