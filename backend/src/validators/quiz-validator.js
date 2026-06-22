import { body } from 'express-validator';

export const quizBodyValidationRules = [
    body("title")
        .trim()
        .isString().withMessage("Title must be a string")
        .isLength({ min: 1, max: 255 }).withMessage("Title must be between 1 and 255 characters")
        .notEmpty().withMessage("Title is required"),

    body("description")
        .trim()
        .isString().withMessage("Description must be a string")
        .isLength({ min: 1, max: 600 }).withMessage("Description must be between 1 and 600 characters")
        .notEmpty().withMessage("Description is required"),

    body("visibility")
        .trim()
        .notEmpty().withMessage("Visibility is required")
        .isIn(["PUBLIC", "ACCESS_ONLY_VIA_LINK", "INACTIVE", "PRIVATE"])
        .withMessage("Visibility must be PUBLIC, PRIVATE, ACCESS_ONLY_VIA_LINK, or INACTIVE"),

    body("endAt")
        .optional({ nullable: true })
        .isISO8601().withMessage("End date must be a valid ISO 8601 date")
        .toDate(),

    body("durationseconds")
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage("Duration must be a non-negative integer"),

    body("attemptsLimit")
        .isInt({ min: 0 }).withMessage("Attempts limit must be at least 0")
];