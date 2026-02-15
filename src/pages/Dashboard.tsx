import { Typography, Grid, Paper } from '@mui/material';

export default function Dashboard() {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <Typography variant="h4" className="text-brand-dark font-bold mb-1">
                    Painel de Controle
                </Typography>
                <Typography variant="body2" className="text-concrete-600">
                    Métricas e indicadores de performance da obra.
                </Typography>
            </div>

            {/* Grid de KPIs (Exemplo Visual) */}
            <Grid container spacing={3}>
                {[1, 2, 3, 4].map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid #E5E7EB',
                                borderRadius: 0,
                                borderLeft: '4px solid #0F4C3A' // Detalhe técnico
                            }}
                        >
                            <Typography variant="caption" className="text-concrete-500 uppercase tracking-wider font-bold">
                                Total de Itens
                            </Typography>
                            <Typography variant="h4" className="text-brand-dark font-mono mt-2 font-bold">
                                1,240
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}