import { generateQuiz } from "../services/generate-quiz-service.js";

export const completionController = async (req, res) => {
    try {

        const {
            content,
            provider,
            model,
            language = "ESPAÑOL"
        } = req.body;

        const quiz = await generateQuiz({
            content,
            provider,
            model,
            language
        });

        return res.status(201).json({
            message: "Quiz generado exitosamente.",
            quiz
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: error.message || "Error al generar el quiz."
        });

    }
};