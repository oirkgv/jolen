"use client";

import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState } from "react";
import Link from "next/link";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Navbar() {
  const { getTotalItems, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = getTotalItems();

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-jolen-yellow-light shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-jolen-yellow to-jolen-pink flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-110 transition-transform">
              🐈🍦
            </div>
            <div className="leading-tight">
              <p className="font-black text-gray-800 text-lg leading-none">جولين</p>
              <p className="text-xs text-jolen-pink font-bold">JOLEN</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-600">
            <Link href="/#products" className="hover:text-jolen-pink transition-colors">المنتجات</Link>
            <Link href="/#about" className="hover:text-jolen-pink transition-colors">عن المتجر</Link>
          </div>

          {/* Cart + Mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-jolen-yellow to-jolen-pink text-white font-bold px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-105"
              aria-label="السلة"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline text-sm">السلة</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -left-2 bg-jolen-pink-dark text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-jolen-yellow-light transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-jolen-yellow-light px-4 py-3 flex flex-col gap-3 animate-fade-in">
            <Link
              href="/#products"
              className="py-2 font-bold text-gray-700 hover:text-jolen-pink transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              🍦 المنتجات
            </Link>
            <Link
              href="/#about"
              className="py-2 font-bold text-gray-700 hover:text-jolen-pink transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              💫 عن المتجر
            </Link>
          </div>
        )}
      </nav>

      <CartDrawer />
    </>
  );
}
