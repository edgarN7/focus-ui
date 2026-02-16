import type { Movement } from '@/types/movement';

const MOCK_MOVEMENTS: Movement[] = [
    {
        id: '1',
        productId: '1',
        productName: 'Cimento CP-II Z 32',
        type: 'IN',
        quantity: 50,
        date: '2026-02-16T08:30:00Z',
        userName: 'João Operador',
    },
    {
        id: '2',
        productId: '2',
        productName: 'Viga de Aço I',
        type: 'OUT',
        quantity: 4,
        date: '2026-02-16T09:15:00Z',
        userName: 'Eleanor Rigby',
    },
    {
        id: '3',
        productId: '4',
        productName: 'Tijolo Cerâmico',
        type: 'OUT',
        quantity: 500,
        date: '2026-02-15T14:20:00Z',
        userName: 'João Operador',
    },
];

export const movementService = {
    async getHistory(): Promise<Movement[]> {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return MOCK_MOVEMENTS;
    },

    async create(movement: Omit<Movement, 'id' | 'date'>): Promise<Movement> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const newMovement: Movement = {
            ...movement,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
        };
        // Num app real, aqui atualizaríamos o estoque do produto também
        return newMovement;
    }
};