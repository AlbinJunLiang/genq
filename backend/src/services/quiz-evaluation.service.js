import { mappingQuestionAndAnswerEvaluation } from "../mappers/question-answer-eval-mapper.js";
import Answer from "../models/answer.model.js";
import Question from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";
import { finishAttempt } from "./attempt.service.js";


export const getQuizAnswersData = async (uuid) => {
    const quizAnswersData = await Quiz.findOne({
        where: { uuid },
        include: [
            {
                model: Question,
                as: 'questions',
                include: [
                    {
                        model: Answer,
                        as: 'answers',
                        required: true,
                    }
                ]
            }
        ]
    });

    return (quizAnswersData?.questions).map(mappingQuestionAndAnswerEvaluation) ?? [];
};


function evaluate(questions, quizAttempData) {
    let totalScore = 0;
    let review = [];

    for (const submitted of quizAttempData.answers) {
        const question = questions.find(q => q.id === submitted.questionId);
        if (!question) continue;

        const correctAnswers = question.answers.filter(a => a.isCorrect);
        const submittedIds = submitted.answerIds;

        let questionScore = 0;

        if (question.type === 'UNIQUE') {
            const isCorrect = submittedIds.length === 1 &&
                correctAnswers.some(a => a.id === submittedIds[0]);
            questionScore = isCorrect ? 1 : 0;
        } else {
            const correctIds = correctAnswers.map(a => a.id);
            const hits = submittedIds.filter(id => correctIds.includes(id)).length;
            const misses = submittedIds.filter(id => !correctIds.includes(id)).length;

            // Calculamos puntaje: (Aciertos - Errores) / Total de correctas
            const points = (hits - misses) / correctIds.length;
            questionScore = Math.max(0, points);
        }

        totalScore += questionScore;

        const answersWithSelection = question.answers.map(ans => ({
            ...ans,
            isSelected: submittedIds.includes(ans.id)
        }));

        // Añadimos el puntaje individual aquí
        review.push({
            questionId: question.id,
            score: Number(questionScore.toFixed(2)), // <--- Puntaje por pregunta
            answers: answersWithSelection,
            content: question.content,
            type: question.type,
            feedback: question.feedback
        });
    }

    return {
        score: Number(totalScore.toFixed(2)),
        totalQuestions: questions.length,
        percentage: questions.length > 0
            ? Number(((totalScore / questions.length) * 100).toFixed(2))
            : 0,
        review
    };
}



export const getReview = async (uuid, quizAttempData, user) => {
    // 1. Obtener respuestas correctas de la BD
    const quizAnswerData = await getQuizAnswersData(uuid);
    if (!quizAnswerData) throw new Error("Quiz not found"); // Manejo para el catch

    // 2. Evaluar
    const review = evaluate(quizAnswerData, quizAttempData);

    // 3. Persistir si es un usuario registrado
    if (user) {
        await finishAttempt(quizAttempData.attemptUuid, {
            content: review, // Sequelize guardará esto en el campo JSON
            score: review.percentage,
            duration: quizAttempData.duration || 0
        });
    }

    return review;
};