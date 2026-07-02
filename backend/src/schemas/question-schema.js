import z from "zod";
import { answerSchema } from "./answer-schema.js";

// Esquema de Pregunta
export const questionSchema = z.object({
    content: z.string().min(1).max(600),
    type: z.enum(['UNIQUE', 'MULTIPLE', 'OTHER']),
    answers: z.array(answerSchema).min(1, "Debe haber al menos una respuesta")
});
