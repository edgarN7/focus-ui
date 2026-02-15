import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginResponse } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    // Começamos carregando para verificar se já existe sessão salva
    const [isLoading, setIsLoading] = useState(true);

    // 1. Recuperar sessão ao iniciar (Hydration)
    useEffect(() => {
        const storedUser = localStorage.getItem('focus_user');
        const storedToken = localStorage.getItem('focus_token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // 2. Função de Login
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response: LoginResponse = await authService.login(email, password);

            // Salva no estado
            setUser(response.user);

            // Persiste no navegador
            localStorage.setItem('focus_user', JSON.stringify(response.user));
            localStorage.setItem('focus_token', JSON.stringify(response.token));
        } catch (error) {
            throw error; // Repassa o erro para a UI tratar (exibir toast/alerta)
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Função de Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('focus_user');
        localStorage.removeItem('focus_token');
        authService.logout(); // Chama serviço se precisar invalidar token no back
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}