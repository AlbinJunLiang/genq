


export function mappingAttemptResponse(attempt) {
    console.log(attempt)
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
        quizAttemptedContent: attempt.quiz_attempted_content,
        quizTitle: attempt.quiz?.title || 'Untitled Quiz'
    }
}