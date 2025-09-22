import DOMPurify from 'dompurify';
import { Request, Response } from 'express';
import { JSDOM } from 'jsdom';

import { logger } from 'src/lib/winston';
import Blog from 'src/models/blog';
import Comment, { IComment } from 'src/models/comment';

type CommentData = Pick<IComment, 'content'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export default async function commentBlog(
  req: Request,
  res: Response,
): Promise<void> {
  const { content }: CommentData = req.body;
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });

      return;
    }

    const cleanContent = purify.sanitize(content);

    const newComment = await Comment.create({
      blogId,
      content: cleanContent,
      userId,
    });
    logger.info('New comment created.', newComment);

    blog.commentsCount++;
    await blog.save();
    logger.info('Blog comments count updated.', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.status(201).json({ comment: newComment });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error adding a comment to a blog.', err);
  }
}
