import { mappingQuestionAndAnswerEvaluation } from "../mappers/question-answer-eval-mapper.js";
import Answer from "../models/answer.model.js";
import Question from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";


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
                        required: true, // Solo preguntas con respuestas
                    }
                ]
            }
        ]
    });

    return (quizAnswersData?.questions).map(mappingQuestionAndAnswerEvaluation) ?? [];
};



function evaluate(questions, quizAttempData) {
    let score = 0;
    let review = [];

    for (const submitted of quizAttempData.answers) {
        const question = questions.find(
            q => q.id === submitted.questionId
        );

        if (!question) continue;

        const correctIds = question.answers
            .filter(a => a.isCorrect)
            .map(a => a.id);

        const submittedIds = submitted.answerIds;

        const correctSet = new Set(correctIds);
        const submittedSet = new Set(submittedIds);

        const isCorrect =
            correctSet.size === submittedSet.size &&
            [...correctSet].every(id => submittedSet.has(id));

        if (isCorrect) {
            console.log(question.answers)
            score += 1;
        }
        review.push({ questionId: question.id, answers: question.answers, feedback: question.feedback });

    }

    return {
        score,
        totalQuestions: questions.length,
        percentage:
            questions.length > 0
                ? Number(((score / questions.length) * 100).toFixed(2))
                : 0, review
    };
}



export const getReview = async (uuid, quizAttempData) => {
    const quizAnswerData = await getQuizAnswersData(uuid);
    return evaluate(quizAnswerData, quizAttempData);
};