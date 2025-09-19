import { Request, Response } from 'express';

import config from 'src/config';
import { logger } from 'src/lib/winston';
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
    const userExists = await User.exists({ email });

    if (userExists) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'User already registered.',
      });

      return;
    }

    const username = generateUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
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
