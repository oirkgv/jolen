"use client";

import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } =
    useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-jolen-cream flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="text-9xl mb-6 animate-float">🛍️</div>
        <h1 className="text-3xl font-black text-gray-800 mb-3">السلة فارغة</h1>
        <p className="text-gray-500 font-medium mb-8">أضف شيء من القائمة يحلّيك!</p>
        <Link href="/" className="btn-primary text-lg px-8 py-4 rounded-3xl">
          تصفح المنتجات 🍦
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jolen-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800">سلتي 🛍️</h1>
            <p className="text-gray-500 font-medium mt-1">{totalItems} منتج</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors font-bold"
          >
            <Trash2 size={16} />
            مسح السلة
          </button>
        </div>

        {/* Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.cartId} className="card p-5 border border-jolen-yellow-light animate-slide-up">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-800 text-base">{item.productName}</h3>
                  <p className="text-xs text-gray-400 font-medium">{item.productNameEn}</p>

                  {item.addons.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.addons.map((addon) => (
                        <span
                          key={addon.id}
                          className="text-xs bg-jolen-yellow-light text-yellow-800 px-2 py-0.5 rounded-full font-bold"
                        >
                          ✓ {addon.name_ar}
                          {addon.price > 0 && ` +${formatPrice(addon.price)}`}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-jolen-pink-light transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-black text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-jolen-yellow-light transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-lg text-jolen-pink-dark">
                    {formatPrice((item.basePrice + item.addonsTotal) * item.quantity)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatPrice(item.basePrice + item.addonsTotal)} × {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-5 border-2 border-jolen-yellow mb-6">
          <h3 className="font-black text-gray-800 mb-4">ملخص الطلب</h3>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.cartId} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-bold text-gray-800">
                  {formatPrice((item.basePrice + item.addonsTotal) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-jolen-yellow-light pt-3 flex justify-between items-center">
            <span className="font-black text-gray-800 text-lg">الإجمالي</span>
            <span className="font-black text-2xl text-jolen-pink-dark">{formatPrice(totalPrice)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">💳 الدفع عند الاستلام فقط</p>
        </div>

        {/* Checkout */}
        <Link
          href="/checkout"
          className="btn-primary w-full text-center block text-lg py-4 rounded-3xl shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <ShoppingBag size={20} />
            إتمام الطلب — {formatPrice(totalPrice)}
          </span>
        </Link>

        <Link
          href="/"
          className="block text-center mt-4 text-sm text-gray-400 hover:text-jolen-pink transition-colors font-medium"
        >
          متابعة التسوق ←
        </Link>
      </div>
    </div>
  );
}
