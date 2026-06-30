import { deleteAttempt, getUserAttemptsPaginated } from "../services/attempt.service.js";

export const getMyAttempts = async (req, res) => {
    try {
        // Obtenemos el ID del usuario desde el token (req.user)
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const result = await getUserAttemptsPaginated(userId, page, limit);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteAttemptController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await deleteAttempt(id, userId);

        res.status(200).json({
            message: "Attempt deleted successfully"
        });
    } catch (error) {
        // Usamos un error 404 para "Not Found" y 403 para "Unauthorized"
        if (error.message === "ATTEMPT_NOT_FOUND_OR_UNAUTHORIZED") {
            return res.status(404).json({
                error: "Attempt not found or unauthorized"
            });
        }

        // Log para el servidor (siempre en inglés para logs)
        console.error(`Error deleting attempt ${req.params.id}:`, error.message);

        res.status(500).json({
            error: "Internal server error"
        });
    }
};