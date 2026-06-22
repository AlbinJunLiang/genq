import { generateRandomString, getRandomInt } from "../../../shared/util/random-string";
import { User } from "../../interfaces/user-interface";

export const MOCK_USERS: User[] = [
    {
        id: getRandomInt(100, 1000),
        authId: generateRandomString(12),
        name: 'Luis',
        lastName: 'ALVARADO',
        email: 'Luis123@gmail.com',
        status: 'ACTIVE',
        role: 'user'
    },
    {
        id: getRandomInt(100, 1000),
        authId: generateRandomString(12),
        name: 'María',
        email: 'maria.gomez@gmail.com',
        status: 'ACTIVE',
        role: 'admin'
    },
    {
        id: getRandomInt(100, 1000),
        authId: generateRandomString(12),
        name: 'Carlos',
        email: 'carlos.rojas@gmail.com',
        status: 'INACTIVE',
        role: 'user'
    },
    {
        id: getRandomInt(100, 1000),
        authId: generateRandomString(12),
        name: 'Ana',
        email: 'ana.mora@gmail.com',
        status: 'ACTIVE',
        role: 'user'
    },
    {
        id: getRandomInt(100, 1000),
        authId: generateRandomString(12),
        name: 'José',
        email: 'jose.vargas@gmail.com',
        status: 'ACTIVE',
        role: 'moderator'
    },
    {
        id: getRandomInt(100, 1000),
        authId: generateRandomString(12),
        name: 'Sofía',
        email: 'sofia.ramirez@gmail.com',
        status: 'INACTIVE',
        role: 'user'
    }
];
