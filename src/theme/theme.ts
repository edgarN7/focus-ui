import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light', // LIGHT (Papel/Concreto)
        primary: {
            main: '#0F4C3A', // Carvalho Green
            dark: '#023020',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#1F2937', // Concrete Dark
        },
        background: {
            default: '#F3F4F6', // Concrete 100
            paper: '#FFFFFF',
        },
        text: {
            primary: '#111827', // Quase preto
            secondary: '#4B5563', // Cinza médio
        },
        error: {
            main: '#B91C1C', // Brick Red
        },
    },
    typography: {
        fontFamily: '"Manrope", "Inter", sans-serif',
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.01em' },
        button: {
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 600,
            letterSpacing: '0.05em', // Tracking wide para elegância técnica
            textTransform: 'uppercase'
        },
    },
    shape: {
        borderRadius: 2, // 2px (Micro-rounded)
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0, // Botões quadrados
                    boxShadow: 'none',
                    border: '1px solid transparent',
                    '&:hover': {
                        boxShadow: 'none',
                        borderColor: 'currentColor', // Efeito técnico no hover
                    },
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#023020', // Darkest Green
                    }
                }
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 0, // Inputs quadrados
                        backgroundColor: '#FFFFFF',
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    border: '1px solid #E5E7EB', // Borda fina
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.05)', // Sombra técnica sutil
                },
            },
        },
    },
});

export default theme;