import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    InputAdornment
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// 1. Schema de Validação (Regras do Jogo)
const loginSchema = z.object({
    email: z.string().email('Formato de e-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    // Simulação de Login (Substituiremos pela API real depois)
    const onSubmit = async (data: LoginFormInputs) => {
        console.log('Tentativa de Login:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake delay
        alert('Login simulado com sucesso! (Verifique o Console)');
    };

    return (
        <Card sx={{ backdropFilter: 'blur(10px)', bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Header do Card */}
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 1.5,
                            borderRadius: '50%',
                            bgcolor: 'rgba(212, 175, 55, 0.1)', // Dourado translúcido
                            mb: 2
                        }}
                    >
                        <WarehouseIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h4" component={"h1"} fontWeight={"bold"} color="text.primary">
                        Focus UI
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gestão de Estoque & RBAC
                    </Typography>
                </Box>

                {/* Formulário */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <TextField
                        label="E-mail Corporativo"
                        placeholder="admin@focus.ui"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register('email')}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        label="Senha"
                        type="password"
                        placeholder="••••••"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register('password')}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isSubmitting}
                        sx={{ mt: 1, height: 48, fontSize: '1rem' }}
                    >
                        {isSubmitting ? 'Acessando...' : 'Entrar no Sistema'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}