const BASE_URL = 'http://localhost:8081/hackathon';

// El token se mantiene en memoria; el AuthContext lo inyecta aquí tras el login.
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (authToken) headers.set('Authorization', `Bearer ${authToken}`);

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // 401/403: el backend rechaza por falta o invalidez de credenciales/permisos.
  // (Ojo: este backend responde 403 cuando falta el token, no 401.)
  if (res.status === 401 || res.status === 403) {
    throw new ApiError(res.status, res.status === 403 ? 'Sin permiso para esta acción.' : 'No autorizado.');
  }

  if (!res.ok) {
    // Intenta leer un mensaje de error del cuerpo; si no, usa el status.
    let msg = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch { /* cuerpo vacío o no-JSON */ }
    throw new ApiError(res.status, msg);
  }

  // 204 No Content (típico en DELETE)
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}