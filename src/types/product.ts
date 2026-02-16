export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Product {
    id: string;
    name: string;
    sku: string;        // Código único (ex: ENG-001)
    category: string;
    quantity: number;
    minLevel: number;   // Nível mínimo para alerta
    unit: string;       // un, kg, m, m²
    status: ProductStatus;
    lastUpdated: string;
}