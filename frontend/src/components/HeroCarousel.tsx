import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Smartphone, Car, PlusCircle } from 'lucide-react';
import { HERO_SLIDES } from '../data/mockRides';

interface HeroCarouselProps {
  onBookClick: () => void;
  onHostClick: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onBookClick,
  onHostClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const current = HERO_SLIDES[activeIndex];

  const prevSlide = () =>
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () =>
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-slate-900 min-h-[470px] sm:min-h-[520px] flex items-center"
    >
      {/* Background Image */}
      <img
        src={current.image}
        alt={current.highlight}
        className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700"
      />

      {/* Signature Green-Tinted Overlay matching reference */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e2d1d]/90 via-[#173f2a]/80 to-[#0e2d1d]/85" />

      {/* Left Arrow */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 md:left-7 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 transition"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Right Arrow */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 md:right-7 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 transition"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Center Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {current.prefix}
          <span className="text-race-500">{current.highlight}</span>
          {current.suffix}
        </h1>

        <p className="mt-4 text-base sm:text-lg font-medium text-slate-100">
          {current.subtitle}
        </p>
        <p className="mt-1.5 text-sm text-slate-300">{current.caption}</p>

        {/* Primary Web Actions: Book & Host */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onBookClick}
            className="inline-flex items-center gap-2 rounded-xl bg-race-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-race-500/25 hover:bg-race-600 transition"
          >
            <Car className="h-4 w-4" />
            <span>Book a Ride</span>
          </button>
          <button
            type="button"
            onClick={onHostClick}
            className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Host a Ride</span>
          </button>
        </div>

        {/* Store Badges matching reference */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#book-ride"
            className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-2 text-left text-slate-900 shadow-md hover:bg-slate-50 transition"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-race-500 text-white">
              <Smartphone className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                Download in
              </span>
              <span className="block text-sm font-bold">Google Play</span>
            </span>
          </a>

          <a
            href="#book-ride"
            className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-2 text-left text-slate-900 shadow-md hover:bg-slate-50 transition"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Smartphone className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                Download in
              </span>
              <span className="block text-sm font-bold">App Store</span>
            </span>
          </a>
        </div>

        {/* Carousel Indicators */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex
                  ? 'w-7 bg-race-500'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
