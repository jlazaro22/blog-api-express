import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { verifyAccessToken } from 'src/lib/jwt';
import { logger } from 'src/lib/winston';

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided.',
    });

    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided.',
    });

    return;
  }

  try {
    const jwtPayload = verifyAccessToken(token) as {
      userId: Types.ObjectId;
    };

    req.userId = jwtPayload.userId;

    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token expired, please login again.',
      });

      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token.',
      });

      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error during authentication.', err);
  }
}
