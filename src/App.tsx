import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Movements from '@/pages/Movements';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rotas Protegidas */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/movimentacoes" element={<Movements />} />

          {/* Placeholders para as outras rotas (para não quebrar o menu) */}
          <Route path="/usuarios" element={<div>Gestão de Equipe (Em construção)</div>} />
        </Route>

        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;