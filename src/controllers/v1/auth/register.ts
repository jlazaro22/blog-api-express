import { Request, Response } from 'express';
import config from 'src/config';
import { generateAccessToken, generateRefreshToken } from 'src/lib/jwt';

import { logger } from 'src/lib/winston';
import Token from 'src/models/token';
import User, { IUser } from 'src/models/user';
import { generateUsername } from 'src/utils';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

export default async function register(
  req: Request,
  res: Response,
): Promise<void> {
  const { email, password, role }: UserData = req.body;

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      code: 'AuthorizationError',
      message: ' You can not register as an admin.',
    });

    logger.warn(
      `User with email ${email} is trying to register as an admin but is not whitelisted.`,
    );

    return;
  }

  try {
    const username = generateUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });

    logger.info('Refresh token created for user:', {
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info('User registered successfully.', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error during user registration.', err);
  }
}
