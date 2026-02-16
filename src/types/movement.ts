export type MovementType = 'IN' | 'OUT';

export interface Movement {
    id: string;
    productId: string;
    productName: string; // Desnormalizado para facilitar exibição
    type: MovementType;
    quantity: number;
    date: string; // ISO String
    userName: string; // Quem fez a movimentação
}