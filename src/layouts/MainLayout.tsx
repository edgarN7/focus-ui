import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/components/common/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

export default function MainLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    // 1. Loading State (Evita piscar a tela de login enquanto verifica o token)
    if (isLoading) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
                <CircularProgress sx={{ color: 'brand.main' }} />
            </Box>
        );
    }

    // 2. Proteção de Rota (Se não logado, manda pro Login)
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-concrete-100">
            {/* Sidebar Fixa */}
            <Sidebar />

            {/* Área de Conteúdo (Scrollável) */}
            <main className="flex-1 overflow-auto relative flex flex-col">
                {/* Header Superior (Opcional, por enquanto só espaçamento) */}
                <header className="h-16 bg-white border-b border-concrete-200 flex items-center px-8 justify-between shrink-0">
                    <h2 className="text-concrete-800 font-bold text-lg tracking-tight">
                        Visão Geral
                    </h2>
                    {/* Aqui poderiam entrar notificações ou busca global */}
                </header>

                {/* Onde as páginas (Dashboard, Produtos) serão renderizadas */}
                <div className="p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}