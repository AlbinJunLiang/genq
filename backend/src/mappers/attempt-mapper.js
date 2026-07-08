export function mappingAttemptResponse(attempt) {
    return {
        id: attempt.id,
        uuid: attempt.uuid,
        durationSeconds: attempt.duration_seconds,
        status: attempt.status,
        finishedAt: attempt.finished_at,
        userId: attempt.user_id,
        quizId: attempt.quiz_id,
        score: attempt.score,
        createdAt: attempt.created_at,
        quizTitle: attempt.quiz?.title || 'Untitled Quiz',
        quizDescription: attempt.quiz?.description || 'Description',
        quizUuid : attempt.quiz?.uuid,
        quizAttemptedContent: attempt.quiz_attempted_content
    }
}


export function mappingAttemptResponse2(attempt) {
    return {
        id: attempt.id,
        uuid: attempt.uuid,
        durationSeconds: attempt.duration_seconds,
        status: attempt.status,
        finishedAt: attempt.finished_at,
        userId: attempt.user_id,
        quizId: attempt.quiz_id,
        score: attempt.score,
        createdAt: attempt.created_at,
        quizTitle: attempt.quiz?.title || 'Untitled Quiz',
        email: attempt.user?.email || ''
    }
}