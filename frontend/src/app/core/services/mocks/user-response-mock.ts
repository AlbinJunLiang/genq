import { UserResponse } from "../../interfaces/user-interface";

export const MOCK_USER_RESPONSE: UserResponse = {
    message: "User authenticated successfully",
    user: {
        id: 101,
        authId: "google-oauth2|1234567890",
        name: "Juan",
        email: "JUANG655665@gmail.com",
        lastName: "Lopez",
        status: "ACTIVE",
        role: "USER",
        createAt: "2026-06-21T18:00:00Z"
    }
};