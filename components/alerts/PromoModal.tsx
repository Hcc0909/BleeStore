"use client";

import { X, Tag } from "lucide-react";
import { useEffect, useState } from "react";

interface PromoModalProps {
  message: string;
  enabled: boolean;
}

const SESSION_KEY = "bleestore_promo_shown";

export function PromoModal({ message, enabled }: PromoModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, [enabled]);

  function handleClose() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm p-6 sm:p-8 z-10 text-center">
        {/* Handle bar en móvil */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Tag size={22} className="text-white" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">BleeStore</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{message}</p>

        <button
          onClick={handleClose}
          className="mt-6 w-full py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors"
        >
          Ver productos
        </button>
      </div>
    </div>
  );
}
