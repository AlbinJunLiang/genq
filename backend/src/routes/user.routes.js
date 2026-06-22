import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { userNamesValidationRules } from '../validators/user-validator.js';
import { validateRequest } from '../middlewares/bad-request-error.js';
import { verifyFirebaseTokenAndUser } from '../middlewares/firebase-middleware.js';
import { authorize } from '../middlewares/authorize-middleware.js';

const userRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/v1/users/auth:
 *   post:
 *     summary: Registrar o sincronizar un usuario desde Firebase
 *     tags: [Users]
 *     description: >
 *       Extrae el token Bearer del header Authorization y crea el usuario
 *       si no existe, o lo retorna si ya está sincronizado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     auth_id:
 *                       type: string
 *                       example: "firebase-uid-abc123"
 *                     email:
 *                       type: string
 *                       example: "usuario@ejemplo.com"
 *                     name:
 *                       type: string
 *                       example: "Juan"
 *                     last_name:
 *                       type: string
 *                       example: "Pérez"
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       200:
 *         description: Usuario ya existía, retorna el registro sincronizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The user is already synchronized."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     auth_id:
 *                       type: string
 *                       example: "firebase-uid-abc123"
 *                     email:
 *                       type: string
 *                       example: "usuario@ejemplo.com"
 *                     name:
 *                       type: string
 *                       example: "Juan"
 *                     last_name:
 *                       type: string
 *                       example: "Pérez"
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Error de validación o token inválido
 *       401:
 *         description: Token no provisto
 */
userRoutes.post('/auth', userController.register);


import { updateUserValidationRules } from '../validators/user-validator.js';
import { update } from '../controllers/user.controller.js';

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualizar datos de un usuario (solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID interno del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Pérez"
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 example: "ADMIN"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     auth_id:
 *                       type: string
 *                       example: "firebase-uid-abc123"
 *                     email:
 *                       type: string
 *                       example: "usuario@ejemplo.com"
 *                     name:
 *                       type: string
 *                       example: "Juan"
 *                     last_name:
 *                       type: string
 *                       example: "Pérez"
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Ningún campo enviado o validación fallida
 *       401:
 *         description: Token Firebase inválido o ausente
 *       403:
 *         description: Sin permiso (se requiere rol ADMIN)
 *       404:
 *         description: Usuario no encontrado
 */
userRoutes.put('/:id', updateUserValidationRules, validateRequest, verifyFirebaseTokenAndUser, authorize('onlyAdmin'), update);

/**
 * @swagger
 * /api/v1/users/email/{email}:
 *   get:
 *     summary: Buscar usuario por email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: "usuario@ejemplo.com"
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User found successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     auth_id:
 *                       type: string
 *                       example: "firebase-uid-abc123"
 *                     email:
 *                       type: string
 *                       example: "usuario@ejemplo.com"
 *                     name:
 *                       type: string
 *                       example: "Juan"
 *                     last_name:
 *                       type: string
 *                       example: "Pérez"
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
userRoutes.get('/email/:email', userController.findByEmail);

/**
 * @swagger
 * /api/v1/users/{id}/names:
 *   patch:
 *     summary: Actualizar nombre y apellido del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID interno del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastName
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Pérez"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     auth_id:
 *                       type: string
 *                       example: "firebase-uid-abc123"
 *                     email:
 *                       type: string
 *                       example: "usuario@ejemplo.com"
 *                     name:
 *                       type: string
 *                       example: "Juan"
 *                     last_name:
 *                       type: string
 *                       example: "Pérez"
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validación fallida
 *       401:
 *         description: Token Firebase inválido o ausente
 *       403:
 *         description: Sin permiso para actualizar este usuario (canUpdateNames)
 *       404:
 *         description: Usuario no encontrado
 */
userRoutes.patch('/:id/names', userNamesValidationRules, validateRequest, verifyFirebaseTokenAndUser, authorize('canUpdateNames'), userController.updateNames);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID interno del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully."
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
userRoutes.delete('/:id', userController.remove);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Listar todos los usuarios con paginación
 *     tags: [Users]
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
 *         description: Lista de usuarios con metadata de paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       auth_id:
 *                         type: string
 *                         example: "firebase-uid-abc123"
 *                       email:
 *                         type: string
 *                         example: "usuario@ejemplo.com"
 *                       name:
 *                         type: string
 *                         example: "Juan"
 *                       last_name:
 *                         type: string
 *                         example: "Pérez"
 *                       role:
 *                         type: string
 *                         enum: [USER, ADMIN]
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Error interno del servidor
 */
userRoutes.get('/', userController.getUsers);

export default userRoutes;