export function mappingAnswerResponse(answer) {
    return {
        id: answer?.id,
        content: answer?.content,
        isCorrect: answer?.is_correct,
        questionId: answer?.question_id,
        status: answer?.status
    }
}


export const mappingAnswerResponse2 = (a) => {
    return {
        id: a.id,
        content: a.content,
        status: a.status,
        questionId: a.question_id
    };
};

