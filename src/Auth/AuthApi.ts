import { apiFetch } from '../api/client';
import type { AuthUser, Role } from './AuthContext';

interface LoginResponse {
  // Ajusta estos nombres cuando confirmemos el LoginResource real del backend.
  token: string;
  username?: string;
  role?: Role;
}

// Decodifica el payload de un JWT sin librerías (solo lee, no valida la firma).
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function login(username: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  // Primero confiamos en lo que devuelva el backend; si no trae rol/username,
  // lo sacamos del propio JWT.
  const claims = decodeJwt(data.token) ?? {};
  const user: AuthUser = {
    username: data.username ?? (claims.sub as string) ?? username,
    role: (data.role ?? (claims.role as Role) ?? (claims.authorities as Role)) as Role,
  };

  return { token: data.token, user };
}