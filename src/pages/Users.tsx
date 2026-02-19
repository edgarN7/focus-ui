import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Typography, Button, Avatar, IconButton, Tooltip, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    Snackbar, Alert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { userService } from '@/services/userService';
import type { UserWithStatus } from '@/services/userService';

// 1. Schema de Validação
const userSchema = z.object({
    name: z.string().min(3, 'Nome completo é obrigatório'),
    email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'E-mail inválido' }),
    department: z.string().min(2, 'Departamento obrigatório'),
    role: z.enum(['ADMIN', 'OPERATOR']),
});

type UserFormInputs = z.infer<typeof userSchema>;

export default function Users() {
    const [users, setUsers] = useState<UserWithStatus[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados do Modal e Feedback
    const [openModal, setOpenModal] = useState(false);
    const [toast, setToast] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success'
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: 'OPERATOR' // Valor padrão seguro
        }
    });

    const loadData = async () => {
        setLoading(true);
        const data = await userService.getAll();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    // Handlers
    const handleOpen = () => {
        reset({ role: 'OPERATOR', name: '', email: '', department: '' });
        setOpenModal(true);
    };

    const handleClose = () => setOpenModal(false);

    const onSubmit = async (data: UserFormInputs) => {
        try {
            await userService.create(data);
            setToast({ open: true, message: 'Usuário adicionado à equipe!', severity: 'success' });
            handleClose();
            loadData();
        } catch (error) {
            setToast({ open: true, message: 'Erro ao criar usuário.', severity: 'error' });
        }
    };

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
                    onClick={handleOpen}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white', fontWeight: 'bold', boxShadow: 'none',
                        '&:hover': { bgcolor: 'primary.dark' }
                    }}
                >
                    NOVO USUÁRIO
                </Button>
            </div>

            {/* Tabela */}
            <div className="bg-white border border-concrete-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center"><CircularProgress sx={{ color: 'brand.main' }} /></div>
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
                                        <td className="p-4">
                                            <Avatar
                                                sx={{
                                                    bgcolor: user.role === 'ADMIN' ? '#D4AF37' : '#E5E7EB',
                                                    color: user.role === 'ADMIN' ? '#023020' : '#4B5563',
                                                    fontWeight: 'bold', width: 40, height: 40, borderRadius: 1
                                                }}
                                            >
                                                {user.avatar}
                                            </Avatar>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-brand-dark text-sm">{user.name}</div>
                                            <div className="text-xs text-concrete-500 font-mono">{user.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-concrete-700">{user.department}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wide border ${user.role === 'ADMIN' ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]' : 'bg-white text-concrete-600 border-concrete-300'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.status === 'ACTIVE' ? (
                                                <Tooltip title="Acesso Permitido"><CheckCircleIcon fontSize="small" className="text-emerald-600" /></Tooltip>
                                            ) : (
                                                <Tooltip title="Acesso Bloqueado"><BlockIcon fontSize="small" className="text-concrete-400" /></Tooltip>
                                            )}
                                        </td>
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

            {/* --- MODAL DE NOVO USUÁRIO --- */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ borderBottom: '1px solid #E5E7EB', pb: 2 }}>
                    <Typography variant="h6" className="font-bold text-brand-dark font-sans">
                        Novo Membro da Equipe
                    </Typography>
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField label="Nome Completo" fullWidth error={!!errors.name} helperText={errors.name?.message} {...register('name')} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField label="E-mail Corporativo" type="email" fullWidth error={!!errors.email} helperText={errors.email?.message} {...register('email')} />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField label="Departamento" fullWidth error={!!errors.department} helperText={errors.department?.message} {...register('department')} />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    select
                                    label="Função (Role)"
                                    fullWidth
                                    value={watch('role') || 'OPERATOR'} // Watch garante o valor correto
                                    error={!!errors.role}
                                    helperText={errors.role?.message}
                                    {...register('role')}
                                >
                                    <MenuItem value="OPERATOR">Operador</MenuItem>
                                    <MenuItem value="ADMIN">Administrador</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, borderTop: '1px solid #E5E7EB' }}>
                        <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', boxShadow: 'none' }}>
                            {isSubmitting ? 'Salvando...' : 'Criar Acesso'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* FEEDBACK */}
            <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={toast.severity} variant="filled" onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
            </Snackbar>

        </div>
    );
}