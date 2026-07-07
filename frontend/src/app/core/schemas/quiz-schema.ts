import { z } from 'zod';
import { FullQuiz } from '../interfaces/quiz-interface';

const AnswerSchema = z.object({
    content: z.string().min(1).max(600),
    isCorrect: z.boolean()
});

const QuestionSchema = z.object({
    content: z.string().min(1).max(600),
    type: z.enum(['MULTIPLE', 'UNIQUE']),
    answers: z.array(AnswerSchema).min(1),
    feedback: z.string().min(0).max(600).optional().default(''),
});

export const QuizSchema = z.object({
    title: z.string().max(255),
    description: z.string().max(600).optional().default(''),
    visibility: z.enum(['PUBLIC', 'PRIVATE', 'ACCESS_ONLY_VIA_LINK', 'INACTIVE']),
    attemptsLimit: z.number().int().positive(),
    questions: z.array(QuestionSchema).min(1)
});


export function parseQuiz(json: string): FullQuiz {
    return QuizSchema.parse(JSON.parse(json));
}


