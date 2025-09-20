import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import Blog from 'src/models/blog';
import User from 'src/models/user';

export default async function deleteBlog(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId)
      .select('author banner.publicId')
      .lean()
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });

      return;
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions.',
      });

      logger.warn('A user tried to delete a blog without permissions', {
        userId,
        blog,
      });

      return;
    }

    await cloudinary.uploader.destroy(blog.banner.publicId);
    logger.info('Blog banner image deleted from Cloudinary.', {
      publicId: blog.banner.publicId,
    });

    await Blog.deleteOne({ _id: blogId });
    logger.info('Blog deleted successfully.', { blogId });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error during blog deletion.', err);
  }
}
