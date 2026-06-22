import { body } from 'express-validator';

export const userNamesValidationRules = [
    body("name")
        .trim()
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("Name can only contain letters and spaces"),

    body("lastName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Last name must be between 2 and 100 characters")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("Last name can only contain letters and spaces")
];


export const updateUserValidationRules = [
    body('name')
        .optional()
        .isString().withMessage('Name must be a string.')
        .isLength({ max: 100 }).withMessage('Name must be at most 100 characters.'),

    body('lastName')
        .optional()
        .isString().withMessage('Last name must be a string.')
        .isLength({ max: 100 }).withMessage('Last name must be at most 100 characters.'),

    body('role')
        .optional()
        .isIn(['USER', 'ADMIN']).withMessage('Role must be USER or ADMIN.'),

    body().custom((_, { req }) => {
        const { name, lastName, role } = req.body;
        if (name === undefined && lastName === undefined && role === undefined) {
            throw new Error('At least one field (name, lastName, role) must be provided.');
        }
        return true;
    })
];