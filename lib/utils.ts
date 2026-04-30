import { Category, ProductVariant } from "./types/database";

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
  category: Category,
  variant: ProductVariant
): string {
  const price = formatPrice(variant.price);
  let message: string;

  if (category === "perfume") {
    message = `Buen día, me interesa información sobre el perfume ${productName} en presentación de ${variant.label} que tiene costo de ${price} pesos`;
  } else {
    message = `Buen día, me interesa información sobre ${productName} en talla ${variant.label} que tiene costo de ${price} pesos`;
  }

  const number = whatsappNumber.replace(/\D/g, "");
  const fullNumber = number.startsWith("52") ? number : `52${number}`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${fullNumber}?text=${encoded}`;
}

export function buildWhatsAppContactUrl(whatsappNumber: string): string {
  const number = whatsappNumber.replace(/\D/g, "");
  const fullNumber = number.startsWith("52") ? number : `52${number}`;
  return `https://wa.me/${fullNumber}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
