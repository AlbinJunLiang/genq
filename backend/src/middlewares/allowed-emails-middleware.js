import { env } from "../config/env.js";

const allowedEmails =
    env.ADMIN_EMAILS
        ?.split(",")
        .map(e => e.trim().toLowerCase()) || [];


export const allowOnlyEmails = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Auth required"
        });
    }

    const email = req.user.email?.toLowerCase();

    if (!allowedEmails.includes(email)) {
        return res.status(403).json({
            message: "Access denied"
        });
    }
    next();
};