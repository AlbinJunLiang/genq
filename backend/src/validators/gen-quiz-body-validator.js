import { body } from "express-validator";

export const genQuizValidationRules = [
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required")
        .isLength({ min: 10, max: 3000 }).withMessage("Content must be between 10 and 3000 characters"),

    body("model")
        .optional()
        .isLength({ max: 300 }).withMessage("Model name must be at most 300 characters"),

    body("language")
        .optional()
        .isLength({ max: 50 }).withMessage("Language must be at most 50 characters"),

    body("provider")
        .optional()
        .isLength({ max: 300 }).withMessage("Provider name must be at most 300 characters"),
];