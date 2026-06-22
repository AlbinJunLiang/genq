
import { getAuth } from 'firebase-admin/auth';
import { User, sequelize } from '../models/user.model.js';


export const createUser = async (data) => await User.create(data);


export const getUserById = async (id) => await User.findByPk(id);


export const updateUser = async (id, { name, lastName, role }) => {
    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error('User not found.');
        error.status = 404;
        throw error;
    }

    await user.update({
        ...(name !== undefined && { name }),
        ...(lastName !== undefined && { last_name: lastName }),
        ...(role !== undefined && { role }),
    });

    return user;
};

export const deleteUser = async (id) => await User.destroy({ where: { id } });

/**
 * Busca un usuario en la base de datos por su email.
 * @param {string} email 
 * @returns {Promise<User|null>}
 */
export const findUserByEmail = async (email) => {
    if (!email) return null;

    return await User.findOne({
        where: {
            email: email.toLowerCase().trim()
        }
    });
};


export const registerUser = async (token) => {
    const auth = getAuth();
    
    // 1. Verificación del token y extracción de datos
    const decodedToken = await auth.verifyIdToken(token);
    const userData = {
        auth_id: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || ''
    };

    if (!userData.email || !userData.auth_id) {
        throw new Error("Invalid Firebase token (missing email or uid).");
    }

    // 2. Lógica de verificación/asignación de rol en Firebase (Independiente de la DB)
    const firebaseUser = await auth.getUser(userData.auth_id);
    const currentClaims = firebaseUser.customClaims || {};

    if (!currentClaims.role) {
        await auth.setCustomUserClaims(userData.auth_id, { 
            ...currentClaims, 
            role: "USER" 
        });
    }

    const _transaction = await sequelize.transaction();

    try {
        // 3. Buscar si el usuario ya existe en tu DB
        const existingUser = await User.findOne({
            where: { email: userData.email },
            transaction: _transaction
        });

        if (existingUser) {
            await _transaction.rollback();
            return { result: existingUser, isCreated: false };
        }

        // 4. Crear usuario en la DB
        const newUser = await User.create(userData, { transaction: _transaction });

        await _transaction.commit();
        return { result: newUser, isCreated: true };

    } catch (error) {
        await _transaction.rollback();
        console.error("Error en el registro del usuario:", error);
        throw error;
    }
};

/**
 * Actualiza el nombre y apellido de un usuario existente.
 * @param {number|string} id - ID del usuario en tu base de datos.
 * @param {Object} data - Objeto con los nuevos datos { name, last_name }.
 * @returns {Promise<Object>} El usuario actualizado.
 */
export const updateUserNameAndLastName = async (id, { name, lastName }) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw new Error("User not found.");
    }

    user.name = name || user.name;
    user.last_name = lastName || user.last_name;

    await user.save();

    return user;
};


/**
 * Obtiene usuarios con paginación.
 * @param {number} page - Número de página actual (base 1).
 * @param {number} limit - Cantidad de registros por página.
 */
export const getUsers = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    // findAndCountAll devuelve tanto los registros como el total de la tabla
    const { count, rows } = await User.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']] // Ordena por los más recientes
    });

    return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        data: rows
    };
};

