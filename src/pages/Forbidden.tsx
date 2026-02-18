import { Button, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-concrete-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border-l-8 border-brand-accent shadow-2xl p-8 md:p-12 text-center">

                <div className="inline-flex p-4 bg-amber-50 rounded-full mb-6">
                    <WarningAmberIcon sx={{ fontSize: 60, color: '#D97706' }} />
                </div>

                <Typography variant="h3" className="font-bold text-brand-dark mb-2 font-sans tracking-tighter">
                    403
                </Typography>

                <Typography variant="h5" className="font-bold text-concrete-800 mb-4 uppercase tracking-widest text-sm">
                    Acesso Restrito
                </Typography>

                <Typography className="text-concrete-500 mb-8">
                    Você não possui as credenciais de segurança necessárias para acessar esta área (Nível ADMIN requerido).
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/produtos')}
                    sx={{
                        borderColor: 'brand.main',
                        color: 'brand.main',
                        fontWeight: 'bold',
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2, bgcolor: 'primary.main', color: 'white' }
                    }}
                >
                    Voltar para Área Segura
                </Button>

                {/* Faixa decorativa estilo "Canteiro de Obras" */}
                <div className="mt-12 h-2 w-full bg-[repeating-linear-gradient(45deg,#000,#000_10px,#FCD34D_10px,#FCD34D_20px)] opacity-20"></div>
            </div>
        </div>
    );
}