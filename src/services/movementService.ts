import type { Movement } from '@/types/movement';
import { productService } from '@/services/productService';

let MOCK_MOVEMENTS: Movement[] = [
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
        return [...MOCK_MOVEMENTS];
    },

    async create(data: Omit<Movement, 'id' | 'date'> & { skipStockUpdate?: boolean }): Promise<Movement> {
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Removemos a flag 'skipStockUpdate' antes de salvar o objeto, pois ela não faz parte do tipo Movement
        const { skipStockUpdate, ...movementData } = data;

        const newMovement: Movement = {
            ...movementData,
            id: Math.random().toString(36).slice(2, 11),
            date: new Date().toISOString(),
        };

        // Adicionamos o novo movimento ao início da lista global do Mock.
        // Sem isso, a outra tela nunca saberia que houve uma movimentação.
        MOCK_MOVEMENTS.unshift(newMovement);

        // LÓGICA CONDICIONAL: Só atualiza o estoque se a flag NÃO for verdadeira
        if (!skipStockUpdate) {
            const delta = movementData.type === 'IN' ? movementData.quantity : -movementData.quantity;
            await productService.updateStock(movementData.productId, delta);
        }

        return newMovement;
    }
};