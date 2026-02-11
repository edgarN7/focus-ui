import { createTheme } from '@mui/material/styles';

// Definição da Paleta "Fromtheos Boutique"
const theme = createTheme({
    cssVariables: true, // Habilita variáveis CSS nativas (Performance++)
    palette: {
        mode: 'dark', // Fundo escuro por padrão
        primary: {
            main: '#D4AF37', // Dourado (Gold)
            light: '#F4D06F',
            dark: '#A38629',
            contrastText: '#000000' // Texto preto sobre dourado para leitura
        },
        secondary: {
            main: '#E0E0E0', // Prata/Cinza claro para elementos secundários
        },
        background: {
            default: '#0A0A0A', // Quase preto (Deep Covenant)
            paper: '#161616', // Ligeiramente mais claro para Cards/Modais
        },
        error: {
            main: '#CF6679', // Vermelho suave (menos agressivo)
        },
        success: {
            main: '#03DAC6', // Verde Teal moderno
        },
        text: {
            primary: '#EAEAEA', // Branco suave (não cansa a vista)
            secondary: '#A0A0A0'
        },
    },

    components: {
        // Customização global dos componentes (Shape & Feel)
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Bordas levemente arredondadas, mas firmes
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundImage: 'none', // Remove o gradiente padrão do modo dark
                    border: '1px solid rgba(255, 255, 255, 0.08)', // Borda sutil de luxo
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default theme;