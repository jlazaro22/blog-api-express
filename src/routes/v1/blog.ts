import { Router } from 'express';
import multer from 'multer';
import createBlog from 'src/controllers/v1/blog/create-blog';
import authenticate from 'src/middlewares/authenticate';
import authorize from 'src/middlewares/authorize';
import uploadBlogBanner from 'src/middlewares/uploadBlogBanner';
import { createBlogRequestValidation } from 'src/middlewares/validations/blog-validations';

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

export default router;
