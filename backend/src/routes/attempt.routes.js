import { Router } from 'express';
import { deleteAttemptController, getMyAttempts } from '../controllers/attempt.controller.js';
import { verifyFirebaseTokenAndUser } from '../middlewares/firebase-middleware.js';
import { validateRequest } from '../middlewares/bad-request-error.js';

const attemptRouter = Router();

/**
 * @swagger
 * /api/v1/attempts/my-attempts:
 *   get:
 *     summary: Obtener intentos del usuario autenticado
 *     description: Retorna los intentos del usuario logueado con paginación.
 *     tags:
 *       - Attempts
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página (por defecto 1)
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de registros por página
 *
 *     responses:
 *       200:
 *         description: Lista de intentos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "64f1c2a9b1"
 *                       quizId:
 *                         type: string
 *                         example: "quiz_123"
 *                       score:
 *                         type: number
 *                         example: 85
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-29T10:00:00Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 42
 *
 *       401:
 *         description: No autorizado (token inválido o inexistente)
 *
 *       500:
 *         description: Error interno del servidor
 */

attemptRouter.get('/my-attempts', validateRequest, verifyFirebaseTokenAndUser, getMyAttempts);

/**
 * @swagger
 * /api/v1/attempts/{id}:
 *   delete:
 *     summary: Delete an attempt by ID
 *     description: Deletes a specific attempt belonging to the authenticated user.
 *     tags:
 *       - Attempts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attempt ID
 *     responses:
 *       200:
 *         description: Attempt deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attempt deleted successfully
 *
 *       404:
 *         description: Attempt not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Attempt not found or unauthorized
 *
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *
 *       403:
 *         description: Forbidden (user not allowed to access this attempt)
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

attemptRouter.delete('/:id', validateRequest, verifyFirebaseTokenAndUser, deleteAttemptController)

export default attemptRouter;