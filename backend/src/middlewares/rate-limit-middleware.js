import rateLimit from "express-rate-limit";

export const initRateLimit = (minutes, max) => rateLimit({
    windowMs: minutes * 60 * 1000,
    max: max,
    handler: (req, res, next, options) => {
        const resetTime = Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000 / 60;

        res.status(429).json({
            message: "Too many requests",
            maxAttempts: options.max,
            retryAfter: `${Math.ceil(resetTime)} minutes`,
            resetTime,
            error: "Rate limit exceeded"
        });
    }
});

const baseRateLimitOptions = (minutes, max) => ({
    windowMs: minutes * 60 * 1000,
    max: max,
    skip: (req) => {
        return req.user?.role === 'ADMIN';
    },
    handler: (req, res, next, options) => {
        const resetTime = Math.ceil(
            (req.rateLimit.resetTime - Date.now()) / 1000 / 60
        );

        res.status(429).json({
            message: "Too many requests",
            maxAttempts: options.max,
            retryAfter: `${Math.ceil(resetTime)} minutes`,
            resetTime,
            error: "Rate limit exceeded"
        });
    }
});

export const rateLimitWithAdminExclusion = (minutes, max) =>
    rateLimit(baseRateLimitOptions(minutes, max));