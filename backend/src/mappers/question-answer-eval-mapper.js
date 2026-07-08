// mappers/question.mapper.js
export const mappingQuestionAndAnswerEvaluation = (question) => (
    {
    id: question.id,
    content: question.content,
    feedback: question.feedback,
    type: question.type,
    answers: question.answers.map(answer => ({
        id: answer.id,
        content: answer.content,
        isCorrect: answer.is_correct,
        status: answer.status,
    }))
});