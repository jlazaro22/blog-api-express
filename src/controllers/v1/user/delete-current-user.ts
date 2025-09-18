import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import Token from 'src/models/token';
import User from 'src/models/user';

export default async function deleteCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.userId;

  try {
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

    await User.deleteOne({ _id: userId });
    logger.info('User account deleted successfully.', { userId });

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
