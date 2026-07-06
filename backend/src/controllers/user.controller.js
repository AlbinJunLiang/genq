import { extractBearerToken } from '../../utils/auth.util.js';
import { mappingUserResponse } from '../mappers/user-mapper.js';
import * as userService from '../services/user.service.js';


export const register = async (req, res) => {
    try {
        const token = extractBearerToken(req);
        if (!token) return res.status(401).json({ error: "Token not provided." });

        const { result, isCreated } = await userService.registerUser(token);

        if (isCreated) {
            return res.status(201).json({
                message: "User created successfully.",
                user: mappingUserResponse(result)
            });
        } else {
            return res.status(200).json({
                message: "The user is already synchronized.",
                user: mappingUserResponse(result)
            });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


export const update = async (req, res) => {
    try {
        const { email } = req.params;
        const { name, lastName, role } = req.body;

        const updatedUser = await userService.updateUser(email, { name, lastName, role });

        return res.status(200).json({
            message: 'User updated successfully.',
            data: updatedUser
        });
    } catch (error) {
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
    }
};


export const findByEmail = async (req, res) => {
    try {

        const { email } = req.params;
        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ data: user, message: "User found successfully.", });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const updateNames = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, lastName } = req.body;

        const updatedUser = await userService.updateUserNameAndLastName(id, { name, lastName });

        return res.status(200).json({
            message: "User updated successfully.",
            data: updatedUser
        });
    } catch (error) {
        if (error.message === "User not found.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
    }
};


export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const result = await userService.getUsers(page, limit);

        return res.status(200).json({
            message: "Users retrieved successfully",
            meta: {
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                currentPage: result.currentPage
            },
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await userService.deleteUser(id);

        // En Sequelize, .destroy() retorna el número de filas eliminadas
        if (deleted === 0) {
            return res.status(404).json({
                error: "User not found."
            });
        }

        return res.status(200).json({
            message: "User deleted successfully."
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while deleting the user."
        });
    }
};