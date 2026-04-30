import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-bold text-xl tracking-tight">
              BLEE<span className="text-gray-400">STORE</span>
            </span>
            <p className="text-gray-400 text-sm mt-1">
              Perfumes y moda que te definen.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/perfumes" className="hover:text-white transition-colors">
              Perfumes
            </Link>
            <Link href="/ropa" className="hover:text-white transition-colors">
              Ropa
            </Link>
            <Link href="/articulos" className="hover:text-white transition-colors">
              Artículos
            </Link>
            <Link href="/contacto" className="hover:text-white transition-colors">
              Contacto
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          BleeStore todos los derechos reservados © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
