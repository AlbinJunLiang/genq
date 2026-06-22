import { Router } from 'express';
import * as answerController from '../controllers/answer.controller.js';
import { authorize } from '../middlewares/authorize-middleware.js';
import { getAnswerMiddleware } from '../middlewares/get-answer-middleware.js';
import { getQuestionMiddleware } from '../middlewares/get-question-middleware.js';
import { verifyFirebaseTokenAndUser } from '../middlewares/firebase-middleware.js';
import { createAnswerValidationRules, updateAnswerValidationRules } from '../validators/answer-validator.js';
import { validateRequest } from '../middlewares/bad-request-error.js';

const answerRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: Gestión de respuestas de las preguntas
 */

/**
 * @swagger
 * /api/v1/answers:
 *   post:
 *     summary: Crear una nueva respuesta
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - questionId
 *             properties:
 *               content:
 *                 type: string
 *                 example: "JavaScript"
 *               isCorrect:
 *                 type: boolean
 *                 example: true
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *               questionId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Respuesta creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
answerRouter.post('/',
    createAnswerValidationRules,
    validateRequest,
    verifyFirebaseTokenAndUser,
    getQuestionMiddleware,
    authorize('canCreateAnswer'),
    answerController.create);

/**
 * @swagger
 * /api/v1/answers/{answerId}:
 *   put:
 *     summary: Actualizar una respuesta
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la respuesta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               isCorrect:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Respuesta actualizada exitosamente
 *       404:
 *         description: Respuesta no encontrada
 *       401:
 *         description: No autorizado
 */
answerRouter.put('/:answerId',
    updateAnswerValidationRules,
    validateRequest,
    verifyFirebaseTokenAndUser,
    getAnswerMiddleware,
    authorize('canUpdateAnswer'),
    answerController.update);

/**
 * @swagger
 * /api/v1/answers/{answerId}:
 *   delete:
 *     summary: Eliminar una respuesta
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la respuesta
 *     responses:
 *       204:
 *         description: Respuesta eliminada exitosamente
 *       404:
 *         description: Respuesta no encontrada
 *       401:
 *         description: No autorizado
 */
answerRouter.delete('/:answerId', 
    verifyFirebaseTokenAndUser,
    getAnswerMiddleware,
    authorize('canDeleteAnswer'),
     answerController.remove);

export default answerRouter;