import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import IntranetPageLayout from './components/LayoutCrud';

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
          <Route path="/login" element={<div>Login (pendiente)</div>} />

          {/* Rutas protegidas que usan el layout */}
          <Route
            element={
              <RequireAuth>
                <IntranetPageLayout />
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