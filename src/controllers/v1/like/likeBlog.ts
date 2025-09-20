import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import Blog from 'src/models/blog';
import Like from 'src/models/like';

export default async function likeBlog(
  req: Request,
  res: Response,
): Promise<void> {
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
    const blog = await Blog.findById(blogId).select('likesCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });

      return;
    }

    const existingLike = await Like.findOne({
      blogId,
      userId,
    })
      .lean()
      .exec();

    if (existingLike) {
      res.status(400).json({
        code: 'BadRequestError',
        message: 'You already liked this blog.',
      });

      return;
    }

    await Like.create({
      blogId,
      userId,
    });

    blog.likesCount++;
    await blog.save();
    logger.info('Blog liked successfully.', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    res.status(200).json({ likesCount: blog.likesCount });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while liking the blog.', err);
  }
}
