import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, CircleUser, ChevronDown, Package, Boxes, Users } from 'lucide-react';
import { useAuth, type Role } from '../auth/AuthContext';

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  EMPLOYEE: 'Empleado',
};

// Menú con los roles que pueden ver cada item (según el README del backend)
const NAV = [
  { to: '/productos',  label: 'Productos',  icon: Package, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] as Role[] },
  { to: '/inventario', label: 'Inventario', icon: Boxes,   roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] as Role[] },
  { to: '/usuarios',   label: 'Usuarios',   icon: Users,   roles: ['ADMIN'] as Role[] },
];

export default function IntranetPageLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Si no hay usuario, no renderizamos el layout (la ruta protegida lo manejará)
  if (!user) return null;

  const visibleNav = NAV.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-[#f0f2f5]">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-orange-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/assets/logos/escudo.webp" alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
            <div className="hidden sm:block">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-400">
                H. Ayuntamiento de Zongolica
              </p>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-700">
                Intranet Municipal
              </p>
            </div>
          </div>

          {/* Navegación por rol (desktop) */}
          <nav className="hidden items-center gap-1 md:flex">
            {visibleNav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => [
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition',
                  isActive
                    ? 'bg-orange-50 text-[#c2440f]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                ].join(' ')}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Profile pill dropdown */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className={[
                'hidden sm:flex items-center gap-2.5 rounded-full border px-2.5 py-1.5 transition',
                open
                  ? 'border-[#ff8200]/40 bg-orange-50'
                  : 'border-slate-200 bg-slate-50 hover:border-[#ff8200]/30 hover:bg-orange-50/50',
              ].join(' ')}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-black text-[#b35300]">
                {initials(user.username)}
              </span>
              <div className="min-w-0 pr-0.5 text-left">
                <p className="max-w-36 truncate text-[11px] font-semibold leading-none text-slate-700">{user.username}</p>
                <p className="mt-0.5 max-w-36 truncate text-[10px] leading-none text-slate-400">{ROLE_LABEL[user.role]}</p>
              </div>
              <ChevronDown className={['h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform duration-150', open ? 'rotate-180' : ''].join(' ')} />
            </button>

            {/* Mobile: solo avatar */}
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 sm:hidden"
            >
              <span className="text-[10px] font-black text-[#b35300]">{initials(user.username)}</span>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {/* Navegación también en el dropdown para móvil */}
                <div className="md:hidden">
                  {visibleNav.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-[#c2440f]"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[#ff8200]" />
                      {label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-slate-100" />
                </div>
                <Link
                  to="/perfil"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-[#c2440f]"
                >
                  <CircleUser className="h-4 w-4 shrink-0 text-[#ff8200]" />
                  Mi perfil
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page content — aquí se renderizan las páginas hijas */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-[11px] text-slate-400">
        Crud de Hackathon IWA · Sistema de inventarios · 2026 Jesus Alberto Rodriguez Puertos
      </footer>
    </div>
  );
}