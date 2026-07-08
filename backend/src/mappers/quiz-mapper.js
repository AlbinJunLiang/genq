import { mappingQuestionWithAllAnswers, mappingQuestionWithOutFeedback } from "./question-mapper.js";

export function mappingQuizResponse(user) {
    return {
        uuid: user.uuid,
        id: user.id,
        title: user.title,
        description: user.description,
        visibility: user.visibility,
        endAt: user.end_at,          
        durationSeconds: user.duration_seconds,
        attemptsLimit: user.attempts_limit,    
        userId: user.user_id,          
        createdAt: user.created_at
    }
}

export const mapQuizWithQuestion = (quiz) => {
    return {
        id: quiz.id,
        uuid: quiz.uuid,
        title: quiz.title,
        description: quiz.description,
        visibility: quiz.visibility,
        endAt: quiz.end_at,
        durationSeconds: quiz.duration_seconds,
        attemptsLimit: quiz.attempts_limit,
        userId: quiz.user_id,
        createdAt: quiz.created_at,
        questions: quiz.questions ? quiz.questions.map(mappingQuestionWithOutFeedback) : []
    };
};


export const mapQuizWithQuestionAndAnswers = (quiz) => {
    return {
        id: quiz.id,
        uuid: quiz.uuid,
        title: quiz.title,
        description: quiz.description,
        visibility: quiz.visibility,
        endAt: quiz.end_at,
        durationSeconds: quiz.duration_seconds,
        attemptsLimit: quiz.attempts_limit,
        userId: quiz.user_id,
        createdAt: quiz.created_at,
        questions: quiz.questions ? quiz.questions.map(mappingQuestionWithAllAnswers) : []
    };
};

