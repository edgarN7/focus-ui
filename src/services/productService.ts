import type { Product } from '@/types/product';

// Dados Mockados "Carvalho Engenharia"
let MOCK_PRODUCTS: Product[] = [
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
        return [...MOCK_PRODUCTS];
    },

    // NOVA FUNÇÃO: Criar Produto
    async create(data: Omit<Product, 'id' | 'status' | 'lastUpdated'>): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newProduct: Product = {
            ...data,
            id: Math.random().toString(36).slice(2, 11),
            status: data.quantity === 0 ? 'OUT_OF_STOCK' : (data.quantity < data.minLevel ? 'LOW_STOCK' : 'IN_STOCK'),
            lastUpdated: new Date().toISOString(),
        };

        MOCK_PRODUCTS.unshift(newProduct); // Adiciona no topo da lista
        return newProduct;
    },

    async delete(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
    }
};