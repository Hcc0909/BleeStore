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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10 text-center">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Tag size={26} className="text-white" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">BleeStore</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{message}</p>

        <button
          onClick={handleClose}
          className="mt-6 w-full py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Ver productos
        </button>
      </div>
    </div>
  );
}
