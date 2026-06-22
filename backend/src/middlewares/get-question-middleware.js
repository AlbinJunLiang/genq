import Question from '../models/question.model.js';
import { Quiz } from '../models/quiz.model.js';

export const getQuestionMiddleware = async (req, res, next) => {
    const questionId = req.params.id || req.params.questionId || req.body.questionId;

    if (!questionId) {
        return res.status(400).json({ message: 'Question ID is required' });
    }

    try {
        const question = await Question.findByPk(questionId, {
            include: [{
                model: Quiz,
                as: 'quiz',
                attributes: ['id', 'user_id']
            }]
        });
        if (!question || !question.quiz) {
            return res.status(404).json({ message: 'Question or associated Quiz not found' });
        }

        // El objeto cargado ahora incluye la propiedad 'quiz'
        req.resource = question;
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving question',
            error: error.message
        });
    }
};