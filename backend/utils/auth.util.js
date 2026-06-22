/**
 * Extrae el token Bearer de las cabeceras de la petición HTTP.
 * @param {Object} req - Objeto de la petición de Express.
 * @returns {string|null} El token si existe, o null si no se proporciona.
 */
export const extractBearerToken = (req) => {
    const authHeader = req.headers['authorization'];
    return authHeader && authHeader.split(' ')[1] ? authHeader.split(' ')[1] : null;
};