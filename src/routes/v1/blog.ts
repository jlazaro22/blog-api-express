import { Router } from 'express';
import multer from 'multer';
import createBlog from 'src/controllers/v1/blog/create-blog';
import deleteBlog from 'src/controllers/v1/blog/delete-blog';
import getAllBlogs from 'src/controllers/v1/blog/get-all-blogs';
import getBlogBySlug from 'src/controllers/v1/blog/get-blog-by-slug';
import getBlogsByUserId from 'src/controllers/v1/blog/get-blogs-by-user-id';
import updateBlog from 'src/controllers/v1/blog/update-blog';
import authenticate from 'src/middlewares/authenticate';
import authorize from 'src/middlewares/authorize';
import uploadBlogBanner from 'src/middlewares/uploadBlogBanner';
import {
  createBlogRequestValidation,
  getAllBlogsRequestValidation,
  getBlogBySlugRequestValidation,
  getBlogsByUserIdRequestValidation,
  updateBlogBodyRequestValidation,
  updateBlogParamRequestValidation,
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

router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  getBlogBySlugRequestValidation,
  getBlogBySlug,
);

router.put(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  updateBlogParamRequestValidation,
  upload.single('banner_image'),
  updateBlogBodyRequestValidation,
  uploadBlogBanner('put'),
  updateBlog,
);

router.delete('/:blogId', authenticate, authorize(['admin']), deleteBlog);

export default router;
