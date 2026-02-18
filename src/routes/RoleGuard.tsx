import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/auth';

interface RoleGuardProps {
    allowedRoles: UserRole[];
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null; // Ou um spinner
    }

    if (!user || !allowedRoles.includes(user.role)) {
        // Se não estiver logado ou não tiver a role, manda para o 403
        return <Navigate to="/403" replace />;
    }

    // Se passou, renderiza a rota filha
    return <Outlet />;
}