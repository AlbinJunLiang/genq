export interface UserResponse {
    message: string;
    user: UserAuth
}


export interface UserAuth {
    id: number;
    authId: string;
    name?: string;
    email: string;
    lastName?: string;
    status: string;
    role?: string;
    createAt?: string;
}

export interface User {
    id: number;
    authId: string;
    name?: string;
    email: string;
    lastName?: string;
    status: string;
    role: string;
}


export interface UserUpdate {
    authId: string;
    name: string;
    status: string;
    role: string;
}

