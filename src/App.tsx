import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

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

          {/* Placeholders para as outras rotas (para não quebrar o menu) */}
          <Route path="/produtos" element={<div>Página de Produtos (Em construção)</div>} />
          <Route path="/movimentacoes" element={<div>Página de Movimentações (Em construção)</div>} />
          <Route path="/usuarios" element={<div>Gestão de Equipe (Em construção)</div>} />
        </Route>

        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;