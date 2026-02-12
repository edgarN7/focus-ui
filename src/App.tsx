import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas (Layout de Autenticação) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Redirecionamento padrão: Raiz vai para Login por enquanto */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Futuras rotas protegidas virão aqui... */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;