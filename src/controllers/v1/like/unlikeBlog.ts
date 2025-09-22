import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import Blog from 'src/models/blog';
import Like from 'src/models/like';

export default async function unlikeBlog(
  req: Request,
  res: Response,
): Promise<void> {
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
    const existingLike = await Like.findOne({
      blogId,
      userId,
    })
      .lean()
      .exec();

    if (!existingLike) {
      res.status(404).json({
        code: 'NotFoundError',
        message: 'Like not found.',
      });

      return;
    }

    await Like.deleteOne({ _id: existingLike._id });

    const blog = await Blog.findById(blogId).select('likesCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });

      return;
    }

    blog.likesCount--;
    await blog.save();
    logger.info('Blog unliked successfully.', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while unliking the blog.', err);
  }
}
