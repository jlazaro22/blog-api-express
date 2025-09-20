import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import Blog from 'src/models/blog';
import User from 'src/models/user';

export default async function deleteUserById(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.params.userId;

  try {
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();

    const publicIds = blogs.map(({ banner }) => banner.publicId);

    await cloudinary.api.delete_resources(publicIds);
    logger.info('Multiple blog banners deleted from Cloudinary.', {
      publicIds,
    });

    await Blog.deleteMany({ author: userId });
    logger.info('Multiple blogs deleted.', { userId, blogs });

    await User.deleteOne({ _id: userId });
    logger.info('User account deleted successfully.', { userId });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while deleting the user.', err);
  }
}
