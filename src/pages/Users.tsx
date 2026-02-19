import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Typography, Button, Avatar, IconButton, Tooltip, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    Snackbar, Alert, Menu, ListItemIcon, ListItemText, DialogContentText
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { userService } from '@/services/userService';
import type { UserWithStatus } from '@/services/userService';

// Schema
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

    // Estados de UI
    const [openModal, setOpenModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Estado do Menu (Dropdown)
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<UserWithStatus | null>(null);

    const [toast, setToast] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success'
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: { role: 'OPERATOR' }
    });

    const loadData = async () => {
        setLoading(true);
        const data = await userService.getAll();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    // --- HANDLERS DO MENU ---
    const handleMenuOpen = (event: MouseEvent<HTMLElement>, user: UserWithStatus) => {
        setMenuAnchor(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedUser(null);
    };

    // --- HANDLERS DE CRIAÇÃO / EDIÇÃO ---
    const handleOpenCreate = () => {
        setEditingId(null);
        reset({ role: 'OPERATOR', name: '', email: '', department: '' });
        setOpenModal(true);
    };

    const handleOpenEdit = () => {
        if (!selectedUser) return;
        setEditingId(selectedUser.id);
        reset({
            name: selectedUser.name,
            email: selectedUser.email,
            department: selectedUser.department,
            role: selectedUser.role
        });
        handleMenuClose(); // Fecha o menu
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    const onSubmit = async (data: UserFormInputs) => {
        // Validação de Duplicidade (Ignorando o próprio usuário se for edição)
        const emailExists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase() && u.id !== editingId);
        if (emailExists) {
            setError('email', { type: 'manual', message: 'Este e-mail já está cadastrado.' });
            return;
        }

        const nameExists = users.some(u => u.name.toLowerCase() === data.name.toLowerCase() && u.id !== editingId);
        if (nameExists) {
            setError('name', { type: 'manual', message: 'Já existe um colaborador com este nome.' });
            return;
        }

        try {
            if (editingId) {
                await userService.update(editingId, data);
                setToast({ open: true, message: 'Dados do usuário atualizados!', severity: 'success' });
            } else {
                await userService.create(data);
                setToast({ open: true, message: 'Usuário adicionado à equipe!', severity: 'success' });
            }
            handleCloseModal();
            loadData();
        } catch (error) {
            setToast({ open: true, message: 'Erro ao salvar dados.', severity: 'error' });
        }
    };

    // --- HANDLERS DE EXCLUSÃO ---
    const handleOpenDelete = () => {
        if (selectedUser) {
            setDeleteId(selectedUser.id);
            handleMenuClose();
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await userService.delete(deleteId);
            setToast({ open: true, message: 'Usuário removido da equipe.', severity: 'success' });
            loadData();
        } catch (error) {
            setToast({ open: true, message: 'Erro ao remover usuário.', severity: 'error' });
        } finally {
            setDeleteId(null);
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
                    onClick={handleOpenCreate}
                    sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', boxShadow: 'none', '&:hover': { bgcolor: 'primary.dark' } }}
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
                                            <Avatar sx={{ bgcolor: user.role === 'ADMIN' ? '#D4AF37' : '#E5E7EB', color: user.role === 'ADMIN' ? '#023020' : '#4B5563', fontWeight: 'bold', width: 40, height: 40, borderRadius: 1 }}>
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
                                            <IconButton
                                                size="small"
                                                className="text-concrete-400 hover:text-brand-dark"
                                                onClick={(e) => handleMenuOpen(e, user)} // Abre o menu
                                            >
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

            {/* --- MENU DE AÇÕES (DROPDOWN) --- */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 150, borderRadius: 1, border: '1px solid #E5E7EB' }
                }}
            >
                <MenuItem onClick={handleOpenEdit}>
                    <ListItemIcon><EditIcon fontSize="small" className="text-brand-main" /></ListItemIcon>
                    <ListItemText primary="Editar" slotProps={{ primary: { fontSize: '0.9rem' } }} />
                </MenuItem>
                <MenuItem onClick={handleOpenDelete}>
                    <ListItemIcon><DeleteIcon fontSize="small" className="text-red-600" /></ListItemIcon>
                    <ListItemText primary="Excluir" slotProps={{ primary: { fontSize: '0.9rem', color: 'error.main' } }} />
                </MenuItem>
            </Menu>

            {/* --- MODAL DE CRIAÇÃO / EDIÇÃO --- */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ borderBottom: '1px solid #E5E7EB', pb: 2 }}>
                    <Typography variant="h6" className="font-bold text-brand-dark font-sans">
                        {editingId ? 'Editar Membro' : 'Novo Membro da Equipe'}
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
                                    value={watch('role') || 'OPERATOR'}
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
                        <Button onClick={handleCloseModal} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', boxShadow: 'none' }}>
                            {isSubmitting ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Criar Acesso')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* --- DIALOG DE EXCLUSÃO --- */}
            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle className="text-red-700 font-bold flex items-center gap-2">
                    <WarningAmberIcon /> Confirmar Exclusão
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja remover este usuário? O acesso ao sistema será revogado imediatamente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteId(null)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
                    <Button onClick={confirmDelete} variant="contained" color="error" sx={{ fontWeight: 'bold', boxShadow: 'none' }}>
                        Confirmar Exclusão
                    </Button>
                </DialogActions>
            </Dialog>

            {/* FEEDBACK */}
            <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={toast.severity} variant="filled" onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
            </Snackbar>

        </div>
    );
}