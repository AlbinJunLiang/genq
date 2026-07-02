import { z } from 'zod';

export const answerSchema = z.object({
    content: z.string().min(1).max(600),
    isCorrect: z.boolean()
});

