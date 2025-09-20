import DOMPurify from 'dompurify';
import { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import { logger } from 'src/lib/winston';

import Blog, { IBlog } from 'src/models/blog';
import User from 'src/models/user';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export default async function updateBlog(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { title, content, banner, status }: BlogData = req.body;
    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('-__v').exec();

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

      logger.warn('A user tried to update a blog without permissions', {
        userId,
        blog,
      });

      return;
    }

    if (title) blog.title = title;
    if (content) blog.content = purify.sanitize(content);
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();
    logger.info('Blog updated.', blog);

    res.status(200).json({ blog });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while updating blog.', err);
  }
}
