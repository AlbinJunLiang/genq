import { mappingAnswerResponse, mappingAnswerResponse2 } from "./answer-mapper.js";

export function mappingQuestionResponse(question) {
    return {
        id: question.id,
        content: question.content,
        type: question.type,
        feedback: question.feedback ?? '',
        quizId: question.quiz_id,
        status: question.status
    }
}

export const mappingQuestionWithOutFeedback = (q) => {
    return {
        id: q.id,
        content: q.content,
        type: q.type,
        status: q.status,
        quizId: q.quiz_id,
        answers: q.answers ? q.answers.map(mappingAnswerResponse2) : []
    };
};


export const mappingQuestionWithAllAnswers = (q) => {
    return {
        id: q.id,
        content: q.content,
        type: q.type,
        status: q.status,
        quizId: q.quiz_id,
        feedback: q?.feedback ?? '',
        answers: q.answers ? q.answers.map(mappingAnswerResponse) : []
    };
};

