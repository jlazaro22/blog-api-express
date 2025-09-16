import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from 'src/config';

export function generateAccessToken(userId: Types.ObjectId): string {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
}

export function generateRefreshToken(userId: Types.ObjectId): string {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken',
  });
}
