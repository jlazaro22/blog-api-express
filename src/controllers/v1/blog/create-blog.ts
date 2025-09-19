import DOMPurify from 'dompurify';
import { Request, Response } from 'express';
import { JSDOM } from 'jsdom';

import { logger } from 'src/lib/winston';
import Blog, { IBlog } from 'src/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export default async function createBlog(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { title, content, banner, status }: BlogData = req.body;
    const userId = req.userId;

    const cleanContent = purify.sanitize(content);

    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    });

    logger.info('New blog created.', newBlog);

    res.status(201).json({ blog: newBlog });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error during blog creation.', err);
  }
}
