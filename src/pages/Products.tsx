import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Typography,
    Button,
    IconButton,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Snackbar,
    Alert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAuth } from '@/hooks/useAuth';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';

// 1. Schema de Validação (Regras de Engenharia)
const productSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    sku: z.string().min(3, 'SKU obrigatório (ex: MAT-001)'),
    category: z.string().min(1, 'Selecione uma categoria'),
    quantity: z.coerce.number().min(0, 'Quantidade não pode ser negativa'),
    minLevel: z.coerce.number().min(1, 'Nível mínimo deve ser pelo menos 1'),
    unit: z.string().min(1, 'Unidade obrigatória'),
});

type ProductFormInputs = z.infer<typeof productSchema>;

const CATEGORIES = ['Estrutural', 'Acabamento', 'Elétrica', 'Hidráulica', 'Ferramentas', 'EPI'];
const UNITS = ['un', 'kg', 'm', 'm²', 'm³', 'cx', 'sacos', 'litros'];

export default function Products() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados de UI
    const [openModal, setOpenModal] = useState(false);
    const [toast, setToast] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success'
    });

    // Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            quantity: 0,
            minLevel: 10
        }
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

    useEffect(() => {
        loadData();
    }, []);

    // Handlers
    const handleOpen = () => {
        reset(); // Limpa o formulário
        setOpenModal(true);
    };

    const handleClose = () => setOpenModal(false);

    const onSubmit = async (data: ProductFormInputs) => {
        try {
            await productService.create(data);
            setToast({ open: true, message: 'Item cadastrado com sucesso!', severity: 'success' });
            handleClose();
            loadData(); // Recarrega a lista
        } catch (error) {
            setToast({ open: true, message: 'Erro ao cadastrar item.', severity: 'error' });
        }
    };

    // Helpers de Estilo
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
                            onClick={handleOpen}
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

            {/* Tabela */}
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
                                    {user?.role === 'ADMIN' && (
                                        <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-right">Ações</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-concrete-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-concrete-50 transition-colors group">
                                        <td className="p-4 font-mono text-sm text-concrete-600 font-medium">{product.sku}</td>
                                        <td className="p-4"><div className="font-bold text-brand-dark text-sm">{product.name}</div></td>
                                        <td className="p-4 text-sm text-concrete-600">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono text-sm font-bold text-concrete-800">
                                            {product.quantity} <span className="text-xs text-concrete-400 font-sans font-normal">{product.unit}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 border text-xs font-medium ${getStatusColor(product.status)}`}>
                                                {getStatusLabel(product.status)}
                                            </span>
                                        </td>
                                        {user?.role === 'ADMIN' && (
                                            <td className="p-4 text-right">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                                    <Tooltip title="Editar"><IconButton size="small" sx={{ color: 'primary.main' }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                                                    <Tooltip title="Excluir"><IconButton size="small" sx={{ color: 'error.main' }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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

            {/* --- MODAL DE NOVO PRODUTO --- */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ borderBottom: '1px solid #E5E7EB', pb: 2 }}>
                    <Typography variant="h6" className="font-bold text-brand-dark font-sans">
                        Cadastro de Material
                    </Typography>
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={2}>

                            {/* Nome do Produto */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Descrição do Material"
                                    placeholder="Ex: Cimento Portland CP-II"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    {...register('name')}
                                />
                            </Grid>

                            {/* SKU e Categoria */}
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="SKU / Código"
                                    placeholder="MAT-000"
                                    fullWidth
                                    error={!!errors.sku}
                                    helperText={errors.sku?.message}
                                    {...register('sku')}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    select
                                    label="Categoria"
                                    fullWidth
                                    defaultValue=""
                                    error={!!errors.category}
                                    helperText={errors.category?.message}
                                    {...register('category')}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Quantidade e Unidade */}
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="Quantidade Inicial"
                                    type="number"
                                    fullWidth
                                    error={!!errors.quantity}
                                    helperText={errors.quantity?.message}
                                    {...register('quantity')}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    select
                                    label="Unidade"
                                    fullWidth
                                    defaultValue=""
                                    error={!!errors.unit}
                                    helperText={errors.unit?.message}
                                    {...register('unit')}
                                >
                                    {UNITS.map((u) => (
                                        <MenuItem key={u} value={u}>{u}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Nível Mínimo */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Estoque Mínimo (Alerta)"
                                    type="number"
                                    fullWidth
                                    helperText="O sistema avisará quando o estoque estiver abaixo deste valor"
                                    error={!!errors.minLevel}
                                    {...register('minLevel')}
                                />
                            </Grid>

                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, borderTop: '1px solid #E5E7EB' }}>
                        <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 'bold' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                fontWeight: 'bold',
                                boxShadow: 'none'
                            }}
                        >
                            {isSubmitting ? 'Salvando...' : 'Cadastrar Item'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* FEEDBACK (TOAST) */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={toast.severity} variant="filled" onClose={() => setToast({ ...toast, open: false })}>
                    {toast.message}
                </Alert>
            </Snackbar>

        </div>
    );
}