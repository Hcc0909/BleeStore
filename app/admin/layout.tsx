import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {user && <AdminSidebar />}
      {/* pt-14 en móvil para el header fijo del admin */}
      <div className={`flex-1 overflow-auto ${user ? "pt-14 md:pt-0 p-4 sm:p-6 md:p-8" : ""}`}>
        {children}
      </div>
    </div>
  );
}
