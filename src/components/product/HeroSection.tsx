"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient min-h-[85vh] flex items-center">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-jolen-yellow rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-jolen-pink rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-jolen-peach rounded-full opacity-15 blur-2xl -translate-x-1/2 -translate-y-1/2" />

      {/* Floating stickers */}
      <div className="absolute top-16 right-8 text-5xl animate-float sticker select-none hidden md:block">🍦</div>
      <div className="absolute top-32 left-12 text-4xl animate-float sticker select-none hidden md:block" style={{ animationDelay: "0.5s" }}>🌊</div>
      <div className="absolute bottom-24 right-16 text-3xl animate-wiggle sticker select-none hidden md:block" style={{ animationDelay: "1s" }}>⭐</div>
      <div className="absolute bottom-16 left-8 text-4xl animate-float sticker select-none hidden md:block" style={{ animationDelay: "1.5s" }}>🍓</div>
      <div className="absolute top-1/4 right-1/3 text-2xl animate-bounce-slow select-none hidden lg:block">✨</div>
      <div className="absolute bottom-1/3 left-1/4 text-3xl animate-float select-none hidden lg:block" style={{ animationDelay: "2s" }}>🥤</div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-jolen-yellow px-4 py-2 rounded-full text-sm font-bold text-gray-700 mb-6 animate-fade-in shadow-sm">
          <span className="w-2 h-2 rounded-full bg-jolen-pink-dark animate-pulse" />
          الآن متاح للطلب 🎉
        </div>

        {/* Main logo */}
        <div className="mb-6 animate-slide-up">
          <div className="inline-flex flex-col items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-4xl bg-gradient-to-br from-jolen-yellow via-jolen-peach to-jolen-pink flex items-center justify-center shadow-2xl mb-4 hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-4xl md:text-5xl tracking-tight">J</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-jolen-pink-dark via-jolen-pink to-jolen-yellow-dark leading-none mb-1">
              جولين
            </h1>
            <p className="text-xl md:text-2xl font-bold text-gray-400 tracking-[0.3em] uppercase">
              JOLEN
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-700 font-bold mb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          آيس كريم على الصاج 🍦 موهيتو 🥤 ورق عنب 🌿
        </p>
        <p className="text-base md:text-lg text-gray-500 font-medium mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          طعم خيال، لحظات لا تُنسى ✨
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/#products"
            className="btn-primary text-lg px-8 py-4 rounded-3xl shadow-lg"
          >
            اطلب الآن 🛍️
          </Link>
          <Link
            href="/#products"
            className="btn-outline text-lg px-8 py-4 rounded-3xl"
          >
            شوف القائمة ✨
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          {[
            { icon: "💳", text: "دفع عند الاستلام" },
            { icon: "🚗", text: "توصيل سريع" },
            { icon: "⭐", text: "جودة عالية" },
            { icon: "❤️", text: "صنع بحب" },
          ].map((pill) => (
            <div
              key={pill.text}
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white px-4 py-2 rounded-2xl text-sm font-bold text-gray-700 shadow-sm hover:scale-105 transition-transform"
            >
              <span>{pill.icon}</span>
              <span>{pill.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            fill="#FFF9F0"
          />
        </svg>
      </div>
    </section>
  );
}
