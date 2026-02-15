import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Button,
    TextField,
    InputAdornment,
    Alert,
    CircularProgress,
    Typography
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha requer 6+ caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loginError, setLoginError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setLoginError(null);
        try {
            await login(data.email, data.password);
            if (data.email.includes('admin')) {
                navigate('/dashboard');
            } else {
                navigate('/produtos');
            }
        } catch (err: any) {
            setLoginError(err.message || 'Acesso negado.');
        }
    };

    return (
        // LAYOUT SPLIT SCREEN (50/50 em Desktop)
        <div className="min-h-screen w-full flex flex-col lg:flex-row">

            {/* LADO ESQUERDO: Marca & Identidade (Verde Carvalho) */}
            <div className="lg:w-1/2 bg-blueprint flex flex-col items-center justify-center p-12 text-white relative overflow-hidden">
                {/* Elemento decorativo: Círculo técnico */}
                <div className="absolute top-0 left-0 w-full h-full border-[20px] border-white/5 rounded-full scale-150 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                <div className="z-10 text-center">
                    <div className="inline-flex p-6 border-2 border-white/20 mb-8 bg-white/5 backdrop-blur-sm">
                        <BusinessIcon sx={{ fontSize: 64, color: '#FFFFFF' }} />
                    </div>
                    <Typography variant="h2" component="h1" sx={{ fontFamily: 'Manrope', letterSpacing: '-0.03em', mb: 2 }}>
                        CARVALHO
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'Manrope', fontWeight: 400, opacity: 0.8, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Engenharia & Arquitetura
                    </Typography>

                    <div className="mt-12 pt-12 border-t border-white/10 w-64 mx-auto">
                        <p className="font-mono text-xs opacity-60">
                            EST. 2026 • SYSTEM v1.0
                        </p>
                    </div>
                </div>
            </div>

            {/* LADO DIREITO: Formulário (Concreto/Branco) */}
            <div className="lg:w-1/2 bg-concrete-50 flex items-center justify-center p-8 lg:p-24">
                <div className="w-full max-w-sm">

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-concrete-900 mb-2 font-sans">
                            Acesso Restrito
                        </h2>
                        <p className="text-concrete-800/60 text-sm">
                            Entre com suas credenciais corporativas.
                        </p>
                    </div>

                    {loginError && (
                        <Alert severity="error" className="mb-6 rounded-none border border-red-200">
                            {loginError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                        <TextField
                            label="ID Corporativo / E-mail"
                            fullWidth
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...register('email')}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon className="text-concrete-300" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <TextField
                            label="Chave de Acesso"
                            type="password"
                            fullWidth
                            variant="outlined"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            {...register('password')}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon className="text-concrete-300" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <div className="h-4"></div> {/* Spacer */}

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{ height: 56 }} // Botão alto e robusto
                        >
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'INICIAR SESSÃO'}
                        </Button>

                        <div className="mt-6 text-center">
                            <a href="#" className="text-sm text-brand hover:text-brand-dark font-semibold underline decoration-2 underline-offset-4">
                                Esqueceu suas credenciais?
                            </a>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    );
}