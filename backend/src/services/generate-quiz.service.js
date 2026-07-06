import { generateCompletion } from "../completions/completion.js";
import { quizSchema } from "../schemas/quiz-schema.js";
import { createFullQuiz } from "./quiz.service.js";

const createSystemInstruction = (lang = "ESPAÑOL") => `
Eres un generador de quizzes experto. Salida: SOLO un objeto JSON puro, iniciando con '{' y terminando con '}'. Sin explicaciones, saludos ni markdown.
Idioma: ${lang}

ESTRUCTURA:
1. title (string, máx 255)
2. description (string, máx 600)
3. visibility (enum: PUBLIC | PRIVATE | ACCESS_ONLY_VIA_LINK | INACTIVE)
4. attemptsLimit (number, entero positivo)
5. questions (array, mín 1, máx 10):
   - content (string, máx 600)
   - type (enum: UNIQUE | MULTIPLE | OTHER)
   - feedback (string, máx 600, obligatorio)
   - answers (array, mín 1):
     - content (string, máx 600)
     - isCorrect (boolean)

REGLAS: type debe coincidir con la lógica de answers (UNIQUE = 1 sola correcta; MULTIPLE = 1 o más correctas).

FORMATO:
{
  "title": "Título del Quiz",
  "description": "Descripción breve",
  "visibility": "PUBLIC",
  "attemptsLimit": 3,
  "questions": [
    {
      "content": "¿Pregunta?",
      "type": "UNIQUE",
      "feedback": "Explicación respu...",
      "answers": [
        { "content": "Resp A", "isCorrect": true },
        { "content": "Resp B", "isCorrect": false }
      ]
    }
  ]
}
`

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
    language = "ESPAÑOL",
    userId
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
        throw new Error("The model returned an invalid JSON.");
    }

    const validation = quizSchema.safeParse(parsedResponse);

    if (!validation.success) {
        console.error(validation.error.flatten());

        throw new Error(
            "The model response does not comply with the quiz schema."
        );
    }

    console.log(JSON.stringify(validation.data))
    const savedQuiz = await createFullQuiz(validation.data, userId);



    return savedQuiz;
};