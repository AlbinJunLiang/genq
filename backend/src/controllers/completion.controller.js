import { generateQuiz } from "../services/generate-quiz.service.js";


export const generateQuizController = async (req, res) => {
    try {

        const {
            content,
            provider,
            model,
            language = "ESPAÑOL"
        } = req.body;

        const userId = req.user.id;


        const quiz = await generateQuiz({
            content,
            provider,
            model,
            language,
            userId
        });

        return res.status(201).json({
            message: "Quiz generated successfully.",
            quiz
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: error.message || "Error generating the quiz."
        });

    }
};