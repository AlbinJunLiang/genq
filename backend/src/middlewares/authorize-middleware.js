import { policies } from "../policies/policies.js";

export const authorize = (policyName) => {
    return (req, res, next) => {
        const user = req.user;

        // 1. Prioriza el recurso cargado (el objeto completo)
        // 2. Si no, busca cualquier valor en req.params (no importa el nombre)
        const resource = req.resource || Object.values(req.params)[0] || null;

        if (policies[policyName](user, resource)) {
            return next();
        }

        res.status(403).json({
            error: "You do not meet the required attributes for this action."
        });
    };
};