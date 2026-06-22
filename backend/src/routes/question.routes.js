import { Router } from 'express';
import * as questionController from '../controllers/question.controller.js';
import { getQuizMiddleware } from '../middlewares/get-quiz-middleware.js';
import { verifyFirebaseTokenAndUser } from '../middlewares/firebase-middleware.js';
import { authorize } from '../middlewares/authorize-middleware.js';
import { createQuestionValidationRules, updateQuestionValidationRules } from '../validators/question-validator.js';
import { validateRequest } from '../middlewares/bad-request-error.js';
import { getQuestionMiddleware } from '../middlewares/get-question-middleware.js';

const questionRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Gestión de preguntas de los cuestionarios
 */

/**
 * @swagger
 * /api/v1/questions:
 *   post:
 *     summary: Crear una nueva pregunta
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, type, quizId]
 *             properties:
 *               content:       
 *                 type: string
 *                 maxLength: 600
 *               type:
 *                 type: string
 *                 enum: [UNIQUE, MULTIPLE, OTHER]
 *               quizId:
 *                 type: integer
 *               feedback:
 *                 type: string
 *                 maxLength: 600
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       201:
 *         description: Creado con éxito
 */
questionRouter.post('/',
    createQuestionValidationRules,
    validateRequest,
    verifyFirebaseTokenAndUser,
    getQuizMiddleware,
    authorize('canCreateQuestion'),
    questionController.create);



/**
 * @swagger
 * /api/v1/questions/{quizId}/answers:
 *   get:
 *     summary: Obtener las preguntas de un cuestionario
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cuestionario
 *     responses:
 *       200:
 *         description: Lista de preguntas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   question:
 *                     type: string
 *                     example: ¿Cuál es la capital de Costa Rica?
 *       500:
 *         description: Error al obtener las preguntas
 */


questionRouter.get('/:quizId/answers',
    verifyFirebaseTokenAndUser,
    getQuizMiddleware,
    authorize('canReadQuestion'),
    questionController.getAnswersByQuizId);

/**
 * @swagger
 * /api/v1/questions/{questionId}:
 *   put:
 *     summary: Actualizar una pregunta
 *     tags: [Questions]
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, type]
 *             properties:
 *               content:       
 *                 type: string
 *                 maxLength: 600
 *               type:
 *                 type: string
 *                 enum: [UNIQUE, MULTIPLE, OTHER]
 *               feedback:
 *                 type: string
 *                 maxLength: 600
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 * 
 *     responses:
 *       200:
 *         description: Actualizado con éxito
 */
questionRouter.put('/:questionId',
    updateQuestionValidationRules,
    validateRequest,
    verifyFirebaseTokenAndUser,
    getQuestionMiddleware,
    authorize('canUpdateOrDeleteQuestion'),
    questionController.update);

/**
 * @swagger
 * /api/v1/questions/{questionId}:
 *   delete:
 *     summary: Eliminar una pregunta
 *     tags: [Questions]
 * 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Eliminado con éxito
 */
questionRouter.delete('/:questionId',
    verifyFirebaseTokenAndUser,
    getQuestionMiddleware,
    authorize('canUpdateOrDeleteQuestion'),
    questionController.remove);

export default questionRouter;