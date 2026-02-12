import { Outlet } from 'react-router-dom';
import { Box, Container } from "@mui/material";

export default function AuthLayout() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Container maxWidth='xs'>
                {/* O Outlet é onde a página de Login será renderizada */}
                <Outlet />
            </Container>
        </Box>
    );
}