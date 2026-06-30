import { mappingAttemptResponse } from '../mappers/attempt-mapper.js';
import QuizAttempt from '../models/quiz-attempt.model.js';
import { Quiz } from '../models/quiz.model.js';

/**
 * Crea un nuevo intento de quiz
 * @param {Object} data Datos necesarios (quiz_id, user_id)
 */
export const createAttempt = async (data) => {
    try {
        const attempt = await QuizAttempt.create({
            // Si data.user_id es undefined, Sequelize insertará NULL
            user_id: data.user_id || null,
            quiz_id: data.quiz_id,
            status: 'IN_PROGRESS',
            score: 0
        });
        return attempt;
    } catch (error) {
        console.error("Error al crear el intento:", error);
        throw new Error("No se pudo iniciar el intento de quiz");
    }
};



/**
 * Actualiza el intento cuando el usuario finaliza
 */
export const finishAttempt = async (uuid, results) => {
    try {
        // 1. Buscamos el intento usando el uuid proporcionado
        const attempt = await QuizAttempt.findOne({ where: { uuid } });

        if (!attempt) {
            // Lanzamos un error explícito para que el controlador lo capture
            throw new Error("ATTEMPT_NOT_FOUND");
        }

        // 2. Validación de estado: Prevenir re-envíos
        if (attempt.status === 'COMPLETED') {
            throw new Error("ATTEMPT_ALREADY_COMPLETED");
        }

        // 3. Actualización
        return await attempt.update({
            quiz_attempted_content: results.content, // Si es tipo JSON en Sequelize, no necesita stringify
            score: results.score,
            duration_seconds: results.duration,
            status: 'COMPLETED',
            finished_at: new Date()
        });
    } catch (error) {
        // Log detallado para el servidor
        console.error(`Error al finalizar el intento ${uuid}:`, error.message);
        throw error; // Re-lanzamos para que el controlador maneje la respuesta HTTP
    }
};


/**
 * Obtiene el historial de intentos de un usuario específico
 */

export const getUserAttemptsPaginated = async (userId, page = 1, limit = 10) => {
    try {
        const offset = (page - 1) * limit;

        const { count, rows } = await QuizAttempt.findAndCountAll({
            where: { user_id: userId },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']],
            include: [{
                model: Quiz,
                as: 'quiz', // <--- El alias es 'quiz'
                attributes: ['title']
            }]
        });

        return {
            attempts: rows.map(attempt => {
                const plainAttempt = attempt.toJSON();
                return {
                    ...mappingAttemptResponse(attempt)
                };
            }),
            pagination: {
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit),
                limit

            }
        };
    } catch (error) {
        console.error(`Error fetching attempts for user ${userId}:`, error);
        throw new Error("Unable to retrieve user history");
    }
};


export const deleteAttempt = async (attemptId, userId) => {
    // 1. Buscamos el intento y validamos que pertenezca al usuario
    const attempt = await QuizAttempt.findOne({
        where: {
            id: attemptId,
            user_id: userId // ¡Seguridad obligatoria!
        }
    });

    if (!attempt) {
        throw new Error("ATTEMPT_NOT_FOUND_OR_UNAUTHORIZED");
    }

    // 2. Eliminamos
    return await attempt.destroy();
};