import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LayoutCrud from './components/LayoutCrud';
import Login from './components/Login';

// Guard: si no hay sesión, manda a login
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas que usan el layout */}
          <Route
            element={
              <RequireAuth>
                <LayoutCrud />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/productos" replace />} />
            <Route path="/productos"  element={<div>Productos</div>} />
            <Route path="/inventario" element={<div>Inventario</div>} />
            <Route path="/usuarios"   element={<div>Usuarios</div>} />
            <Route path="/perfil"     element={<div>Mi perfil</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}