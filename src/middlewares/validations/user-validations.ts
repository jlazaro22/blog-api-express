import { body, cookie } from 'express-validator';
import handleValidationErrors from './handle-validation-errors';

export const userRegisterRequestValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters long')
    .isEmail()
    .withMessage('Invalid email address'),
  // .custom(async (value) => {
  //   const userExists = await User.exists({ email: value });

  //   if (userExists) {
  //     throw new Error('User email or password is invalid');
  //   }
  // }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either "admin" or "user"'),
  handleValidationErrors,
];

export const userLoginRequestValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters long')
    .isEmail()
    .withMessage('Invalid email address'),
  // .custom(async (value) => {
  //   const userExists = await User.exists({ email: value });

  //   if (!userExists) {
  //     throw new Error('User email or password is invalid');
  //   }
  // }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  // .custom(async (value, { req }) => {
  //   const { email }: UserLoginData = req.body;

  //   const user = await User.findOne({ email })
  //     .select('password')
  //     .lean()
  //     .exec();

  //   if (!user) {
  //     throw new Error('User email or password is invalid');
  //   }

  //   const passwordMatch = await compare(value, user.password);

  //   if (!passwordMatch) {
  //     throw new Error('User email or password is invalid');
  //   }
  // }),
  handleValidationErrors,
];

export const userRefreshTokenRequestValidation = [
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token'),
  handleValidationErrors,
];
