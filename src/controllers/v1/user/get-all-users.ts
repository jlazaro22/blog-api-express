import { Request, Response } from 'express';

import config from 'src/config';
import { logger } from 'src/lib/winston';
import User from 'src/models/user';

export default async function getAllUsers(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;
    const total = await User.countDocuments();

    const users = await User.find()
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      users,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while getting all users.', err);
  }
}
