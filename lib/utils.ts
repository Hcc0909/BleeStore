import { ProductVariant } from "./types/database";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function buildWhatsAppUrl(
  whatsappNumber: string,
  productName: string,
  categorySlug: string,
  variant: ProductVariant
): string {
  const price = formatPrice(variant.price);
  // Si el slug tiene "perfume" o el label termina en "ml", es perfume
  const isPerfume =
    categorySlug.includes("perfume") ||
    variant.label.toLowerCase().endsWith("ml");

  const message = isPerfume
    ? `Buen día, me interesa información sobre el perfume ${productName} en presentación de ${variant.label} que tiene costo de ${price} pesos`
    : `Buen día, me interesa información sobre ${productName} en talla ${variant.label} que tiene costo de ${price} pesos`;

  const number = whatsappNumber.replace(/\D/g, "");
  const fullNumber = number.startsWith("52") ? number : `52${number}`;
  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppContactUrl(whatsappNumber: string): string {
  const number = whatsappNumber.replace(/\D/g, "");
  const fullNumber = number.startsWith("52") ? number : `52${number}`;
  return `https://wa.me/${fullNumber}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
