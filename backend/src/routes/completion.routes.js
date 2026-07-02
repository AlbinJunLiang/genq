import { Router } from "express";
import { completionController } from "../controllers/completion.controller.js";

const completionRouter = Router();

/**
 * @swagger
 * /api/v1/completions:
 *   post:
 *     summary: Generar una completion con IA
 *     description: Envía un prompt a un proveedor de IA y devuelve la respuesta generada.
 *     tags:
 *       - Completions
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
 *               instruction:
 *                 type: string
 *                 example: "Responde como profesor experto"
 *               context:
 *                 type: string
 *                 example: "Usuario principiante en programación"
 *               system:
 *                 type: boolean
 *                 example: true
 *               model:
 *                 type: string
 *                 example: "gpt-4o-mini"
 *               isJson:
 *                 type: boolean
 *                 example: false
 *               provider:
 *                 type: string
 *                 enum:
 *                   - openai
 *                   - anthropic
 *                   - gemini
 *                 example: openai
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
completionRouter.post("/", completionController);

export default completionRouter;