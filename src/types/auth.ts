// src/types/auth.ts

// Definimos as Roles como constantes literais
export type UserRole = 'ADMIN' | 'OPERATOR';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
}