import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PromoModal } from "@/components/alerts/PromoModal";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";
import { createClient } from "@/lib/supabase/server";
import { CategoryDB, SiteConfigMap } from "@/lib/types/database";

async function getData(): Promise<{ config: Partial<SiteConfigMap>; categories: CategoryDB[] }> {
  const supabase = await createClient();
  const [{ data: configRows }, { data: categories }] = await Promise.all([
    supabase.from("site_config").select("*"),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
  ]);

  const config: Partial<SiteConfigMap> = {};
  configRows?.forEach((row) => {
    (config as Record<string, string>)[row.key] = row.value;
  });

  return { config, categories: categories ?? [] };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { config, categories } = await getData();
  const whatsapp = config.whatsapp_number ?? "6879990490";

  return (
    <>
      <Navbar categories={categories} />
      <main className="pt-16 flex-1">{children}</main>
      <Footer />
      <WhatsAppFAB whatsappNumber={whatsapp} />
      <PromoModal
        message={config.alert_message ?? "¡Bienvenido a BleeStore!"}
        enabled={config.alert_enabled === "true"}
      />
    </>
  );
}
