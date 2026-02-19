import { useEffect, useState } from 'react';
import {
    Typography, Button, Chip, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useAuth } from '@/hooks/useAuth';
import { movementService } from '@/services/movementService';
import type { Movement, MovementType } from '@/types/movement';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';

export default function Movements() {
    const { user } = useAuth();
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [productsList, setProductsList] = useState<Product[]>([]);

    const [formType, setFormType] = useState<MovementType>('OUT');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // LÓGICA DE VALIDAÇÃO
    // Encontra o objeto do produto selecionado para ler o estoque dele
    const currentProductObj = productsList.find(p => p.id === selectedProduct);
    const currentStock = currentProductObj?.quantity || 0;
    const qtyNumber = Number(quantity); // Convertemos uma vez para reutilizar

    // Regra 1: Não pode ser 0 ou negativo (se o campo não estiver vazio)
    const isInvalidQuantity = quantity !== '' && qtyNumber <= 0;

    // Regra 2: Na saída, não pode tirar mais do que tem
    const isOverStock = formType === 'OUT' && qtyNumber > currentStock;

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

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => {
        setOpenModal(false);
        setQuantity('');
        setSelectedProduct('');
        setFormType('OUT'); // Reseta para o padrão
    };

    const handleSubmit = async () => {
        if (!selectedProduct || !quantity || isOverStock) return;

        setSubmitting(true);
        try {
            const newMov = await movementService.create({
                productId: selectedProduct,
                productName: currentProductObj?.name || 'Desconhecido',
                type: formType,
                quantity: Number(quantity),
                userName: user?.name || 'Desconhecido'
            });

            setMovements([newMov, ...movements]);

            // Atualiza a lista de produtos localmente para refletir o novo estoque no select
            // (Num app real, faríamos um refetch ou update otimista mais complexo)
            const updatedProducts = productsList.map(p => {
                if (p.id === selectedProduct) {
                    return {
                        ...p,
                        quantity: formType === 'IN'
                            ? p.quantity + Number(quantity)
                            : p.quantity - Number(quantity)
                    };
                }
                return p;
            });
            setProductsList(updatedProducts);

            handleClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handler para mudança de tipo (limpa seleção se ficar inválida)
    const handleTypeChange = (_: any, val: MovementType | null) => {
        if (val) {
            setFormType(val);
            // Se mudou para Saída e o produto selecionado tem estoque 0, limpa a seleção
            if (val === 'OUT' && currentProductObj && currentProductObj.quantity === 0) {
                setSelectedProduct('');
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">

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
                    sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', boxShadow: 'none', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                    REGISTRAR
                </Button>
            </div>

            <div className="bg-white border border-concrete-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center"><CircularProgress sx={{ color: 'brand.main' }} /></div>
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
                                                    borderRadius: 1, fontWeight: 'bold',
                                                    bgcolor: mov.type === 'IN' ? '#ECFDF5' : '#FEF2F2',
                                                    color: mov.type === 'IN' ? '#065F46' : '#991B1B',
                                                    border: '1px solid', borderColor: mov.type === 'IN' ? '#A7F3D0' : '#FECACA'
                                                }}
                                            />
                                        </td>
                                        <td className="p-4 font-bold text-brand-dark text-sm">{mov.productName}</td>
                                        <td className="p-4 text-right font-mono text-sm font-bold text-concrete-800">{mov.quantity}</td>
                                        <td className="p-4 text-sm text-concrete-600">{mov.userName}</td>
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

            {/* MODAL */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ borderBottom: '1px solid #E5E7EB', pb: 2 }}>
                    <Typography variant="h6" className="font-bold text-brand-dark">Nova Movimentação</Typography>
                </DialogTitle>

                <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

                    <div className="flex justify-center mt-4">
                        <ToggleButtonGroup
                            value={formType}
                            exclusive
                            onChange={handleTypeChange}
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
                        {productsList.map((option) => {
                            // LÓGICA DE DESABILITAR: Se for Saída E Estoque for 0
                            const isDisabled = formType === 'OUT' && option.quantity === 0;

                            return (
                                <MenuItem key={option.id} value={option.id} disabled={isDisabled}>
                                    <div className="flex justify-between w-full">
                                        <span>{option.name}</span>
                                        <span className={`text-xs font-mono ${isDisabled ? 'text-red-400' : 'text-gray-500'}`}>
                                            {isDisabled ? 'SEM ESTOQUE' : `Qtd: ${option.quantity}`}
                                        </span>
                                    </div>
                                </MenuItem>
                            );
                        })}
                    </TextField>

                    <TextField
                        label="Quantidade"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        fullWidth
                        placeholder="0"
                        // Fica vermelho se: Passou do estoque OU Quantidade inválida (<= 0)
                        error={isOverStock || isInvalidQuantity}
                        helperText={
                            isOverStock
                                ? `Erro: Estoque atual é apenas ${currentStock}`
                                : isInvalidQuantity
                                    ? 'A quantidade deve ser maior que 0'
                                    : (currentProductObj ? `Disponível: ${currentProductObj.quantity}` : '')
                        }
                    />

                </DialogContent>

                <DialogActions sx={{ p: 3, borderTop: '1px solid #E5E7EB' }}>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        // Bloqueia se: ... OU Quantidade for inválida (<= 0)
                        disabled={submitting || !selectedProduct || !quantity || isOverStock || isInvalidQuantity}
                        sx={{
                            bgcolor: formType === 'IN' ? 'success.main' : 'error.main',
                            color: 'white', fontWeight: 'bold',
                            '&:hover': { bgcolor: formType === 'IN' ? 'success.dark' : 'error.dark' }
                        }}
                    >
                        {submitting ? 'Salvando...' : `Confirmar ${formType === 'IN' ? 'Entrada' : 'Saída'}`}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}