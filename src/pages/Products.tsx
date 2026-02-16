import { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useAuth } from '@/hooks/useAuth';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';

export default function Products() {
    const { user } = useAuth(); // RBAC: Precisamos saber quem é
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Carregar dados
    const loadData = async () => {
        setLoading(true);
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Erro ao carregar produtos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Função auxiliar para cor do status (Estilo Industrial)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'IN_STOCK': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'LOW_STOCK': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'IN_STOCK': return 'Disponível';
            case 'LOW_STOCK': return 'Baixo Estoque';
            case 'OUT_OF_STOCK': return 'Esgotado';
            default: return status;
        }
    };

    return (
        <div className="animate-in fade-in duration-500">

            {/* 1. Header da Página */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Typography variant="h4" className="text-brand-dark font-bold font-sans tracking-tight">
                        Inventário Geral
                    </Typography>
                    <Typography variant="body2" className="text-concrete-600 mt-1">
                        Gerenciamento técnico de materiais e insumos.
                    </Typography>
                </div>

                {/* AÇÕES (RBAC: Só Admin vê o botão de Novo Produto) */}
                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadData}
                        sx={{ borderColor: '#D1D5DB', color: '#4B5563' }}
                    >
                        Atualizar
                    </Button>

                    {user?.role === 'ADMIN' && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                fontWeight: 'bold',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                        >
                            NOVO ITEM
                        </Button>
                    )}
                </div>
            </div>

            {/* 2. Tabela Técnica (Custom Table com Tailwind) */}
            <div className="bg-white border border-concrete-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <CircularProgress sx={{ color: 'brand.main' }} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-concrete-50 border-b border-concrete-200">
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">SKU</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Produto</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Categoria</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-right">Qtd.</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-center">Status</th>
                                    {/* Coluna de Ações: Só Admin vê o cabeçalho */}
                                    {user?.role === 'ADMIN' && (
                                        <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-right">Ações</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-concrete-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-concrete-50 transition-colors group">
                                        {/* SKU (Mono) */}
                                        <td className="p-4 font-mono text-sm text-concrete-600 font-medium">
                                            {product.sku}
                                        </td>

                                        {/* Nome */}
                                        <td className="p-4">
                                            <div className="font-bold text-brand-dark text-sm">{product.name}</div>
                                        </td>

                                        {/* Categoria */}
                                        <td className="p-4 text-sm text-concrete-600">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                {product.category}
                                            </span>
                                        </td>

                                        {/* Quantidade (Mono + Alinhamento Direita) */}
                                        <td className="p-4 text-right font-mono text-sm font-bold text-concrete-800">
                                            {product.quantity} <span className="text-xs text-concrete-400 font-sans font-normal">{product.unit}</span>
                                        </td>

                                        {/* Status (Badge Quadrado) */}
                                        <td className="p-4 text-center">
                                            <span className={`
                        inline-flex items-center px-2.5 py-0.5 border text-xs font-medium
                        ${getStatusColor(product.status)}
                      `}>
                                                {getStatusLabel(product.status)}
                                            </span>
                                        </td>

                                        {/* Ações (RBAC: Só Admin vê os botões) */}
                                        {user?.role === 'ADMIN' && (
                                            <td className="p-4 text-right">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                                    <Tooltip title="Editar">
                                                        <IconButton size="small" sx={{ color: 'primary.main' }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Excluir">
                                                        <IconButton size="small" sx={{ color: 'error.main' }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer da Tabela */}
            <div className="mt-4 flex justify-between items-center text-xs text-concrete-500">
                <span>Mostrando {products.length} registros</span>
                <span>Atualizado em: {new Date().toLocaleTimeString()}</span>
            </div>
        </div>
    );
}