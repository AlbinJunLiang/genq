import { Quiz } from "../models/quiz.model.js";

export const getQuizMiddleware = async (req, res, next) => {
    // Intentamos obtener el ID ya sea de la URL (params) o del cuerpo de la petición (body)
    const quizId = req.params.id || req.params.quizId || req.body.quizId;

    if (!quizId) {
        return res.status(400).json({ message: 'Quiz ID is required' });
    }
    try {
        const quiz = await Quiz.findByPk(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Guardamos el recurso para que el middleware 'authorize' lo use
        req.resource = quiz;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving quiz', error: error.message });
    }
};