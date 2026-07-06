import {
    createModel,
    getModels,
    getModelById,
    updateModel,
    deleteModel,
} from "../services/model.service.js";

export const create = async (req, res) => {
    try {
        const { model, provider } = req.body;

        if (!provider) {
            return res.status(400).json({ message: "El campo 'provider' es requerido." });
        }

        const newModel = await createModel({ model, provider });
        return res.status(201).json(newModel);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const list = async (req, res) => {
    try {
        const { model, provider } = req.query;
        const models = await getModels({ model, provider });
        return res.status(200).json(models);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const found = await getModelById(id);
        return res.status(200).json(found);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { model, provider } = req.body;
        const updated = await updateModel(id, { model, provider });
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteModel(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};