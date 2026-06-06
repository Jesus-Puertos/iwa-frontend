import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { login as loginRequest } from '../auth/AuthApi';
import { ApiError } from '../api/client';


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [signingIn, setSigningIn] = useState(false);
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [error, setError]         = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setError('');
    setSigningIn(true);
    try {
      const { token, user } = await loginRequest(username.trim(), password);
      login(token, user);          // guarda en el contexto
      navigate('/productos');      // entra al dashboard
    } catch (err) {
      if (err instanceof ApiError && err.status === 501) {
        setError('El servidor de autenticación no está disponible (501). Avisa a los organizadores.');
      } else if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError('No se pudo conectar con el servidor.');
      }
      setSigningIn(false);
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">

      {/* ── Panel izquierdo naranja (oculto en mobile) ── */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-linear-to-br from-[#ff8200] via-[#f07000] to-[#c85000] p-12 lg:flex">

        <div className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

        <img src="/escudo.png" alt="" aria-hidden="true"
          className="pointer-events-none absolute -right-10 bottom-0 h-3/4 w-auto object-contain opacity-[0.07]" />

        <div className="relative">
          <img src="/imagotipo.png" alt="Crud de Gestion de Inventarios Logo" className="h-10 object-contain brightness-0 invert" />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            CRUD DE GESTION DE INVENTARIOS
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white">
            Portal del<br />Colaborador
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Bienvenido al Portal del Colaborador.
          </p>
        </div>

        <p className="relative text-[10px] font-semibold text-white/30">
            Hackathon IWA 2026 - Jesus Alberto Rodriguez Puertos
        </p>
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div className="flex w-full flex-col items-center justify-center bg-[#f8f9fb] px-6 py-12 lg:w-1/2">

        <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
          <img src="/imagotipo.png" alt="Crud de Gestion de Inventarios Logo" className="h-10 object-contain" />
          <div className="h-px w-12 bg-[#ff8200]/40" />
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">CRUD DE GESTION DE INVENTARIOS</p>
            <p className="mt-0.5 text-xl font-black text-slate-900">Portal del Colaborador</p>
          </div>
        </div>

        <div className="w-full max-w-sm">

          <div className="hidden lg:block mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff8200]">Bienvenido</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Inicia sesión</h2>
            <p className="mt-1 text-sm text-slate-500">Acceso exclusivo para colaboradores</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Usuario"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ff8200] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8200]/20"
              />
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Contraseña"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ff8200] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8200]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={signingIn || !username.trim() || !password}
                className="mt-1 w-full rounded-xl bg-[#ff8200] py-3 text-sm font-bold text-white transition hover:bg-[#e67300] disabled:opacity-50"
              >
                {signingIn ? 'Accediendo…' : 'Acceder'}
              </button>
            </form>

            <p className="mt-5 text-center text-[10px] text-slate-400">
              Exclusivo para el uso del Hackathon IWA 2026. Si tienes problemas para iniciar sesión, contacta a los organizadores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}