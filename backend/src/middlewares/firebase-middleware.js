import { getAuth } from "../config/firebase.js";

import { User } from "../models/user.model.js";


export const verifyFirebaseTokenAndUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token not provided." });
    }

    try {
        // 1. Verify the token with Firebase
        const decodedToken = await getAuth().verifyIdToken(token);

        // 2. Check if the email is verified
        if (!decodedToken.email_verified) {
            return res.status(403).json({
                error: "Email not verified.",
                message: "Please verify your email address in Firebase before accessing this resource."
            });
        }

        // 3. Find the user in your database
        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // 4. Inject the user into the request and proceed
        req.user = user;
        next();

    } catch (error) {
        console.error("Firebase technical error:", error.message);
        return res.status(401).json({
            error: "Invalid token.",
            message: error.message
        });
    }
};


export const verifyFirebaseToken = async (req, res, next) => {
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