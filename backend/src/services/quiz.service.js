import { Op } from 'sequelize';
import { QuizzesType } from '../consts/quiz.js';
import { Quiz, sequelize } from '../models/quiz.model.js';
import Question from '../models/question.model.js';
import Answer from '../models/answer.model.js';
import { mappingQuestionAndAnswerEvaluation } from '../mappers/question-answer-eval-mapper.js';
import { createAttempt } from './attempt.service.js';
import { shuffleArray } from '../../utils/shuffle.js';

/**
 * const fechaLocal = new Date(); // Esta es tu fecha en Costa Rica
const fechaParaBaseDeDatos = fechaLocal.toISOString(); 

console.log("Local:", fechaLocal.toString());
console.log("UTC (para guardar):", fechaParaBaseDeDatos);
 * 
 * @param {*} quizData 
 * @param {*} userId 
 * @returns 
 */
export const createQuiz = async (quizData, userId) => {
    if (quizData.endAt) {
        const endDate = new Date(quizData.endAt);
        const now = new Date();

        // 1. Validar si la fecha es real
        if (isNaN(endDate.getTime())) {
            const error = new Error('QUIZ_DATE_INVALID_FORMAT');
            error.statusCode = 400;
            throw error;
        }

        // 2. Comparar usando milisegundos (getTime())
        // Esto ignora las diferencias de formato y compara números puros
        if (endDate.getTime() < now.getTime()) {
            const error = new Error('QUIZ_DATE_MUST_BE_FUTURE');
            error.statusCode = 400;
            throw error;
        }
    }

    const endAtUTC = quizData.endAt ? new Date(quizData.endAt).toISOString() : null;
    const newQuiz = await Quiz.create({
        title: quizData.title,
        description: quizData.description || '',
        visibility: quizData.visibility || 'PUBLIC',
        end_at: endAtUTC,
        duration_seconds: quizData.durationSeconds,
        attempts_limit: quizData.attemptsLimit || 1,
        user_id: userId
    });

    return newQuiz;
};

export const updateQuiz = async (quizId, quizData) => {
    const quiz = await Quiz.findByPk(quizId);

    if (!quiz) {
        const error = new Error('Quiz not found');
        error.status = 404;
        throw error;
    }

    // Validación de fecha: Solo si se intenta actualizar endAt
    if (quizData.endAt) {
        const newEndDate = new Date(quizData.endAt);
        const now = new Date();

        if (newEndDate <= now) {
            const error = new Error('QUIZ_DATE_MUST_BE_FUTURE');
            error.status = 400; // Bad Request
            throw error;
        }
    }

    // Actualizamos. Nota: .toISOString() asegura que siempre sea UTC
    await quiz.update({
        title: quizData.title,
        description: quizData.description,
        visibility: quizData.visibility,
        end_at: quizData.endAt ? new Date(quizData.endAt).toISOString() : quiz.end_at,
        duration_seconds: quizData.durationSeconds,
        attempts_limit: quizData.attemptsLimit
    });

    return quiz;
};



export const getQuizzesPaginated = async (
    page = 1,
    limit = 10,
    filters = {} // Renombrado de 'where' a 'filters' para mayor claridad
) => {
    const offset = (page - 1) * limit;

    // Construimos el objeto where dinámicamente
    const whereConditions = { ...filters };

    // Si quieres asegurar que visibility esté presente si se envía:
    if (filters.visibility) {
        whereConditions.visibility = filters.visibility;
    }

    const { count, rows } = await Quiz.findAndCountAll({
        where: whereConditions,
        limit,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        data: rows,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        }
    };
};



export const getQuizByUuid = async (
    uuid,
    visibilities = ['PUBLIC', 'ACCESS_ONLY_VIA_LINK']
) => {
    const quiz = await Quiz.findOne({
        where: {
            uuid,
            visibility: {
                [Op.in]: visibilities
            }
        }
    });

    if (!quiz) {
        throw new Error('Quiz not found');
    }

    return quiz;
};


export const searchQuizzes = async (search, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    if (!search?.trim()) {
        return { data: [], pagination: { total: 0, page, limit, totalPages: 0 } };
    }

    // El secreto está aquí:
    const { count, rows } = await Quiz.findAndCountAll({
        distinct: true, // <--- ESTO ES LO QUE ELIMINA EL DUPLICADO
        col: 'id',      // <--- Le indicas explícitamente que cuente sobre la PK
        where: {
            visibility: 'PUBLIC',
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { uuid: { [Op.like]: `%${search}%` } }
            ]
        },
        limit,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        data: rows,
        pagination: {
            total: count, // Ahora el count será exacto
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        }
    };
};


export const deleteQuiz = async (quizId) => {
    const quiz = await Quiz.findOne({
        where: {
            id: quizId
        }
    });

    if (!quiz) {
        throw new Error('Quiz not found');
    }

    await quiz.destroy();

    return true;
};






export const startQuizByUuid = async (uuid, showAnswers = false, user = null) => {
    // 1. Obtención del Quiz
    const quiz = await Quiz.findOne({
        where: { uuid },
        include: [{
            model: Question,
            as: 'questions',
            attributes: showAnswers ? { exclude: [] } : { exclude: ['feedback'] },
            include: [{
                model: Answer,
                as: 'answers',
                attributes: showAnswers ? { exclude: [] } : { exclude: ['is_correct'] }
            }]
        }]
    });

    if (!quiz) throw new Error("Quiz no encontrado");

    // 2. Si 'user' existe, usamos user.id; si no (invitado), usamos null.
    const userId = user ? user.id : null;
    const attempt = await createAttempt({ quiz_id: quiz.id, user_id: userId });

    // 3. Transformación y Mezclado
    const quizData = quiz.toJSON();
    if (quizData.questions) {
        quizData.questions = shuffleArray(quizData.questions);
    }

    return {
        quiz: quizData,
        attemptUuid: attempt.uuid
    };
};



export const createFullQuiz = async (quizData, userId) => {
    // Iniciamos la transacción
    const t = await sequelize.transaction();

    try {
        // 1. Crear el Quiz
        const quiz = await Quiz.create({
            title: quizData.title,
            description: quizData.description || '',
            user_id: userId,
            visibility: quizData.visibility || 'PUBLIC',
            attempts_limit: quizData.attemptsLimit || 0
        }, { transaction: t });

        // 2. Preparar preguntas (Mapeo explícito)
        const questionsToInsert = quizData.questions.map(q => ({
            content: q.content,
            type: q.type,
            feedback: q.feedback || '', // Asegurado
            quiz_id: quiz.id
        }));

        // Crear preguntas en lote
        const createdQuestions = await Question.bulkCreate(questionsToInsert, { transaction: t });

        // 3. Preparar respuestas (Mapeo explícito)
        // 3. Preparar respuestas (Mapeo explícito y barajeo)
        const answersToInsert = [];
        createdQuestions.forEach((q, index) => {
            const originalQ = quizData.questions[index];
            if (originalQ.answers) {
                // Barajamos aquí las respuestas antes de agregarlas al array de inserción
                const shuffledAnswers = shuffleArray(originalQ.answers);

                shuffledAnswers.forEach(a => {
                    answersToInsert.push({
                        content: a.content,
                        is_correct: a.isCorrect, // Asegúrate de que coincida con tu BD
                        question_id: q.id
                    });
                });
            }
        });

        await Answer.bulkCreate(answersToInsert, { transaction: t });

        // Crear respuestas en lote

        // Commit si todo salió bien
        await t.commit();
        return quiz;

    } catch (error) {
        // Rollback en caso de error
        await t.rollback();
        console.error("Error al crear el quiz:", error);
        throw error;
    }
};