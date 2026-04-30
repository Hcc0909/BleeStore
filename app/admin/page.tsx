import { createClient } from "@/lib/supabase/server";
import { Package, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const supabase = await createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("id, category"),
    supabase.from("categories").select("name, slug, section").eq("is_active", true).order("sort_order"),
  ]);

  const total = products?.length ?? 0;

  // Agrupar conteo por slug de categoría
  const byCat = new Map<string, number>();
  products?.forEach((p) => {
    byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1);
  });

  return { total, byCat, categories: categories ?? [] };
}

export default async function AdminDashboard() {
  const { total, byCat, categories } = await getStats();

  const perfumes = categories.filter((c) => c.section === "perfume");
  const ropa = categories.filter((c) => c.section !== "perfume");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenido al panel de administración de BleeStore
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total productos
          </p>
          <p className="text-3xl font-bold text-black">{total}</p>
        </div>
        {categories.slice(0, 3).map((cat) => (
          <div key={cat.slug} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 truncate">
              {cat.name}
            </p>
            <p className="text-3xl font-bold text-black">{byCat.get(cat.slug) ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Acciones rápidas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-4 bg-black text-white rounded-2xl p-5 hover:bg-gray-800 transition-colors group"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Package size={20} />
          </div>
          <div>
            <p className="font-semibold">Nuevo producto</p>
            <p className="text-xs text-gray-400">Agregar a la tienda</p>
          </div>
        </Link>

        <Link
          href="/admin/configuracion"
          className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Settings size={20} className="text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Configuración</p>
            <p className="text-xs text-gray-500">Categorías, contacto, alerta</p>
          </div>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <ExternalLink size={20} className="text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Ver tienda</p>
            <p className="text-xs text-gray-500">Abrir vista del cliente</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
