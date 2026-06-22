import { body, validationResult } from 'express-validator';

export const createAnswerValidationRules = [
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required")
        .isLength({ min: 2, max: 600 }).withMessage("Name must be between 2 and 600 characters"),

    body('isCorrect')
        .exists().withMessage('isCorrect is required')
        .notEmpty().withMessage('isCorrect cannot be empty')
        .isBoolean().withMessage('isCorrect must be a boolean value'),

    body('status')
        .exists().withMessage('status is required')
        .isIn(['ACTIVE', 'INACTIVE']).withMessage('Status must be either ACTIVE or INACTIVE'),

    body('questionId')
        .exists().withMessage('questionId is required')
        .notEmpty().withMessage('questionId cannot be empty')
        .isInt().withMessage('questionId must be an integer'),
];



export const updateAnswerValidationRules = [
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required")
        .isLength({ min: 2, max: 600 }).withMessage("Name must be between 2 and 600 characters"),
    body('isCorrect')
        .exists().withMessage('isCorrect is required')
        .notEmpty().withMessage('isCorrect cannot be empty')
        .isBoolean().withMessage('isCorrect must be a boolean value'),

    body('status')
        .exists().withMessage('status is required')
        .isIn(['ACTIVE', 'INACTIVE']).withMessage('Status must be either ACTIVE or INACTIVE'),

];