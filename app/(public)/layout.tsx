import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PromoModal } from "@/components/alerts/PromoModal";
import { createClient } from "@/lib/supabase/server";
import { SiteConfigMap } from "@/lib/types/database";

async function getConfig(): Promise<Partial<SiteConfigMap>> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_config").select("*");
  const config: Partial<SiteConfigMap> = {};
  data?.forEach((row) => {
    (config as Record<string, string>)[row.key] = row.value;
  });
  return config;
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getConfig();

  return (
    <>
      <Navbar />
      <main className="pt-16 flex-1">{children}</main>
      <Footer />
      <PromoModal
        message={config.alert_message ?? "¡Bienvenido a BleeStore!"}
        enabled={config.alert_enabled === "true"}
      />
    </>
  );
}
