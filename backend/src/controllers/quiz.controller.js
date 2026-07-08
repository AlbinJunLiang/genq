import { mappingQuestionWithAllAnswers } from '../mappers/question-mapper.js';
import { mappingQuizResponse, mapQuizWithQuestion, mapQuizWithQuestionAndAnswers } from '../mappers/quiz-mapper.js';
import { quizSchema } from '../schemas/quiz-schema.js';
import { submitQuizSchema } from '../schemas/submit-quiz-schema.js';
import { getReview } from '../services/quiz-evaluation.service.js';
import * as quizService from '../services/quiz.service.js';

export const create = async (req, res) => {
    try {
        if (!req.body.title) return res.status(400).json({ error: "Title is required." });

        const quiz = await quizService.createQuiz((req.body), req.user.id);

        return res.status(201).json({ message: "Quiz created successfully.", quiz: mappingQuizResponse(quiz) });
    } catch (error) {
        return res.status(400).json({ message: "Failed to create quiz.", error: error.message });
    }
};


export const update = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedQuiz = await quizService.updateQuiz(id, req.body);

        return res.status(200).json({
            success: true,
            quiz: mappingQuizResponse(updatedQuiz)
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message
        });
    }
};


export const getPublicQuizzes = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await quizService.getQuizzesPaginated(
            page,
            limit,
            { visibility: 'PUBLIC' }
        );

        // Aplicamos el mismo mapeo para asegurar consistencia
        const mappedData = result.data.map(quiz => mappingQuizResponse(quiz));

        return res.status(200).json({
            ...result,
            data: mappedData
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching public quizzes',
            error: error.message
        });
    }
};



export const getMyQuizzes = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const visibility = req.query.visibility; // Puede ser 'PUBLIC', 'PRIVATE', etc.

        // Filtro base (obligatorio)
        const filters = { user_id: req.user.id };

        // Solo añadimos visibilidad si el usuario envió el parámetro
        if (visibility && visibility !== 'ALL') {
            filters.visibility = visibility;
        }

        const result = await quizService.getQuizzesPaginated(page, limit, filters);

        const mappedData = result.data.map(quiz => mappingQuizResponse(quiz));

        return res.status(200).json({
            ...result,
            data: mappedData
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching my quizzes',
            error: error.message
        });
    }
};


export const startQuizByUuid = async (req, res) => {
    try {

        // 1. Recibimos el objeto que contiene quiz y attemptUuid
        const result = await quizService.startQuizByUuid(req.params.uuid, false, req.user);

        // 2. Si el servicio lanzó error al no encontrar el quiz, el catch lo manejará.
        // Pero si result es null, por seguridad:
        if (!result) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // 3. Mapeamos solo la parte del quiz, pero preservamos el attemptUuid
        return res.status(200).json({
            quiz: mapQuizWithQuestion(result.quiz),
            attemptUuid: result.attemptUuid // ¡Aquí está la pieza que faltaba!
        });

    } catch (error) {
        if (error.message === 'Quiz not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error("Error en startQuizByUuid:", error); // Es bueno loguear el error real
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const search = async (req, res) => {
    try {
        const query = req.query.q || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await quizService.searchQuizzes(query, page, limit);

        // Mapeamos solo la propiedad 'data' del resultado
        const mappedData = result.data.map(quiz => mappingQuizResponse(quiz));

        // Devolvemos el resultado con la data transformada
        return res.status(200).json({
            ...result,
            data: mappedData
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message // Útil para depurar
        });
    }
};


export const remove = async (req, res) => {
    try {
        await quizService.deleteQuiz(
            req.params.id
        );

        return res.status(200).json({
            message: 'Quiz deleted successfully'
        });

    } catch (error) {

        if (error.message === 'Quiz not found') {
            return res.status(404).json({
                message: error.message
            });
        }
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


export const getQuizEvaluation = async (req, res) => {
    try {
        const validation = submitQuizSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: validation.error.flatten()
            });
        }

        // Llamamos a getReview
        const result = await getReview(
            req.params.uuid,
            validation.data,
            req.user
        );

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error en evaluación:", error);

        // Si el error es el que lanzamos en el servicio
        if (error.message === "Quiz not found") {
            return res.status(404).json({ message: error.message });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const createFullQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const validatedData = quizSchema.parse(req.body);
        const { title, description, visibility, attemptsLimit, questions } = validatedData;

        const newQuiz = await quizService.createFullQuiz({
            title,
            description,
            visibility,
            attempts_limit: attemptsLimit,
            questions
        }, userId);

        res.status(201).json({
            message: "Quiz created successfully.",
            quiz: mappingQuizResponse(newQuiz)
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al crear el quiz completo: " + error.message
        });
    }
};