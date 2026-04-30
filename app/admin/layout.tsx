import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Login page doesn't use this layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      {user && <AdminSidebar />}
      <div className="flex-1 p-6 sm:p-8 overflow-auto">{children}</div>
    </div>
  );
}
