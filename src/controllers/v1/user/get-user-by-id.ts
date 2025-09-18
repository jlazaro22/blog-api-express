import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import User from 'src/models/user';

export default async function getUserById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('-__v').exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFoundError',
        message: 'User not found.',
      });

      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while getting the user.', err);
  }
}
