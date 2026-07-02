import { generateCompletion } from "../completions/completion.js";

export const completionController = async (req, res) => {
    try {
        const {
            content,
            instruction,
            context,
            system,
            model,
            isJson,
            provider
        } = req.body;

        // 1. Validación básica de campos obligatorios
        if (!content || !provider) {
            return res.status(400).json({
                error: "Los campos 'content' y 'provider' son obligatorios."
            });
        }
const systemInstruction = `Actúa como un experto en creación de contenido educativo. 
Genera un JSON estrictamente válido que represente un quiz basado en el tema indicado.
Reglas:
1. Estructura obligatoria: {"title": "string", "description": "string", "visibility": "PUBLIC", "attemptsLimit": 3, "questions": [{"content": "string", "type": "UNIQUE" | "MULTIPLE", "answers": [{"content": "string", "isCorrect": boolean}]}]}.
2. Máximo 10 preguntas.
3. Mínimo 3 opciones por pregunta.
4. 50% de preguntas UNIQUE y 50% MULTIPLE.
5. Devuelve únicamente el objeto JSON, sin explicaciones ni markdown.`;
        // 2. Ejecutar el servicio centralizado
        const response = await generateCompletion({
            content,
            instruction: systemInstruction || '',
            context: context || '',
            system: system !== undefined ? system : true,
            model,
            isJson: isJson || false,
            provider
        });

        // 3. Responder al usuario
        // Si isJson es true, podrías querer parsear el resultado si es string
        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        // Log detallado para el servidor
        console.error("Error en completionController:", error);

        // Manejo de errores específicos
        if (error.message === "Provider not supported.") {
            return res.status(422).json({ error: error.message });
        }

        return res.status(500).json({
            error: "Error interno al generar la respuesta de la IA.",
            details: error.message
        });
    }
};