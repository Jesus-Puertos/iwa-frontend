import { createContext, useContext, useState, type ReactNode } from 'react';
import { setAuthToken } from '../api/client';

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface AuthUser {
  username: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  function login(newToken: string, newUser: AuthUser) {
      setAuthToken(newToken);   // ← añade esta línea

    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
      setAuthToken(null);       // ← y esta

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}