"use client";

import { BannerImage } from "@/lib/types/database";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface BannerCarouselProps {
  banners: BannerImage[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const slides = banners.filter((b) => b.is_active);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-900 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) dx > 0 ? next() : prev();
        touchStartX.current = null;
      }}
    >
      {/* Slides track */}
      <div
        className="flex transition-transform duration-700 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((banner, i) => (
          <div
            key={banner.id}
            className="relative w-full shrink-0 aspect-[16/7] sm:aspect-[16/5]"
          >
            <Image
              src={banner.url}
              alt={`Banner ${i + 1}`}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
            {/* subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Arrow — prev */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 sm:w-12 sm:h-12 rounded-full
              bg-white/20 backdrop-blur-sm border border-white/30
              flex items-center justify-center text-white
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              hover:bg-white/40 active:scale-95"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          {/* Arrow — next */}
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 sm:w-12 sm:h-12 rounded-full
              bg-white/20 backdrop-blur-sm border border-white/30
              flex items-center justify-center text-white
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              hover:bg-white/40 active:scale-95"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al banner ${i + 1}`}
              className={`rounded-full transition-all duration-400 ${
                i === current
                  ? "w-7 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {slides.length > 1 && !paused && (
        <div
          key={current}
          className="absolute bottom-0 left-0 h-0.5 bg-white/60 animate-[progress_5s_linear]"
          style={{ animationFillMode: "forwards" }}
        />
      )}
    </section>
  );
}
