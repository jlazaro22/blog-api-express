import { body, param, query } from 'express-validator';
import User from 'src/models/user';
import handleValidationErrors from './handle-validation-errors';

export const userUpdateRequestValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less than 20 characters long')
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });

      if (userExists) {
        throw new Error('This username is already in use.');
      }
    }),
  body('email')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters long')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });

      if (userExists) {
        throw new Error('This email is already in use.');
      }
    }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('firstName')
    .optional()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters long'),
  body('lastName')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters long'),
  body(['website', 'facebook', 'instagram', 'x', 'youtube', 'linkedin'])
    .optional()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 100 })
    .withMessage('URL must be less than 100 characters long'),
  handleValidationErrors,
];

export const getAllUsersRequestValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer'),
  handleValidationErrors,
];

export const getOrDeleteUserByIdRequestValidation = [
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
  handleValidationErrors,
];
