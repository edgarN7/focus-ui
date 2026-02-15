/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta "Carvalho Engenharia"
                brand: {
                    DEFAULT: '#0F4C3A', // Forest Green (Primary)
                    dark: '#023020',    // Deepest Green (Sidebar/Contrast)
                    light: '#1B6B55',   // Hover state
                    accent: '#D4AF37',  // Mantemos um toque sutil de dourado para "Premium" se necessário, ou removemos.
                },
                concrete: {
                    50: '#F9FAFB',
                    100: '#F3F4F6', // Background principal
                    200: '#E5E7EB', // Bordas sutis
                    300: '#D1D5DB', // Bordas fortes (Steel)
                    800: '#1F2937', // Texto principal
                    900: '#111827', // Títulos
                },
                status: {
                    success: '#059669', // Verde Engenharia
                    error: '#B91C1C',   // Vermelho Tijolo (Brick Red)
                    warning: '#D97706', // Laranja Capacete
                }
            },
            fontFamily: {
                sans: ['Manrope', 'Inter', 'sans-serif'], // Títulos e Corpo
                mono: ['JetBrains Mono', 'monospace'],     // Dados técnicos
            },
            borderRadius: {
                // Sobrescrevemos o padrão para ser "Micro-Rounded" (2px) ou Quadrado
                DEFAULT: '2px',
                'md': '4px',
                'lg': '0px', // Cards grandes devem ser quadrados
                'xl': '0px',
                '2xl': '0px',
            },
            boxShadow: {
                // Sombras duras (Hard Shadows) para parecer desenho técnico
                'technical': '4px 4px 0px 0px rgba(0, 0, 0, 0.1)',
                'technical-hover': '6px 6px 0px 0px rgba(15, 76, 58, 0.2)',
            }
        },
    },
    plugins: [],
}