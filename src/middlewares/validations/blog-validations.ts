import { body, param, query } from 'express-validator';
import handleValidationErrors from './handle-validation-errors';

export const createBlogRequestValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({
      max: 180,
    })
    .withMessage('Title must be less than 180 characters long'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either "draft" or "published"'),
  handleValidationErrors,
];

export const getAllBlogsRequestValidation = [
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

export const getBlogsByUserIdRequestValidation = [
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
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
