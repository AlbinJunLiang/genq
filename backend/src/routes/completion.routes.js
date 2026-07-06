import { Router } from "express";
import { generateQuizController } from "../controllers/completion.controller.js";
import { genQuizValidationRules } from "../validators/gen-quiz-body-validator.js";
import { validateRequest } from "../middlewares/bad-request-error.js";
import { verifyFirebaseTokenAndUser } from "../middlewares/firebase-middleware.js";
import { rateLimitWithAdminExclusion } from "../middlewares/rate-limit-middleware.js";

const completionRouter = Router();

/**
 * @swagger
 * /api/v1/completions/generate-quiz:
 *   post:
 *     summary: Generar una completion con IA
 *     description: Envía un prompt a un proveedor de IA y devuelve la respuesta generada.
 *     tags:
 *       - Completions
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - provider
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Explícame qué es Node.js"
 *               model:
 *                 type: string
 *                 example: "gpt-4o-mini"
 *               provider:
 *                 type: string
 *                 enum:
 *                   - openai
 *                   - anthropic
 *                   - gemini
 *                 example: openai
 *               language:
 *                  type: string
 *                  example: "Español"
 *
 *     responses:
 *       200:
 *         description: Respuesta generada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: "Node.js es un entorno de ejecución..."
 *
 *       400:
 *         description: Faltan campos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Los campos 'content' y 'provider' son obligatorios."
 *
 *       422:
 *         description: Provider no soportado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Provider not supported."
 *
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno al generar la respuesta de la IA."
 *                 details:
 *                   type: string
 *                   example: "stack trace or message"
 */
completionRouter.post("/generate-quiz",
    genQuizValidationRules,
    verifyFirebaseTokenAndUser,
    rateLimitWithAdminExclusion(10, 10),
    validateRequest,
    generateQuizController);

export default completionRouter;