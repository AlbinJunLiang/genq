import { body } from 'express-validator';

export const createQuestionValidationRules = [
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required")
        .isLength({ min: 2, max: 600 }).withMessage("Name must be between 2 and 600 characters"),

    body("feedback").trim()
        .optional()
        .isLength({ min: 0, max: 600 }).withMessage("Feedback must be between 0 and 600 characters"),


    body("status")
        .trim()
        .toUpperCase()
        .isIn(["ACTIVE", "INACTIVE"]),

    body("type")
        .trim()
        .toUpperCase()
        .notEmpty().withMessage("Type is required")
        .isIn(["MULTIPLE", "UNIQUE"])
        .withMessage("Type must be UNIQUE OR MULTIPLE."),
    body("quizId")
        .notEmpty().withMessage("QuizId is required")
        // Valida que sea un entero
        .isInt().withMessage("QuizId must be an integer")
        // Valida que sea positivo (mayor a 0)
        .custom((value) => {
            if (value <= 0) {
                throw new Error("QuizId must be a positive number");
            }
            return true;
        })

];


export const updateQuestionValidationRules = [
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required")
        .isLength({ min: 2, max: 600 }).withMessage("Name must be between 2 and 600 characters"),
    body("status")
        .trim()
        .toUpperCase()
        .isIn(["ACTIVE", "INACTIVE"]),
    body("type")
        .trim()
        .notEmpty().withMessage("Type is required")
        .isIn(["MULTIPLE", "UNIQUE"])
        .withMessage("Tyoe must be UNIQUE OR MULTIPLE."),

    body("feedback").trim()
        .optional()
        .isLength({ min: 0, max: 600 }).withMessage("Feedback must be between 0 and 600 characters"),


];