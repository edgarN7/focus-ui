import type { User } from '@/types/auth';

// Estendendo o tipo User apenas para essa lista (adicionando status)
export interface UserWithStatus extends User {
    status: 'ACTIVE' | 'INACTIVE';
    department: string;
    lastAccess: string;
}

let MOCK_USERS: UserWithStatus[] = [
    {
        id: '1',
        name: 'Eleanor Rigby',
        email: 'admin@focus.ui',
        role: 'ADMIN',
        avatar: 'ER',
        status: 'ACTIVE',
        department: 'Diretoria',
        lastAccess: '2026-02-18T10:00:00Z'
    },
    {
        id: '2',
        name: 'João da Silva',
        email: 'operador@focus.ui',
        role: 'OPERATOR',
        avatar: 'JS',
        status: 'ACTIVE',
        department: 'Almoxarifado',
        lastAccess: '2026-02-18T08:30:00Z'
    },
    {
        id: '3',
        name: 'Roberto Engenheiro',
        email: 'roberto@focus.ui',
        role: 'OPERATOR',
        avatar: 'RE',
        status: 'INACTIVE', // Usuário desligado
        department: 'Obras',
        lastAccess: '2025-12-20T14:00:00Z'
    }
];

export const userService = {
    async getAll(): Promise<UserWithStatus[]> {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return [...MOCK_USERS];
    },

    // Método: Create
    async create(data: Omit<UserWithStatus, 'id' | 'status' | 'lastAccess' | 'avatar'>): Promise<UserWithStatus> {
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Gera iniciais para o avatar (ex: "Roberto Carlos" -> "RC")
        const initials = data.name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

        const newUser: UserWithStatus = {
            ...data,
            id: Math.random().toString(36).slice(2, 11),
            status: 'ACTIVE', // Padrão: Ativo
            avatar: initials,
            lastAccess: 'Nunca', // Nunca acessou
        };

        MOCK_USERS.push(newUser);
        return newUser;
    },

    // Método: Update
    async update(id: string, data: Partial<UserWithStatus>): Promise<UserWithStatus> {
        await new Promise((resolve) => setTimeout(resolve, 600));

        const index = MOCK_USERS.findIndex(u => u.id === id);
        if (index === -1) throw new Error('Usuário não encontrado');

        // Se mudou o nome, regenera as iniciais do avatar
        let avatar = MOCK_USERS[index].avatar;
        if (data.name) {
            avatar = data.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        }

        const updatedUser = {
            ...MOCK_USERS[index],
            ...data,
            avatar,
        };

        MOCK_USERS[index] = updatedUser;
        return updatedUser;
    },

    // Método: Delete
    async delete(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 600));
        MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
    }

};