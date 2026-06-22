const isQuestionOwner = (user, answer) => {

    if (user.role === 'ADMIN') return true;
    const quiz = answer.question?.quiz;
    const quizOwnerId = quiz?.user_id || quiz?.dataValues?.user_id;
    const userId = user.id || user.dataValues?.id;
    return Number(userId) === Number(quizOwnerId);
};

export const policies = {

    onlyAdmin: (user) => {
        if (user.role === 'ADMIN') return true;
        return false;
    },

    canDeleteQuiz: (user, quiz) => {
        if (user.role === 'ADMIN') return true;
        // Regla 2: El dueño puede borrar solo si no ha sido publicado
        if (quiz.user_id === user.id) return true;

        return false;
    },

    canUpdateQuiz: (user, quiz) => {
        if (user.role === 'ADMIN') return true;
        if (quiz.user_id === user.id) return true;
        return false;
    },
    canReadQuiz: (user, quiz) => {
        if (user.role === 'ADMIN') return true;
        if (quiz.user_id === user.id) return true;
        return false;
    },

    canUpdateNames: (user, editUserId) => {
        // Regla 1: Un ADMIN puede editar cualquier usuario
        if (user.role === 'ADMIN') return true;

        return String(user.id) === String(editUserId);
    },

    canCreateQuestion: (user, quiz) => {
        if (user.role === 'ADMIN') return true;

        if (quiz.user_id === user.id) return true;

        return false;
    },
    canReadQuestion: (user, quiz) => {
        if (user.role === 'ADMIN') return true;

        if (quiz.user_id === user.id) return true;

        return false;
    },
    canUpdateOrDeleteQuestion: (user, question) => {
        if (user.role === 'ADMIN') return true;
        if (question.quiz && question.quiz.user_id === user.id) {
            return true;
        }

        return false;
    },
    // ... otras políticas

    canCreateAnswer: (user, question) => {
        if (user.role === 'ADMIN') return true;
        const quiz = question?.quiz;
        const quizOwnerId = quiz?.user_id || quiz?.dataValues?.user_id;
        const userId = user.id || user.dataValues?.id;
        return Number(userId) === Number(quizOwnerId);
    },
    canUpdateAnswer: (user, answer) => isQuestionOwner(user, answer),
    canDeleteAnswer: (user, answer) => isQuestionOwner(user, answer)

};
