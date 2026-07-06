import Model from '../models/model.models.js';

/**
 * Crea un nuevo registro.
 * @param {{ model?: string, provider: string }} data
 */
export const createModel = async (data) => {
    try {
        const newModel = await Model.create(data);
        return newModel;
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new Error("Ya existe un registro con ese model y provider.");
        }
        throw error;
    }
};

/**
 * Lista todos los registros. Admite filtros opcionales por provider/model.
 * @param {{ model?: string, provider?: string }} filters
 */
export const getModels = async (filters = {}) => {
    const where = {};
    if (filters.model) where.model = filters.model;
    if (filters.provider) where.provider = filters.provider;

    return await Model.findAll({ where, order: [["createdAt", "DESC"]] });
};

/**
 * Obtiene un registro por su id.
 * @param {number} id
 */
export const getModelById = async (id) => {
    const found = await Model.findByPk(id);
    if (!found) throw new Error("Registro no encontrado.");
    return found;
};

/**
 * Edita un registro existente.
 * @param {number} id
 * @param {{ model?: string, provider?: string }} data
 */
export const updateModel = async (id, data) => {
    const found = await Model.findByPk(id);
    if (!found) throw new Error("Registro no encontrado.");

    try {
        await found.update(data);
        return found;
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new Error("Ya existe un registro con ese model y provider.");
        }
        throw error;
    }
};

/**
 * Elimina un registro por su id.
 * @param {number} id
 */
export const deleteModel = async (id) => {
    const found = await Model.findByPk(id);
    if (!found) throw new Error("Registro no encontrado.");

    await found.destroy();
    return { message: "Registro eliminado correctamente." };
};