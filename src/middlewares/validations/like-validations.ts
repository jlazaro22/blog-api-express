import { body, param } from 'express-validator';
import handleValidationErrors from './handle-validation-errors';

export const likeBlogRequestValidation = [
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  handleValidationErrors,
];
