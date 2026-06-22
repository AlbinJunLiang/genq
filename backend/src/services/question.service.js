import Answer from "../models/answer.model.js";
import Question from "../models/question.model.js";

export const createQuestion = async (questionData) => {

    return await Question.create(questionData);
};

export const getQuestionsByQuiz = async (quizId) => {
    return await Question.findAll({ where: { quiz_id: quizId } });
};

export const updateQuestion = async (id, data) => {
    const question = await Question.findByPk(id);
    if (!question) throw new Error('Question not found');
    return await question.update(data);
};

export const deleteQuestion = async (id) => {
    const question = await Question.findByPk(id);
    if (!question) throw new Error('Question not found');
    return await question.destroy();
};


export const getQuestionsAndAnswersByQuizId = async (quizId, showAnswers = false) => {
    return await Question.findAll({
        where: { quiz_id: quizId }, // Filtramos directo por ID
        attributes: showAnswers
            ? { exclude: [] }
            : { exclude: ['feedback'] },

        include: [{
            model: Answer,
            as: 'answers',
            attributes: showAnswers
                ? { exclude: [] }
                : { exclude: ['is_correct'] }
        }]
    });
};