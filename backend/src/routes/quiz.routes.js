import { Router } from 'express';
import { create, getMyQuizzes, getPublicQuizzes, startQuizByUuid, 
     getQuizEvaluation, remove, search, update } from '../controllers/quiz.controller.js';
import { verifyFirebaseToken, verifyFirebaseTokenAndUser } from '../middlewares/firebase-middleware.js';
import { authorize } from '../middlewares/authorize-middleware.js';
import { getQuizMiddleware } from '../middlewares/get-quiz-middleware.js';
import { paginationValidationRules } from '../validators/pagination-validator.js';
import { validateRequest } from '../middlewares/bad-request-error.js';
import { quizBodyValidationRules } from '../validators/quiz-validator.js';

const quizRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Gestión de quizzes
 */

/**
 * @swagger
 * /api/v1/quizzes:
 *   post:
 *     summary: Crear un quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Quiz de Historia"
 *               description:
 *                 type: string
 *                 maxLength: 600
 *                 example: "Un quiz sobre historia universal"
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE, ACCESS_ONLY_VIA_LINK, INACTIVE]
 *                 default: PUBLIC
 *               endAt:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de cierre en ISO 8601. Debe ser futura.
 *                 example: "2025-12-31T23:59:59.000Z"
 *               durationSeconds:
 *                 type: integer
 *                 minimum: 0
 *                 example: 300
 *               attemptsLimit:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 example: 3
 *     responses:
 *       201:
 *         description: Quiz creado exitosamente
 *       400:
 *         description: Validación fallida o endAt en el pasado
 *       401:
 *         description: Token Firebase inválido o ausente
 */
quizRouter.post('/', quizBodyValidationRules, validateRequest, verifyFirebaseTokenAndUser, create);

/**
 * @swagger
 * /api/v1/quizzes/{id}:
 *   put:
 *     summary: Actualizar un quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID interno del quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 600
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE, ACCESS_ONLY_VIA_LINK, INACTIVE]
 *               endAt:
 *                 type: string
 *                 format: date-time
 *                 description: Debe ser una fecha futura
 *               durationSeconds:
 *                 type: integer
 *                 minimum: 0
 *               attemptsLimit:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Quiz actualizado exitosamente
 *       400:
 *         description: endAt en el pasado u otro error de validación
 *       404:
 *         description: Quiz no encontrado
 */
quizRouter.put('/:id', verifyFirebaseTokenAndUser, getQuizMiddleware, authorize('canUpdateQuiz'), update);

/**
 * @swagger
 * /api/v1/quizzes:
 *   get:
 *     summary: Listar quizzes públicos
 *     tags: [Quizzes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Resultados por página
 *     responses:
 *       200:
 *         description: Lista de quizzes públicos con paginación
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
 *                         example: 1
 *                       uuid:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                       title:
 *                         type: string
 *                         example: "Quiz de Historia"
 *                       description:
 *                         type: string
 *                         example: "Un quiz sobre historia universal"
 *                       visibility:
 *                         type: string
 *                         enum: [PUBLIC, PRIVATE, ACCESS_ONLY_VIA_LINK, INACTIVE]
 *                       end_at:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       duration_seconds:
 *                         type: integer
 *                         nullable: true
 *                         example: 300
 *                       attempts_limit:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Parámetros de paginación inválidos
 */
quizRouter.get('/', paginationValidationRules, validateRequest, getPublicQuizzes);

/**
 * @swagger
 * /api/v1/quizzes/uuid/{uuid}:
 *   post:
 *     summary: Obtener un quiz por UUID (con preguntas y respuestas)
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID v4 del quiz
 *     responses:
 *       200:
 *         description: >
 *           Objeto quiz con preguntas y respuestas anidadas.
 *           Solo disponible para visibilidad PUBLIC o ACCESS_ONLY_VIA_LINK.
 *           Los campos is_correct y feedback son excluidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 uuid:
 *                   type: string
 *                   format: uuid
 *                   example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 title:
 *                   type: string
 *                   example: "Quiz de Historia"
 *                 description:
 *                   type: string
 *                   example: "Un quiz sobre historia universal"
 *                 visibility:
 *                   type: string
 *                   enum: [PUBLIC, PRIVATE, ACCESS_ONLY_VIA_LINK, INACTIVE]
 *                 end_at:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 duration_seconds:
 *                   type: integer
 *                   nullable: true
 *                 attempts_limit:
 *                   type: integer
 *                   example: 1
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       text:
 *                         type: string
 *                         example: "¿En qué año comenzó la Segunda Guerra Mundial?"
 *                       answers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             text:
 *                               type: string
 *                               example: "1939"
 *       404:
 *         description: Quiz no encontrado o visibilidad no permitida
 */
quizRouter.post('/uuid/:uuid', startQuizByUuid);


/**
 * @swagger
 * /api/v1/quizzes/me:
 *   get:
 *     summary: Listar quizzes del usuario autenticado
 *     tags:
 *       - Quizzes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: visibility
 *         required: false
 *         description: Filtrar por visibilidad del quiz
 *         schema:
 *           type: string
 *           enum:
 *             - PUBLIC
 *             - PRIVATE
 *             - ACCESS_ONLY_VIA_LINK
 *             - INACTIVE
 *     responses:
 *       200:
 *         description: Quizzes del usuario con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Parámetros de paginación inválidos
 *       401:
 *         description: Token Firebase inválido o ausente
 */

quizRouter.get('/me', paginationValidationRules, validateRequest, verifyFirebaseTokenAndUser, getMyQuizzes);

/**
 * @swagger
 * /api/v1/quizzes/search:
 *   get:
 *     summary: Buscar quizzes públicos por título o descripción
 *     tags: [Quizzes]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto a buscar (coincidencia parcial en título y descripción)
 *         example: "historia"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Resultados de búsqueda con paginación. Retorna vacío si search está en blanco.
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
 *                         example: 1
 *                       uuid:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                       title:
 *                         type: string
 *                         example: "Quiz de Historia"
 *                       description:
 *                         type: string
 *                         example: "Un quiz sobre historia universal"
 *                       visibility:
 *                         type: string
 *                         enum: [PUBLIC, PRIVATE, ACCESS_ONLY_VIA_LINK, INACTIVE]
 *                       end_at:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       duration_seconds:
 *                         type: integer
 *                         nullable: true
 *                         example: 300
 *                       attempts_limit:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Parámetros de paginación inválidos
 */
quizRouter.get('/search', paginationValidationRules, validateRequest, search);

/**
 * @swagger
 * /api/v1/quizzes/{id}:
 *   delete:
 *     summary: Eliminar un quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID interno del quiz
 *     responses:
 *       200:
 *         description: Quiz eliminado. Retorna true.
 *       401:
 *         description: Token Firebase inválido o ausente
 *       403:
 *         description: Sin permiso para eliminar este quiz (canDeleteQuiz)
 *       404:
 *         description: Quiz no encontrado
 */
quizRouter.delete('/:id', verifyFirebaseTokenAndUser, getQuizMiddleware, authorize('canDeleteQuiz'), remove);

/**
 * @swagger
 * /api/v1/quizzes/evaluate/{uuid}:
 *   post:
 *     summary: Evaluar las respuestas de un quiz
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quizId
 *               - attemptId
 *               - answers
 *             properties:
 *               quizId:
 *                 type: integer
 *                 example: 1
 *               attemptId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - answerIds
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       example: 1
 *                     answerIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 2]
 *     responses:
 *       200:
 *         description: Resultado de la evaluación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                   example: 2
 *                 totalQuestions:
 *                   type: integer
 *                   example: 3
 *                 percentage:
 *                   type: number
 *                   example: 66.67
 *                 review:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionId:
 *                         type: integer
 *                       question:
 *                         type: string
 *                       isCorrect:
 *                         type: boolean
 *                       feedback:
 *                         type: string
 *                       selectedAnswers:
 *                         type: array
 *                         items:
 *                           type: integer
 *                       correctAnswers:
 *                         type: array
 *                         items:
 *                           type: integer
 *                       wrongSelected:
 *                         type: array
 *                         items:
 *                           type: object
 *                       missingCorrect:
 *                         type: array
 *                         items:
 *                           type: object
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Quiz no encontrado
 *       500:
 *         description: Error interno del servidor
 */
quizRouter.post('/evaluate/:uuid', getQuizEvaluation);

export default quizRouter;