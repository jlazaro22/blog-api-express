import { body, param } from 'express-validator';
import handleValidationErrors from './handle-validation-errors';

export const commentBlogRequestValidation = [
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  handleValidationErrors,
];

export const getCommentsByBlogIdRequestValidation = [
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  handleValidationErrors,
];

export const deleteCommentRequestValidation = [
  param('commentId').isMongoId().withMessage('Invalid comment ID'),
  handleValidationErrors,
];
