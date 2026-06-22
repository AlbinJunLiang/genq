import { getAuth } from "../config/firebase.js";

import { User } from "../models/user.model.js";

export const verifyFirebaseTokenAndUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Token not provided." });

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) return res.status(404).json({ error: "User not found." });

        req.user = user; // Inyectamos el usuario completo
        next();
    } catch (error) {
        console.error("Error técnico de Firebase:", error.message);
        return res.status(401).json({
            error: "Invalid token.",
            message: error.message
        });
    }
};


export const verifyFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Token not provided."
        });
    }

    try {
        const decodedToken = await getAuth().verifyIdToken(token);

        req.user = decodedToken;

        next();

    } catch (error) {
        console.error("Firebase error:", error.message);

        return res.status(401).json({
            error: "Invalid token.",
            message: error.message
        });
    }
};