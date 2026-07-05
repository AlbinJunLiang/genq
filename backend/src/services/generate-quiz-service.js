import { generateCompletion } from "../completions/completion.js";
import { quizSchema } from "../schemas/quiz-schema.js";

const createSystemInstruction = (lang = "ESPAÑOL") => `
Eres un generador de quizzes experto. 
Tu salida DEBE ser un objeto JSON puro. 
Comienza tu respuesta con '{' y termínala con '}'. 
NO incluyas explicaciones, saludos ni markdown.

Idioma: ${lang}
Reglas:
1. Máximo 10 preguntas.
2. Cada pregunta con 2 o 5 respuestas.
3. 50% UNIQUE, 50% MULTIPLE.

Estructura requerida:
{
  "title": "...",
  "description": "...",
  "visibility": "PUBLIC",
  "attemptsLimit": 3,
  "questions": [ { "content": "...", "type": "...", "answers": [ { "content": "...", "isCorrect": boolean } ] } ]
}
`;

const safeParseJSON = (text) => {
    if (!text || typeof text !== "string") {
        return null;
    }

    try {
        return JSON.parse(
            text
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim()
        );
    } catch (err) {
        console.error("[JSON Parse Error]", err);
        return null;
    }
};

export const generateQuiz = async ({
    content,
    model,
    provider,
    language = "ESPAÑOL"
}) => {

    const rawResponse = await generateCompletion({
        content,
        context: "",
        instruction: createSystemInstruction(language),
        system: true,
        model,
        provider,
        isJson: true
    });

    const parsedResponse = safeParseJSON(rawResponse);

    if (!parsedResponse) {
        throw new Error("El modelo devolvió un JSON inválido.");
    }

    const validation = quizSchema.safeParse(parsedResponse);

    if (!validation.success) {
        console.error(validation.error.flatten());

        throw new Error(
            "La respuesta del modelo no cumple con el esquema del quiz."
        );
    }

    return validation.data;
};