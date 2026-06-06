import { apiFetch, ApiError } from '../api/client';
import type { AuthUser, Role } from './AuthContext';


const DEMO_MODE = true;

const DEMO_USERS: Record<string, AuthUser> = {
  admin:    { username: 'admin',    role: 'ADMIN' },
  gerente:  { username: 'gerente',  role: 'MANAGER' },
  empleado: { username: 'empleado', role: 'EMPLOYEE' },
};


interface LoginResponse {
  token: string;
  username?: string;
  role?: Role;
}

// Decodifica el payload de un JWT sin librerías (solo LEE, no valida la firma;
// la validación real la hace el backend en cada request).
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function login(
  username: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> {
  // ── Camino demo ──
  if (DEMO_MODE) {
    const user = DEMO_USERS[username.trim().toLowerCase()];
    if (!user) {
      throw new ApiError(401, 'Usuario demo no válido (usa: admin, gerente o empleado).');
    }
    return { token: 'demo-token-' + user.role, user };
  }

  // ── Camino real (cuando DEMO_MODE = false) ──
  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  const claims = decodeJwt(data.token) ?? {};
  const user: AuthUser = {
    username: data.username ?? (claims.sub as string) ?? username,
    role: (data.role ?? (claims.role as Role) ?? (claims.authorities as Role)) as Role,
  };

  return { token: data.token, user };
}