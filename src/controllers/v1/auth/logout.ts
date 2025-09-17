import { Request, Response } from 'express';
import { logger } from 'src/lib/winston';
import Token from 'src/models/token';

export default async function logout(
  req: Request,
  res: Response,
): Promise<void> {
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

    res.sendStatus(204);

    logger.info('User logged out successfully.', {
      userId: req.userId,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error during user logout.', err);
  }
}
