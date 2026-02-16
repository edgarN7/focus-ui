import { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Saída
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Entrada
import HistoryIcon from '@mui/icons-material/History';

import { useAuth } from '@/hooks/useAuth';
import { movementService } from '@/services/movementService';
import type { Movement, MovementType } from '@/types/movement';
import { productService } from '@/services/productService'; // Para listar produtos no select
import type { Product } from '@/types/product';

export default function Movements() {
    const { user } = useAuth();
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados do Modal
    const [openModal, setOpenModal] = useState(false);
    const [productsList, setProductsList] = useState<Product[]>([]);

    // Formulário do Modal
    const [formType, setFormType] = useState<MovementType>('OUT');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Carregar Dados Iniciais
    useEffect(() => {
        const init = async () => {
            try {
                const [movData, prodData] = await Promise.all([
                    movementService.getHistory(),
                    productService.getAll()
                ]);
                setMovements(movData);
                setProductsList(prodData);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Handlers
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => {
        setOpenModal(false);
        setQuantity('');
        setSelectedProduct('');
    };

    const handleSubmit = async () => {
        if (!selectedProduct || !quantity) return;

        setSubmitting(true);
        try {
            const product = productsList.find(p => p.id === selectedProduct);
            const newMov = await movementService.create({
                productId: selectedProduct,
                productName: product?.name || 'Desconhecido',
                type: formType,
                quantity: Number(quantity),
                userName: user?.name || 'Desconhecido'
            });

            // Atualiza a lista localmente (Optimistic UI simplificado)
            setMovements([newMov, ...movements]);
            handleClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Typography variant="h4" className="text-brand-dark font-bold font-sans tracking-tight">
                        Movimentações
                    </Typography>
                    <Typography variant="body2" className="text-concrete-600 mt-1">
                        Registro de entradas e saídas de materiais.
                    </Typography>
                </div>

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
                    REGISTRAR
                </Button>
            </div>

            {/* Tabela de Histórico */}
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
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Tipo</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Produto</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-right">Qtd.</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider">Responsável</th>
                                    <th className="p-4 text-xs font-bold text-concrete-500 uppercase tracking-wider text-right">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-concrete-100">
                                {movements.map((mov) => (
                                    <tr key={mov.id} className="hover:bg-concrete-50 transition-colors">
                                        <td className="p-4">
                                            <Chip
                                                icon={mov.type === 'IN' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                                label={mov.type === 'IN' ? 'ENTRADA' : 'SAÍDA'}
                                                size="small"
                                                sx={{
                                                    borderRadius: 1,
                                                    fontWeight: 'bold',
                                                    bgcolor: mov.type === 'IN' ? '#ECFDF5' : '#FEF2F2', // Verde Claro vs Vermelho Claro
                                                    color: mov.type === 'IN' ? '#065F46' : '#991B1B',   // Verde Escuro vs Vermelho Escuro
                                                    border: '1px solid',
                                                    borderColor: mov.type === 'IN' ? '#A7F3D0' : '#FECACA'
                                                }}
                                            />
                                        </td>
                                        <td className="p-4 font-bold text-brand-dark text-sm">
                                            {mov.productName}
                                        </td>
                                        <td className="p-4 text-right font-mono text-sm font-bold text-concrete-800">
                                            {mov.quantity}
                                        </td>
                                        <td className="p-4 text-sm text-concrete-600">
                                            {mov.userName}
                                        </td>
                                        <td className="p-4 text-right text-xs text-concrete-500 font-mono">
                                            {new Date(mov.date).toLocaleDateString()} <span className="opacity-50">{new Date(mov.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL DE REGISTRO */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ borderBottom: '1px solid #E5E7EB', pb: 2 }}>
                    <Typography variant="h6" className="font-bold text-brand-dark">
                        Nova Movimentação
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Toggle Entrada/Saída */}
                    <div className="flex justify-center mt-4">
                        <ToggleButtonGroup
                            value={formType}
                            exclusive
                            onChange={(_, val) => val && setFormType(val)}
                            aria-label="Tipo de Movimentação"
                            fullWidth
                        >
                            <ToggleButton value="IN" sx={{ '&.Mui-selected': { bgcolor: '#ECFDF5', color: '#065F46', borderColor: '#065F46' } }}>
                                <ArrowDownwardIcon sx={{ mr: 1 }} /> Entrada
                            </ToggleButton>
                            <ToggleButton value="OUT" sx={{ '&.Mui-selected': { bgcolor: '#FEF2F2', color: '#991B1B', borderColor: '#991B1B' } }}>
                                <ArrowUpwardIcon sx={{ mr: 1 }} /> Saída
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    <TextField
                        select
                        label="Produto"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        fullWidth
                    >
                        {productsList.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name} (Atual: {option.quantity})
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Quantidade"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        fullWidth
                        placeholder="0"
                    />

                </DialogContent>

                <DialogActions sx={{ p: 3, borderTop: '1px solid #E5E7EB' }}>
                    <Button onClick={handleClose} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitting || !selectedProduct || !quantity}
                        sx={{
                            bgcolor: formType === 'IN' ? 'success.main' : 'error.main',
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: formType === 'IN' ? 'success.dark' : 'error.dark',
                            }
                        }}
                    >
                        {submitting ? 'Salvando...' : `Confirmar ${formType === 'IN' ? 'Entrada' : 'Saída'}`}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}