import { Router } from 'express';
import { deleteAttemptController, getAttemptsController, getMyAttempts } from '../controllers/attempt.controller.js';
import { verifyFirebaseTokenAndUser } from '../middlewares/firebase-middleware.js';
import { validateRequest } from '../middlewares/bad-request-error.js';
import { getAttemptsByQuizAndAuthor } from '../services/attempt.service.js';
import { initRateLimit } from '../middlewares/rate-limit-middleware.js';

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

attemptRouter.get('/my-attempts',  initRateLimit(1,1000), validateRequest, verifyFirebaseTokenAndUser, getMyAttempts);

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

attemptRouter.delete('/:id',  initRateLimit(1,1000), validateRequest, verifyFirebaseTokenAndUser, deleteAttemptController)



/**
 * @swagger
 * /api/v1/attempts/quiz/{quizId}:
 *   get:
 *     summary: Obtener los intentos de un quiz por autor
 *     description: Devuelve los intentos realizados por un autor en un quiz específico con ordenamiento y paginación.
 *     tags:
 *       - Attempts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del quiz.
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - finished_at
 *             - score
 *           default: finished_at
 *         description: Campo por el cual ordenar.
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - ASC
 *             - DESC
 *           default: DESC
 *         description: Orden ascendente o descendente.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Cantidad de registros por página.
 *     responses:
 *       200:
 *         description: Lista de intentos obtenida correctamente.
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
 *                         type: integer
 *                         example: 12
 *                       quiz_id:
 *                         type: integer
 *                         example: 5
 *                       user_id:
 *                         type: integer
 *                         example: 8
 *                       score:
 *                         type: number
 *                         example: 92.5
 *                       finished_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-01T18:20:15.000Z"
 *                       quiz:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: Quiz de Matemáticas
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 35
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Parámetros inválidos.
 *       404:
 *         description: No se encontraron intentos.
 *       500:
 *         description: Error interno del servidor.
 */

attemptRouter.get("/quiz/:quizId", initRateLimit(1,1000), validateRequest, verifyFirebaseTokenAndUser, getAttemptsController)


export default attemptRouter;
