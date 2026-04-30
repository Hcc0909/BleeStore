"use client";

import { Product, ProductVariant } from "@/lib/types/database";
import { buildWhatsAppUrl, formatPrice } from "@/lib/utils";
import { MessageCircle, Share2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { VariantSelector } from "./VariantSelector";
import toast from "react-hot-toast";

interface ProductModalProps {
  product: Product;
  whatsappNumber: string;
  onClose: () => void;
}

export function ProductModal({ product, whatsappNumber, onClose }: ProductModalProps) {
  const variants = product.variants ?? [];
  const sorted = [...variants].sort((a, b) => a.sort_order - b.sort_order);
  const [selected, setSelected] = useState<ProductVariant | null>(sorted[0] ?? null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    }
  }

  const categoryLabel = product.category.replace(/_/g, " ");

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center transition-all duration-300 ${
        visible ? "bg-black/50" : "bg-transparent"
      }`}
      onClick={handleClose}
    >
      {/* Bottom sheet on mobile / centered card on desktop */}
      <div
        className={`relative bg-white w-full sm:w-auto sm:max-w-3xl sm:mx-4 sm:rounded-3xl rounded-t-3xl overflow-hidden
          flex flex-col sm:flex-row
          max-h-[92dvh] sm:max-h-[85vh]
          mt-auto sm:mt-0
          transition-all duration-300 ease-out
          ${visible ? "translate-y-0 sm:scale-100 sm:opacity-100" : "translate-y-full sm:scale-95 sm:opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar – mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-gray-100 transition-colors shadow-sm"
        >
          <X size={18} className="text-gray-600" />
        </button>

        {/* Image — full-width on mobile, left panel on desktop */}
        <div className="relative w-full sm:w-80 sm:min-w-[320px] aspect-square sm:aspect-auto bg-gray-50 shrink-0">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col overflow-y-auto p-5 sm:p-7 gap-4 flex-1">
          {/* Category badge */}
          <span className="inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
            {categoryLabel}
          </span>

          {/* Name */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h2>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Variant selector */}
          {sorted.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {product.category.includes("perfume") ? "Presentación" : "Talla"}
              </p>
              <VariantSelector
                variants={sorted}
                selected={selected}
                onSelect={setSelected}
                category={product.category}
              />
            </div>
          )}

          {/* Price + actions */}
          <div className="mt-auto pt-2 space-y-3">
            {selected && (
              <p className="text-3xl font-bold text-black">
                {formatPrice(selected.price)}
              </p>
            )}

            <div className="flex gap-3">
              {selected && (
                <a
                  href={buildWhatsAppUrl(whatsappNumber, product.name, product.category, selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] text-white font-semibold rounded-2xl hover:bg-[#20ba59] active:bg-[#1da851] transition-colors shadow-sm text-sm"
                >
                  <MessageCircle size={18} />
                  Pedir por WhatsApp
                </a>
              )}
              <button
                onClick={handleShare}
                className="p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-500"
                title="Compartir"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
