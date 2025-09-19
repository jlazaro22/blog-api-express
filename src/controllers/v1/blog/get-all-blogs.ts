import { Request, Response } from 'express';

import config from 'src/config';
import { logger } from 'src/lib/winston';
import Blog from 'src/models/blog';
import User from 'src/models/user';

interface QueryType {
  status?: 'draft' | 'published';
}

export default async function getAllBlogs(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;

    const user = await User.findById(userId).select('role').lean().exec();
    const query: QueryType = {};

    // Show only published blogs for the "user" role
    if (user?.role === 'user') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      blogs,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while fetching blogs.', err);
  }
}
