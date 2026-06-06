import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../Auth/AuthContext';
import { getProducts, type Product } from '../api/products';

const PAGE_SIZE = 20;

export default function Productos() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canCreate = user?.role === 'ADMIN';
  const canEdit   = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canDelete = user?.role === 'ADMIN';

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    setLoading(true);
    getProducts(pageNumber, PAGE_SIZE)
      .then(res => {
        setProducts(res.data.content);
        setTotal(res.totalElements);
      })
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false));
  }, [pageNumber]);

  const money = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#b35300]">
            <Package className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900">Productos</h1>
            <p className="text-xs text-slate-400">{total} registros</p>
          </div>
        </div>
        {canCreate && (
          <button className="flex items-center gap-2 rounded-xl bg-[#ff8200] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#e67300]">
            <Plus className="h-4 w-4" /> Nuevo producto
          </button>
        )}
      </div>

      {loading && <p className="py-12 text-center text-sm text-slate-400">Cargando…</p>}
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Descripción</th>
                  <th className="px-5 py-3 text-right">Precio</th>
                  {(canEdit || canDelete) && <th className="px-5 py-3 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map(p => (
                  <tr key={p.id} className="transition hover:bg-orange-50/30">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                    <td className="px-5 py-3 font-semibold text-slate-700">{p.name}</td>
                    <td className="px-5 py-3 text-slate-400">{p.description ?? '—'}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700">{money(p.price)}</td>
                    {(canEdit || canDelete) && (
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          {canEdit && (
                            <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-orange-100 hover:text-[#b35300]" title="Editar">
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-100 hover:text-red-600" title="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">Sin productos.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Página {pageNumber + 1} de {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPageNumber(n => Math.max(0, n - 1))}
                disabled={pageNumber === 0}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <button
                onClick={() => setPageNumber(n => (n + 1 < totalPages ? n + 1 : n))}
                disabled={pageNumber + 1 >= totalPages}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}