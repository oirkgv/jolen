"use client";

import { ProductWithAddons } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Star } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: ProductWithAddons;
}

const PRODUCT_EMOJIS: Record<string, string> = {
  "فانيلا": "🍦",
  "شوكولاتة": "🍫",
  "شوكولاتة بلجيكية بالبندق": "🎖️",
  "مانجا": "🥭",
  "فراولة بالشوكولاتة البلجيكية": "🍓",
  "ورق عنب": "🌿",
  "ملفوف": "🥬",
  "موهيتو ريد": "🔴",
  "موهيتو بلو": "🔵",
  "موهيتو بربل": "🟣",
};

const CATEGORY_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  "آيس كريم على الصاج": { bg: "from-jolen-yellow-light to-white", border: "border-jolen-yellow", badge: "bg-jolen-yellow text-yellow-800" },
  "فراولة بالشوكولاتة": { bg: "from-jolen-pink-light to-white", border: "border-jolen-pink", badge: "bg-jolen-pink-light text-pink-800" },
  "ورق العنب والملفوف": { bg: "from-green-50 to-white", border: "border-green-200", badge: "bg-green-100 text-green-800" },
  "موهيتو": { bg: "from-jolen-lavender to-white", border: "border-purple-200", badge: "bg-purple-100 text-purple-800" },
};

export default function ProductCard({ product }: ProductCardProps) {
  const emoji = PRODUCT_EMOJIS[product.name_ar] || "🍦";
  const categoryName = product.categories?.name_ar || "";
  const colors = CATEGORY_COLORS[categoryName] || {
    bg: "from-gray-50 to-white",
    border: "border-gray-200",
    badge: "bg-gray-100 text-gray-700",
  };
  const addonCount = product.product_addons?.length || 0;

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div
        className={`card border-2 ${colors.border} h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg`}
      >
        {/* Product visual */}
        <div className={`bg-gradient-to-br ${colors.bg} p-8 flex items-center justify-center relative min-h-[140px]`}>
          <span className="text-7xl group-hover:scale-110 transition-transform duration-300 block sticker">
            {emoji}
          </span>

          {product.is_limited && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-red-100 text-red-700 text-xs animate-pulse">
                🔥 كمية محدودة
              </span>
            </div>
          )}

          {/* Stars decoration */}
          <div className="absolute top-2 left-2 text-jolen-yellow text-xs opacity-60">✦</div>
          <div className="absolute bottom-3 right-6 text-jolen-pink text-xs opacity-40">✦</div>
        </div>

        {/* Product info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-black text-gray-800 text-base leading-tight">
              {product.name_ar}
            </h3>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-xl font-black text-jolen-pink-dark">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {product.description_ar && (
            <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
              {product.description_ar}
            </p>
          )}

          <div className="flex items-center justify-between">
            {addonCount > 0 && (
              <span className="text-xs text-gray-400 font-medium">
                ✨ {addonCount} إضافة
              </span>
            )}

            <button className="mr-auto flex items-center gap-2 bg-gradient-to-r from-jolen-pink to-jolen-pink-dark text-white text-sm font-bold py-2 px-4 rounded-2xl hover:shadow-md transition-all hover:scale-105 active:scale-95">
              <ShoppingBag size={14} />
              أضف
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
