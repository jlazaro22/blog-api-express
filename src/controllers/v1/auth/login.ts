import { Request, Response } from 'express';
import config from 'src/config';
import { generateAccessToken, generateRefreshToken } from 'src/lib/jwt';

import { logger } from 'src/lib/winston';
import Token from 'src/models/token';
import User, { IUser } from 'src/models/user';

export type UserLoginData = Pick<IUser, 'email' | 'password'>;

export default async function login(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, password }: UserLoginData = req.body;

    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found.',
      });

      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Token.create({
      token: refreshToken,
      userId: user._id,
    });

    logger.info('Refresh token created for user:', {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    logger.info('User registered successfully.', user);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error during user login.', err);
  }
}
