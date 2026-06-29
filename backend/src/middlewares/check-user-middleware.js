import { getAuth } from "../config/firebase.js";
import { User } from "../models/user.model.js";

export const checkUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    // Si no hay token, simplemente no hacemos nada y dejamos pasar al usuario
    if (!token) return next();

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        // Intentamos buscar al usuario, si falla no pasa nada, simplemente sigue
        req.user = await User.findOne({ where: { email: decodedToken.email } });
    } catch (error) {
        console.log("Token inválido o expirado, tratando como invitado");
    }

    next(); // ¡IMPORTANTE! Siempre llamamos a next
};