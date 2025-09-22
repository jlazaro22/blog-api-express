import { Request, Response } from 'express';
import { logger } from 'src/lib/winston';
import Blog from 'src/models/blog';
import Comment from 'src/models/comment';
import User from 'src/models/user';

export default async function deleteComment(
  req: Request,
  res: Response,
): Promise<void> {
  const currentUserId = req.userId;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .lean()
      .exec();
    const user = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();

    if (!comment) {
      res.status(404).json({
        code: 'NotFoundError',
        message: 'Comment not found.',
      });

      return;
    }

    if (comment.userId !== currentUserId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions.',
      });

      logger.warn('A user tried to delete a comment without permissions', {
        userId: currentUserId,
        comment,
      });

      return;
    }

    logger.info('Comment deleted successfully.', {
      commentId,
    });

    await Comment.deleteOne({ _id: commentId });

    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });

      return;
    }

    blog.commentsCount--;
    await blog.save();

    logger.info('Blog comments count updated.', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error deleting comment.', err);
  }
}
