import { mappingAnswerResponse } from '../mappers/answer-mapper.js';
import * as answerService from '../services/answer.service.js';

export const create = async (req, res) => {
    try {
        const { content, isCorrect, status, questionId } = req.body;

        const answer = await answerService.createAnswer(
            {
                content,
                status,
                is_correct: isCorrect,
                question_id: questionId
            });
        res.status(201).json(mappingAnswerResponse(answer));
    } catch (error) {
        res.status(500).json({ message: 'Error creating answer', error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { content, isCorrect, status } = req.body;

        const answer = await answerService.updateAnswer(req.params.answerId, {
            content,
            status,
            is_correct: isCorrect
        });
        res.status(200).json(mappingAnswerResponse(answer));
    } catch (error) {
        res.status(500).json({ message: 'Error updating answer', error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        await answerService.deleteAnswer(req.params.answerId);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(500).json({ message: 'Error deleting answer', error: error.message });
    }
};