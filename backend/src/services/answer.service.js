import Answer from '../models/answer.model.js';

export const createAnswer = async (data) => {
    return await Answer.create(data);
};
export const updateAnswer = async (id, data) => {
    const [updatedRowsCount] = await Answer.update(data, {
        where: { id }
    });

    if (updatedRowsCount === 0) return null;
    return await Answer.findByPk(id);
};


export const deleteAnswer = async (id) => {
    return await Answer.destroy({ where: { id } });
};