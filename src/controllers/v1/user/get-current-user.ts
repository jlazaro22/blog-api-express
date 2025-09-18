import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import User from 'src/models/user';

export default async function getCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select('-__v').lean().exec();

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while getting the current user.', err);
  }
}
