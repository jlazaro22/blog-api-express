import { UploadApiErrorResponse } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import uploadToCloudinary from 'src/lib/cloudinary';
import { logger } from 'src/lib/winston';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function uploadBlogBanner(method: 'post' | 'put') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === 'put' && !req.file) {
      next();
      return;
    }

    if (!req.file) {
      res.status(400).json({
        code: 'ValidationError',
        message: 'Blog banner image is required.',
      });

      return;
    }

    if (req.file.size > MAX_FILE_SIZE) {
      res.status(413).json({
        code: 'ValidationError',
        message: 'Blog banner image size must be less than 2MB.',
      });

      return;
    }

    try {
      // const { blogId } = req.params;
      // const blog = await Blog.findById(blogId).select('banner.publicId').exec();

      const data = await uploadToCloudinary(
        req.file.buffer,
        // blog?.banner.publicId.replace('blog-api/', ''),
      );

      if (!data) {
        res.status(500).json({
          code: 'ServerError',
          message: 'Internal server error.',
        });

        logger.error(
          'Error while uploading blog banner image to cloudinary.',
          // {
          // blogId,
          // publicId: blog?.banner.publicId
          // }
        );

        return;
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info('Blog banner uploaded to Cloudinary.', {
        // blogId,
        banner: newBanner,
      });

      req.body.banner = newBanner;

      next();
    } catch (err: UploadApiErrorResponse | any) {
      res.status(err.http_code).json({
        code: err.http_code < 500 ? 'ValidationError' : err.name,
        message: err.message,
      });

      logger.error(
        'Error while uploading blog banner image to cloudinary.',
        err,
      );
    }
  };
}
