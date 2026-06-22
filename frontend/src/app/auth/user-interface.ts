export interface User {
    uid: string;
    email: string | null;
    displayName?: string;
    accessToken?: string;
    role?: string;
    emailVerified?: boolean;
}