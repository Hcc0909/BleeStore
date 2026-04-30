"use client";

import { cn } from "@/lib/utils";
import { CategoryDB } from "@/lib/types/database";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  categories: CategoryDB[];
}

const STATIC_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar({ categories }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const perfumes = categories.filter((c) => c.section === "perfume");
  const ropa = categories.filter((c) => c.section === "ropa");
  const general = categories.filter((c) => c.section === "general");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  function isActive(section: string) {
    return pathname.startsWith(`/${section}`) || pathname.startsWith(`/categoria/`);
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg sm:text-xl tracking-tight text-black shrink-0">
          BLEE<span className="text-gray-300">STORE</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/" ? "text-black" : "text-gray-500 hover:text-black"
            )}
          >
            Inicio
          </Link>

          {/* Perfumes dropdown */}
          {perfumes.length > 0 && (
            <div className="relative group">
              <button className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors",
                isActive("perfume") || perfumes.some(c => pathname.includes(c.slug))
                  ? "text-black" : "text-gray-500 hover:text-black"
              )}>
                Perfumes <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 py-2 min-w-[180px]">
                  {perfumes.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categoria/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ropa dropdown */}
          {ropa.length > 0 && (
            <div className="relative group">
              <button className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors",
                ropa.some(c => pathname.includes(c.slug)) ? "text-black" : "text-gray-500 hover:text-black"
              )}>
                Ropa <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 py-2 min-w-[180px]">
                  {ropa.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categoria/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Artículos generales */}
          {general.length > 0 && (
            <div className="relative group">
              <button className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors",
                general.some(c => pathname.includes(c.slug)) ? "text-black" : "text-gray-500 hover:text-black"
              )}>
                Artículos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 py-2 min-w-[180px]">
                  {general.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categoria/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Link
            href="/contacto"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/contacto" ? "text-black" : "text-gray-500 hover:text-black"
            )}
          >
            Contacto
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Búsqueda desktop */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-48 lg:w-64 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              />
              <button type="submit" className="p-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                <Search size={16} />
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                <X size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-black"
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>
          )}

          {/* Botones móvil */}
          <button
            onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
            className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
            aria-label="Buscar"
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
            aria-label="Menú"
          >
            <span className={cn("block w-5 h-0.5 bg-black transition-all mb-1", menuOpen && "rotate-45 translate-y-1.5")} />
            <span className={cn("block w-5 h-0.5 bg-black transition-all mb-1", menuOpen && "opacity-0")} />
            <span className={cn("block w-5 h-0.5 bg-black transition-all", menuOpen && "-rotate-45 -translate-y-1.5")} />
          </button>
        </div>
      </nav>

      {/* Barra de búsqueda móvil */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-gray-100 bg-white/95">
          <form onSubmit={handleSearch} className="flex gap-2 pt-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              autoFocus
              className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black"
            />
            <button type="submit" className="px-4 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
              Ir
            </button>
          </form>
        </div>
      )}

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 max-h-[70vh] overflow-y-auto">
          <Link href="/" onClick={() => setMenuOpen(false)}
            className={cn("block py-3 text-sm font-semibold border-b border-gray-50", pathname === "/" ? "text-black" : "text-gray-600")}>
            Inicio
          </Link>

          {perfumes.length > 0 && (
            <div className="border-b border-gray-50">
              <p className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Perfumes</p>
              {perfumes.map((cat) => (
                <Link key={cat.slug} href={`/categoria/${cat.slug}`} onClick={() => setMenuOpen(false)}
                  className="block py-2.5 pl-3 text-sm text-gray-600 hover:text-black transition-colors">
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {ropa.length > 0 && (
            <div className="border-b border-gray-50">
              <p className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Ropa</p>
              {ropa.map((cat) => (
                <Link key={cat.slug} href={`/categoria/${cat.slug}`} onClick={() => setMenuOpen(false)}
                  className="block py-2.5 pl-3 text-sm text-gray-600 hover:text-black transition-colors">
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {general.length > 0 && (
            <div className="border-b border-gray-50">
              <p className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Artículos</p>
              {general.map((cat) => (
                <Link key={cat.slug} href={`/categoria/${cat.slug}`} onClick={() => setMenuOpen(false)}
                  className="block py-2.5 pl-3 text-sm text-gray-600 hover:text-black transition-colors">
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <Link href="/contacto" onClick={() => setMenuOpen(false)}
            className={cn("block py-3 text-sm font-semibold", pathname === "/contacto" ? "text-black" : "text-gray-600")}>
            Contacto
          </Link>
        </div>
      )}
    </header>
  );
}
