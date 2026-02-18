import { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    CircularProgress,
    Chip,
    Button
} from '@mui/material';
import Grid from '@mui/material/Grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

import { productService } from '@/services/productService';
import { movementService } from '@/services/movementService';
import type { Product } from '@/types/product';
import type { Movement } from '@/types/movement';

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Estado dos Dados
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockCount: 0,
        totalMovements: 0,
        recentMovements: [] as Movement[]
    });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Buscamos dados reais dos serviços
                const [products, movements] = await Promise.all([
                    productService.getAll(),
                    movementService.getHistory()
                ]);

                // Cálculos de Negócio (KPIs)
                const totalProducts = products.reduce((acc, p) => acc + p.quantity, 0);
                const lowStockCount = products.filter(p => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK').length;

                // Pegamos as 5 últimas movimentações
                const sortedMovements = [...movements].sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                ).slice(0, 5);

                setStats({
                    totalProducts,
                    lowStockCount,
                    totalMovements: movements.length,
                    recentMovements: sortedMovements
                });
            } catch (error) {
                console.error("Erro ao carregar dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <CircularProgress sx={{ color: 'primary.main' }} />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500 pb-10">

            {/* Header */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <Typography variant="h4" className="text-brand-dark font-bold mb-1 font-sans tracking-tight">
                        Painel de Controle
                    </Typography>
                    <Typography variant="body2" className="text-concrete-600">
                        Visão geral dos indicadores da obra.
                    </Typography>
                </div>
                <div className="text-right hidden md:block">
                    <Typography variant="caption" className="text-concrete-400 font-mono">
                        ÚLTIMA ATUALIZAÇÃO
                    </Typography>
                    <Typography variant="subtitle2" className="text-brand-dark font-bold">
                        {new Date().toLocaleDateString()}
                    </Typography>
                </div>
            </div>

            {/* KPI CARDS */}
            <Grid container spacing={3} className="mb-8">

                {/* Card 1: Total em Estoque */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={0}
                        className="p-6 border border-concrete-200 rounded-none border-l-4 border-l-brand-main relative overflow-hidden group hover:shadow-md transition-shadow"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <InventoryIcon sx={{ fontSize: 80, color: '#0F4C3A' }} />
                        </div>
                        <Typography variant="caption" className="text-concrete-500 uppercase tracking-wider font-bold">
                            Itens em Estoque
                        </Typography>
                        <Typography variant="h3" className="text-brand-dark font-mono mt-2 font-bold tracking-tighter">
                            {stats.totalProducts.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" className="text-emerald-600 font-bold mt-2 inline-flex items-center">
                            <TrendingUpIcon fontSize="small" className="mr-1" /> Estoque Saudável
                        </Typography>
                    </Paper>
                </Grid>

                {/* Card 2: Alertas de Estoque */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={0}
                        className={`p-6 border border-concrete-200 rounded-none border-l-4 relative overflow-hidden group hover:shadow-md transition-shadow ${stats.lowStockCount > 0 ? 'border-l-amber-500' : 'border-l-emerald-500'}`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <WarningAmberIcon sx={{ fontSize: 80, color: stats.lowStockCount > 0 ? '#F59E0B' : '#10B981' }} />
                        </div>
                        <Typography variant="caption" className="text-concrete-500 uppercase tracking-wider font-bold">
                            Alertas de Reposição
                        </Typography>
                        <Typography variant="h3" className={`font-mono mt-2 font-bold tracking-tighter ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {stats.lowStockCount}
                        </Typography>
                        <Typography variant="caption" className="text-concrete-400 mt-2 block">
                            Itens abaixo do nível mínimo
                        </Typography>
                    </Paper>
                </Grid>

                {/* Card 3: Movimentações Totais */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={0}
                        className="p-6 border border-concrete-200 rounded-none border-l-4 border-l-brand-dark relative overflow-hidden group hover:shadow-md transition-shadow"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUpIcon sx={{ fontSize: 80, color: '#023020' }} />
                        </div>
                        <Typography variant="caption" className="text-concrete-500 uppercase tracking-wider font-bold">
                            Movimentações (Total)
                        </Typography>
                        <Typography variant="h3" className="text-brand-dark font-mono mt-2 font-bold tracking-tighter">
                            {stats.totalMovements}
                        </Typography>
                        <Typography variant="caption" className="text-concrete-400 mt-2 block">
                            Registros no histórico
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* SEÇÃO: Atividade Recente */}
            <div className="bg-white border border-concrete-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <Typography variant="h6" className="font-bold text-brand-dark font-sans">
                        Últimas Movimentações
                    </Typography>
                    <Button
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/movimentacoes')}
                        sx={{ color: 'brand.main', fontWeight: 'bold' }}
                    >
                        Ver Histórico Completo
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-concrete-100">
                                <th className="pb-3 text-xs font-bold text-concrete-400 uppercase">Tipo</th>
                                <th className="pb-3 text-xs font-bold text-concrete-400 uppercase">Produto</th>
                                <th className="pb-3 text-xs font-bold text-concrete-400 uppercase text-right">Qtd.</th>
                                <th className="pb-3 text-xs font-bold text-concrete-400 uppercase text-right">Horário</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-concrete-50">
                            {stats.recentMovements.map((mov) => (
                                <tr key={mov.id} className="hover:bg-concrete-50 transition-colors">
                                    <td className="py-3">
                                        <Chip
                                            label={mov.type === 'IN' ? 'ENTRADA' : 'SAÍDA'}
                                            size="small"
                                            sx={{
                                                borderRadius: 0,
                                                fontWeight: 'bold',
                                                fontSize: '0.65rem',
                                                bgcolor: mov.type === 'IN' ? '#ECFDF5' : '#FEF2F2',
                                                color: mov.type === 'IN' ? '#065F46' : '#991B1B',
                                                border: '1px solid',
                                                borderColor: mov.type === 'IN' ? '#A7F3D0' : '#FECACA'
                                            }}
                                        />
                                    </td>
                                    <td className="py-3 font-bold text-brand-dark text-sm">
                                        {mov.productName}
                                    </td>
                                    <td className="py-3 text-right font-mono text-sm font-bold text-concrete-700">
                                        {mov.quantity}
                                    </td>
                                    <td className="py-3 text-right text-xs text-concrete-400 font-mono">
                                        {new Date(mov.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                            {stats.recentMovements.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-concrete-400 italic">
                                        Nenhuma movimentação registrada ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}