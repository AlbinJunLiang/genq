import { mappingQuestionResponse, mappingQuestionWithAllAnswers } from '../mappers/question-mapper.js';
import { mapQuizWithQuestionAndAnswers } from '../mappers/quiz-mapper.js';
import * as questionService from '../services/question.service.js';

export const create = async (req, res) => {
    try {
        const { content, type, quizId, feedback } = req.body;

        const question = await questionService.createQuestion({
            content,
            feedback,
            type,
            quiz_id: quizId
        });
        res.status(201).json(mappingQuestionResponse(question));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const listByQuiz = async (req, res) => {
    try {
        const questions = await questionService.getQuestionsByQuiz(req.params.quizId);
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const question = await questionService.updateQuestion(req.params.questionId, req.body);
        res.status(200).json(mappingQuestionResponse(question));
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        await questionService.deleteQuestion(req.params.questionId);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getAnswersByQuizId = async (req, res) => {
    try {
        const { quizId } = req.params;
        const questions = await questionService.getQuestionsAndAnswersByQuizId(quizId, true);

        return res.status(200).json({ questions: questions.map(mappingQuestionWithAllAnswers) });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error retrieving questions' });
    }
};