import { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { userService } from '@/services/userService';
import type { UserWithStatus } from '@/services/userService';

export default function Users() {
    const [users, setUsers] = useState<UserWithStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await userService.getAll();
            setUsers(data);
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div className="animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Typography variant="h4" className="text-brand-dark font-bold font-sans tracking-tight">
                        Gestão de Equipe
                    </Typography>
                    <Typography variant="body2" className="text-concrete-600 mt-1">
                        Controle de acesso e perfis de usuários.
                    </Typography>
                </div>

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
                    NOVO USUÁRIO
                </Button>
            </div>

            {/* Tabela de Usuários */}
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
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider w-16">Avatar</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Nome / Email</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Departamento</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Função</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-concrete-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-concrete-50 transition-colors group">

                                        {/* Avatar */}
                                        <td className="p-4">
                                            <Avatar
                                                sx={{
                                                    bgcolor: user.role === 'ADMIN' ? '#D4AF37' : '#E5E7EB',
                                                    color: user.role === 'ADMIN' ? '#023020' : '#4B5563',
                                                    fontWeight: 'bold',
                                                    width: 40, height: 40,
                                                    borderRadius: 1 // Quadrado arredondado
                                                }}
                                            >
                                                {user.avatar}
                                            </Avatar>
                                        </td>

                                        {/* Nome e Email */}
                                        <td className="p-4">
                                            <div className="font-bold text-brand-dark text-sm">{user.name}</div>
                                            <div className="text-xs text-concrete-500 font-mono">{user.email}</div>
                                        </td>

                                        {/* Departamento */}
                                        <td className="p-4 text-sm text-concrete-700">
                                            {user.department}
                                        </td>

                                        {/* Role (Badge) */}
                                        <td className="p-4">
                                            <span className={`
                        inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wide border
                        ${user.role === 'ADMIN'
                                                    ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]'
                                                    : 'bg-white text-concrete-600 border-concrete-300'}
                      `}>
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="p-4 text-center">
                                            {user.status === 'ACTIVE' ? (
                                                <Tooltip title="Acesso Permitido">
                                                    <CheckCircleIcon fontSize="small" className="text-emerald-600" />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Acesso Bloqueado">
                                                    <BlockIcon fontSize="small" className="text-concrete-400" />
                                                </Tooltip>
                                            )}
                                        </td>

                                        {/* Ações */}
                                        <td className="p-4 text-right">
                                            <IconButton size="small" className="text-concrete-400 hover:text-brand-dark">
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}