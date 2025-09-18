import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import User from 'src/models/user';

export default async function deleteUserById(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.params.userId;

  try {
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
