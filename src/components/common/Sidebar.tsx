import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory'; // Produtos
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // Movimentações
import PeopleIcon from '@mui/icons-material/People'; // Usuários
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';

export default function Sidebar() {
    const { user, logout } = useAuth();

    // Definição dos Links e Permissões
    const MENU_ITEMS = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: <DashboardIcon />,
            roles: ['ADMIN'] // Só Admin vê
        },
        {
            label: 'Produtos',
            path: '/produtos',
            icon: <InventoryIcon />,
            roles: ['ADMIN', 'OPERATOR'] //Ambos veem
        },
        {
            label: 'Movimentações',
            path: '/movimentacoes',
            icon: <SwapHorizIcon />,
            roles: ['ADMIN', 'OPERATOR']
        },
        {
            label: 'Equipe',
            path: '/usuarios',
            icon: <PeopleIcon />,
            roles: ['ADMIN']
        },
    ];

    // Filtragem Inteligente (RBAC)
    const authorizedItems = MENU_ITEMS.filter(item =>
        user?.role && item.roles.includes(user.role)
    );

    return (
        <aside className="w-64 bg-[#023020] text-white flex flex-col h-screen border-r border-white/10 shadow-2xl shrink-0 transition-all duration-300 font-sans">

            {/* 1. Header da Sidebar */}
            <div className="h-20 flex items-center px-6 border-b border-white/10 bg-[#0F4C3A]/30 backdrop-blur-sm">
                <div className="p-2 border border-white/20 mr-3 bg-white/5">
                    <BusinessIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
                </div>
                <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', fontFamily: 'Manrope' }}>
                        CARVALHO
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Engenharia
                    </Typography>
                </div>
            </div>

            {/* 2. Navegação */}
            <nav className="flex-1 py-8 px-3 space-y-1 overflow-y-auto">
                <Typography variant="caption" sx={{ px: 2, opacity: 0.4, fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.7rem' }}>
                    MENU PRINCIPAL
                </Typography>

                <div className="mt-3 space-y-1">
                    {authorizedItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group relative rounded-sm
                ${isActive
                                    ? 'bg-white/10 text-white border-l-2 border-[#D4AF37]' // Ativo: Fundo leve e borda dourada
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'    // Inativo: Cinza para branco
                                }
              `}
                        >
                            {({ isActive }) => (
                                <>
                                    <Box component="span" sx={{ mr: 3, display: 'flex', color: isActive ? '#D4AF37' : 'inherit' }}>
                                        {item.icon}
                                    </Box>
                                    <span className="tracking-wide">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* 3. Footer do Usuário */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                    <Avatar
                        sx={{
                            bgcolor: '#D4AF37', // Dourado para o avatar
                            color: '#023020',   // Texto verde escuro
                            fontWeight: 'bold',
                            width: 36,
                            height: 36,
                            borderRadius: 0,    // Quadrado (Identidade Técnica)
                            fontSize: '0.9rem'
                        }}
                    >
                        {user?.name.charAt(0)}
                    </Avatar>

                    <div className="flex-1 min-w-0 overflow-hidden">
                        <Typography
                            variant="subtitle2"
                            className="font-bold truncate text-white"
                            sx={{ fontFamily: 'Manrope' }}
                        >
                            {user?.name}
                        </Typography>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${user?.role === 'ADMIN' ? 'bg-[#D4AF37]' : 'bg-blue-400'}`} />
                            <Typography variant="caption" className="text-gray-400 text-[0.65rem] tracking-wider">
                                {user?.role}
                            </Typography>
                        </div>
                    </div>

                    <Tooltip title="Sair do Sistema">
                        <IconButton
                            onClick={logout}
                            size="small"
                            sx={{
                                color: 'rgba(255,255,255,0.4)',
                                borderRadius: 0,
                                '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.1)' }
                            }}
                        >
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </aside>
    );
}