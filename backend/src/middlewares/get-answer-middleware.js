import Answer from '../models/answer.model.js';
import Question from '../models/question.model.js';
import { Quiz } from '../models/quiz.model.js';

export const getAnswerMiddleware = async (req, res, next) => {
    // Obtenemos el ID de la respuesta
    const answerId = req.params.id || req.params.answerId || req.body.answerId;

    if (!answerId) {
        return res.status(400).json({ message: 'Answer ID is required' });
    }

    try {
        // Cargamos la respuesta incluyendo su pregunta, y la pregunta incluyendo su quiz
        // Esto permite validar permisos en cualquier nivel de la jerarquía
        const answer = await Answer.findByPk(answerId, {
            include: [{
                model: Question,
                as: 'question',
                attributes: ['id', 'quiz_id'],
                include: [{
                    model: Quiz,
                    as: 'quiz',
                    attributes: ['id', 'user_id']
                }]
            }]
        });

        if (!answer || !answer.question || !answer.question.quiz) {
            return res.status(404).json({ message: 'Answer or associated resources not found' });
        }

        // Guardamos para que el autorizador acceda a: req.resource.question.quiz.user_id
        req.resource = answer;
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving answer',
            error: error.message
        });
    }
};