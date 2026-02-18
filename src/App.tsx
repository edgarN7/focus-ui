import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import RoleGuard from '@/routes/RoleGuard';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Movements from '@/pages/Movements';
import Users from '@/pages/Users';
import Forbidden from '@/pages/Forbidden';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/403" element={<Forbidden />} /> {/* Rota de Erro */}
        </Route>

        {/* Rotas Protegidas */}
        <Route element={<MainLayout />}>

          {/* Rotas Acessíveis por ADMIN e OPERATOR */}
          <Route element={<RoleGuard allowedRoles={['ADMIN', 'OPERATOR']} />}>
            <Route path="/produtos" element={<Products />} />
            <Route path="/movimentacoes" element={<Movements />} />
          </Route>

          {/* Rotas EXCLUSIVAS de ADMIN */}
          <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Users />} />
          </Route>

        </Route>

        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch all para 404 - opcional, pode mandar pro login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;