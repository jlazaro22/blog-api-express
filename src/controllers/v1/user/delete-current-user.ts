import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import Blog from 'src/models/blog';
import Token from 'src/models/token';
import User from 'src/models/user';

export default async function deleteCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.userId;

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

    const refreshToken: string = req.cookies.refreshToken;

    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });

      logger.info('User refresh token deleted successfully.', {
        userId: req.userId,
        token: refreshToken,
      });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while deleting current user account.', err);
  }
}
