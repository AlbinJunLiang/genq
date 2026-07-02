import z from "zod";
import { questionSchema } from "./question-schema.js";

// Esquema Principal del Quiz
export const quizSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(600).optional().default(''),
    visibility: z.enum(['PUBLIC', 'PRIVATE', 'ACCESS_ONLY_VIA_LINK', 'INACTIVE']),
    attemptsLimit: z.number().int().min(0).default(0),
    questions: z.array(questionSchema).min(1, "El quiz debe tener al menos una pregunta")
});