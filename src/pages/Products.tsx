import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Typography, Button, IconButton, Tooltip, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    TextField, MenuItem, Snackbar, Alert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { useAuth } from '@/hooks/useAuth';
import { productService } from '@/services/productService';
import { movementService } from '@/services/movementService';
import type { Product } from '@/types/product';

// Schema
const productSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    sku: z.string().min(7, 'SKU obrigatório (ex: MAT-001)'),
    category: z.string().min(1, 'Selecione uma categoria'),
    quantity: z.coerce.number().min(0, 'Qtd inválida'),
    minLevel: z.coerce.number().min(1, 'Nível mínimo inválido'),
    unit: z.string().min(1, 'Unidade obrigatória'),
});

const CATEGORIES = ['Acabamento', 'Alvenaria', 'Elétrica', 'EPI', 'Estrutural', 'Ferramentas', 'Hidráulica', 'Metalurgia'];
const UNITS = ['kg', 'm', 'm²', 'm³', 'un', 'barras', 'cx', 'litros', 'rolos', 'sacos'];

export default function Products() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados de UI
    const [openModal, setOpenModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null); // Null = Criando, String = Editando

    // Estado de Exclusão
    const [deleteId, setDeleteId] = useState<string | null>(null); // ID do item a deletar

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
        resolver: zodResolver(productSchema),
        defaultValues: { quantity: 0, minLevel: 10 }
    });

    // Carregar dados
    const loadData = async () => {
        setLoading(true);
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // --- HANDLERS DE EDIÇÃO/CRIAÇÃO ---

    const handleOpenCreate = () => {
        setEditingId(null); // Modo Criação
        reset({ quantity: 0, minLevel: 10, name: '', sku: '', category: '', unit: '' });
        setOpenModal(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingId(product.id); // Modo Edição
        reset({
            name: product.name,
            sku: product.sku,
            category: product.category,
            quantity: product.quantity,
            minLevel: product.minLevel,
            unit: product.unit
        });

        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    const onSubmit = async (data: any) => {
        // --- VALIDAÇÃO DE DUPLICIDADE ---

        // 1. Verifica Nome (Case insensitive: "Cimento" == "cimento")
        const nameExists = products.some(p =>
            p.name.toLowerCase() === data.name.toLowerCase() &&
            p.id !== editingId // Ignora o próprio item se estiver editando
        );

        if (nameExists) {
            setError('name', { type: 'manual', message: 'Já existe um produto com este nome.' });
            return; // Para a execução aqui
        }

        // 2. Verifica SKU (Exato)
        const skuExists = products.some(p =>
            p.sku === data.sku &&
            p.id !== editingId
        );

        if (skuExists) {
            setError('sku', { type: 'manual', message: 'Este código SKU já está em uso.' });
            return; // Para a execução aqui
        }

        // --- SE PASSOU, SALVA ---
        try {
            if (editingId) {
                await productService.update(editingId, data);
                setToast({ open: true, message: 'Item atualizado com sucesso!', severity: 'success' });
            } else {
                // 1. Cria o Produto
                const newProduct = await productService.create(data);

                // 2. REGRA DE NEGÓCIO: Se nasceu com estoque, gera movimentação e avisa para não somar novamente
                if (data.quantity > 0) {
                    await movementService.create({
                        productId: newProduct.id,
                        productName: newProduct.name,
                        type: 'IN',
                        quantity: data.quantity,
                        userName: user?.name || 'Admin (Cadastro Inicial)',
                        skipStockUpdate: true
                    });
                }

                setToast({ open: true, message: 'Item cadastrado com sucesso!', severity: 'success' });
            }
            handleCloseModal();
            loadData();
        } catch (error) {
            setToast({ open: true, message: 'Erro ao salvar item.', severity: 'error' });
        }
    };

    // --- HANDLERS DE EXCLUSÃO ---

    const handleOpenDelete = (id: string) => setDeleteId(id);
    const handleCloseDelete = () => setDeleteId(null);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await productService.delete(deleteId);
            setToast({ open: true, message: 'Item removido do inventário.', severity: 'success' });
            loadData();
        } catch (error) {
            setToast({ open: true, message: 'Erro ao excluir item.', severity: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    // Helpers Visuais
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'IN_STOCK': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'LOW_STOCK': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Typography variant="h4" className="text-brand-dark font-bold font-sans tracking-tight">
                        Inventário Geral
                    </Typography>
                    <Typography variant="body2" className="text-concrete-600 mt-1">
                        Gerenciamento técnico de materiais e insumos.
                    </Typography>
                </div>

                <div className="flex gap-2">
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadData} sx={{ borderColor: '#D1D5DB', color: '#4B5563' }}>
                        Atualizar
                    </Button>
                    {user?.role === 'ADMIN' && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenCreate}
                            sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', boxShadow: 'none', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            NOVO ITEM
                        </Button>
                    )}
                </div>
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
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">SKU</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Produto</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Categoria</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-right">Qtd.</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-center">Status</th>
                                    {user?.role === 'ADMIN' && <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-right">Ações</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-concrete-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-concrete-50 transition-colors group">
                                        <td className="p-4 font-mono text-sm text-concrete-600 font-medium">{product.sku}</td>
                                        <td className="p-4"><div className="font-bold text-brand-dark text-sm">{product.name}</div></td>
                                        <td className="p-4 text-sm text-concrete-600">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{product.category}</span>
                                        </td>
                                        <td className="p-4 text-right font-mono text-sm font-bold text-concrete-800">
                                            {product.quantity} <span className="text-xs text-concrete-400 font-sans font-normal">{product.unit}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 border text-xs font-medium ${getStatusColor(product.status)}`}>
                                                {product.status === 'IN_STOCK' ? 'Disponível' : product.status === 'LOW_STOCK' ? 'Baixo Estoque' : 'Esgotado'}
                                            </span>
                                        </td>
                                        {user?.role === 'ADMIN' && (
                                            <td className="p-4 text-right">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                                    <Tooltip title="Editar">
                                                        <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => handleOpenEdit(product)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Excluir">
                                                        <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => handleOpenDelete(product.id)}>
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

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center text-xs text-concrete-500">
                <span>Mostrando {products.length} registros</span>
                <span>Atualizado em: {new Date().toLocaleTimeString()}</span>
            </div>

            {/* --- MODAL DE CRIAÇÃO / EDIÇÃO --- */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ borderBottom: '1px solid #E5E7EB', pb: 2 }}>
                    <Typography variant="h6" className="font-bold text-brand-dark font-sans">
                        {editingId ? 'Editar Material' : 'Cadastro de Material'}
                    </Typography>
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField label="Descrição do Material" fullWidth error={!!errors.name} helperText={errors.name?.message} {...register('name')} />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField label="SKU / Código" fullWidth error={!!errors.sku} helperText={errors.sku?.message} {...register('sku')} />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField select label="Categoria" fullWidth value={watch('category') || ''} error={!!errors.category} helperText={errors.category?.message} {...register('category')}>
                                    {CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField label="Quantidade" type="number" fullWidth error={!!errors.quantity} helperText={errors.quantity?.message} {...register('quantity')} />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField select label="Unidade" fullWidth value={watch('unit') || ''} error={!!errors.unit} helperText={errors.unit?.message} {...register('unit')}>
                                    {UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField label="Estoque Mínimo (Alerta)" type="number" fullWidth error={!!errors.minLevel} {...register('minLevel')} />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, borderTop: '1px solid #E5E7EB' }}>
                        <Button onClick={handleCloseModal} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', boxShadow: 'none' }}>
                            {isSubmitting ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Cadastrar Item')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* --- DIALOG DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
            <Dialog open={!!deleteId} onClose={handleCloseDelete}>
                <DialogTitle className="text-red-700 font-bold flex items-center gap-2">
                    <WarningAmberIcon /> Confirmar Exclusão
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja remover este item do inventário? Esta ação não pode ser desfeita e afetará o histórico.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDelete} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
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