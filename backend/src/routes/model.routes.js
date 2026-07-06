import { Router } from "express";
import { create, list, getOne, update, remove } from "../controllers/model-controller.js";
import { verifyFirebaseTokenAndUser } from "../middlewares/firebase-middleware.js";
import { initRateLimit } from "../middlewares/rate-limit-middleware.js";
import { allowOnlyEmails } from "../middlewares/allowed-emails-middleware.js";
import { validateRequest } from "../middlewares/bad-request-error.js";

const modelRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Models
 *   description: Gestión de modelos
 */

/**
 * @swagger
 * /api/v1/models:
 *   post:
 *     summary: Crear un nuevo modelo
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - model
 *               - provider
 *             properties:
 *               model:
 *                 type: string
 *                 example: "gpt-4o"
 *               provider:
 *                 type: string
 *                 example: "OpenAI"
 *     responses:
 *       201:
 *         description: Modelo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Model created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     model:
 *                       type: string
 *                       example: "gpt-4o"
 *                     provider:
 *                       type: string
 *                       example: "OpenAI"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token inválido o ausente
 *       409:
 *         description: Ya existe un registro con ese model y provider.
 */
modelRouter.post(
    "/",
    verifyFirebaseTokenAndUser,
    allowOnlyEmails,
    validateRequest,
    create
);

/**
 * @swagger
 * /api/v1/models:
 *   get:
 *     summary: Obtener todos los modelos
 *     tags: [Models]
 *     parameters:
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del modelo
 *       - in: query
 *         name: provider
 *         schema:
 *           type: string
 *         description: Filtrar por proveedor
 *     responses:
 *       200:
 *         description: Lista de modelos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Models retrieved successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       model:
 *                         type: string
 *                         example: "gpt-4o"
 *                       provider:
 *                         type: string
 *                         example: "OpenAI"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Error interno del servidor
 */
modelRouter.get("/", initRateLimit(1, 100), list);

/**
 * @swagger
 * /api/v1/models/{id}:
 *   get:
 *     summary: Obtener un modelo por ID
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del modelo
 *     responses:
 *       200:
 *         description: Modelo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Model retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     model:
 *                       type: string
 *                       example: "gpt-4o"
 *                     provider:
 *                       type: string
 *                       example: "OpenAI"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro no encontrado.
 */
modelRouter.get(
    "/:id",
    verifyFirebaseTokenAndUser,
    allowOnlyEmails,
    validateRequest,
    getOne
);

/**
 * @swagger
 * /api/v1/models/{id}:
 *   put:
 *     summary: Actualizar un modelo
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del modelo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               model:
 *                 type: string
 *                 example: "gpt-4.1"
 *               provider:
 *                 type: string
 *                 example: "OpenAI"
 *     responses:
 *       200:
 *         description: Modelo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Model updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     model:
 *                       type: string
 *                       example: "gpt-4.1"
 *                     provider:
 *                       type: string
 *                       example: "OpenAI"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro no encontrado.
 *       409:
 *         description: Ya existe un registro con ese model y provider.
 */
modelRouter.put(
    "/:id",
    verifyFirebaseTokenAndUser,
    allowOnlyEmails,
    validateRequest,
    update
);

/**
 * @swagger
 * /api/v1/models/{id}:
 *   delete:
 *     summary: Eliminar un modelo
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del modelo
 *     responses:
 *       200:
 *         description: Modelo eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registro eliminado correctamente."
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro no encontrado.
 */
modelRouter.delete(
    "/:id",
    verifyFirebaseTokenAndUser,
    allowOnlyEmails,
    validateRequest,
    remove
);

export default modelRouter;