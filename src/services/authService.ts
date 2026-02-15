import type { LoginResponse, User } from '@/types/auth';

// Simulação de banco de dados
const MOCK_USERS: Record<string, User> = {
    'admin@focus.ui': {
        id: '1',
        name: 'Eleanor Rigby',
        email: 'admin@focus.ui',
        role: 'ADMIN',
        avatar: 'ER',
    },
    'operador@focus.ui': {
        id: '2',
        name: 'John Doe',
        email: 'operador@focus.ui',
        role: 'OPERATOR',
        avatar: 'JD',
    },
};

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        // Simula delay de rede (UX: Feedback visual de loading)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const user = MOCK_USERS[email];

        // Validação "Fake" (Senha fixa para teste: 123456)
        if (user && password === '123456') {
            return {
                token: 'fake-jwt-token-xyz-123', // Em produção, isso viria do servidor
                user,
            };
        }

        throw new Error('Credenciais inválidas. Tente admin@focus.ui ou operador@focus.ui com senha "123456"');
    },

    async logout(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));
    },
};