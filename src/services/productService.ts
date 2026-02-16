import type { Product } from '@/types/product';

// Dados Mockados "Carvalho Engenharia"
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Cimento CP-II Z 32',
        sku: 'MAT-001',
        category: 'Estrutural',
        quantity: 450,
        minLevel: 100,
        unit: 'sacos',
        status: 'IN_STOCK',
        lastUpdated: '2026-02-15T10:00:00Z',
    },
    {
        id: '2',
        name: 'Viga de Aço I - 6 Polegadas',
        sku: 'FER-052',
        category: 'Metalurgia',
        quantity: 12,
        minLevel: 20,
        unit: 'barras',
        status: 'LOW_STOCK', // Alerta!
        lastUpdated: '2026-02-14T16:30:00Z',
    },
    {
        id: '3',
        name: 'Cabo Flexível 2.5mm',
        sku: 'ELE-104',
        category: 'Elétrica',
        quantity: 0,
        minLevel: 500,
        unit: 'rolos',
        status: 'OUT_OF_STOCK', // Crítico!
        lastUpdated: '2026-02-10T09:15:00Z',
    },
    {
        id: '4',
        name: 'Tijolo Cerâmico 8 Furos',
        sku: 'ALV-008',
        category: 'Alvenaria',
        quantity: 5000,
        minLevel: 1000,
        unit: 'un',
        status: 'IN_STOCK',
        lastUpdated: '2026-02-16T08:00:00Z',
    },
];

export const productService = {
    async getAll(): Promise<Product[]> {
        // Simula delay de rede (500ms)
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_PRODUCTS;
    },

    async delete(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`Produto ${id} deletado (Simulação)`);
    }
};