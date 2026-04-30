"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const NavContent = () => (
    <>
      <div className="p-5 border-b border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 group"
          onClick={() => setMobileOpen(false)}
        >
          <Store size={18} className="text-gray-400 group-hover:text-white transition-colors" />
          <span className="font-bold text-base tracking-tight">
            BLEE<span className="text-gray-400">STORE</span>
          </span>
        </Link>
        <p className="text-xs text-gray-500 mt-1">Panel de administración</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 min-h-screen bg-black text-white flex-col shrink-0">
        <NavContent />
      </aside>

      {/* Header móvil */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black text-white flex items-center justify-between px-4 h-14 border-b border-white/10">
        <span className="font-bold text-base tracking-tight">
          BLEE<span className="text-gray-400">STORE</span>
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Menú"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Drawer móvil */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-14 bottom-0 w-64 bg-black text-white flex flex-col shadow-2xl">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
