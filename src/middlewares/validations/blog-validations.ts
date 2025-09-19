import { body } from 'express-validator';
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
