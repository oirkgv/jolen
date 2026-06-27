"use client";

import { useCartStore } from "@/store/cart";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-jolen-yellow-light bg-gradient-to-r from-jolen-yellow-light to-jolen-pink-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-jolen-yellow to-jolen-pink flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-gray-800">سلتي</h2>
              <p className="text-xs text-gray-500">{totalItems} منتج</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl text-gray-500 hover:bg-white/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
              <div className="text-7xl animate-float">🛍️</div>
              <p className="text-gray-500 font-bold text-lg">السلة فارغة</p>
              <p className="text-gray-400 text-sm">أضف شيء من القائمة يحلّيك!</p>
              <button
                onClick={closeCart}
                className="btn-secondary mt-2"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartId}
                className="card p-4 border border-jolen-yellow-light animate-slide-up"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm leading-tight">
                      {item.productName}
                    </h4>
                    {item.addons.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.addons.map((addon) => (
                          <span
                            key={addon.id}
                            className="text-xs bg-jolen-yellow-light text-yellow-800 px-2 py-0.5 rounded-full font-medium"
                          >
                            {addon.name_ar}
                            {addon.price > 0 && ` (+${formatPrice(addon.price)})`}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-jolen-pink-dark font-black text-sm mt-1">
                      {formatPrice((item.basePrice + item.addonsTotal) * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="w-7 h-7 rounded-xl bg-jolen-pink-light text-jolen-pink-dark flex items-center justify-center hover:bg-jolen-pink hover:text-white transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center font-black text-gray-800 text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="w-7 h-7 rounded-xl bg-jolen-yellow-light text-yellow-800 flex items-center justify-center hover:bg-jolen-yellow transition-colors"
                    >
                      <Plus size={12} />
                    </button>

                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="w-7 h-7 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors mr-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-jolen-yellow-light bg-white space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="font-bold text-gray-600">المجموع</span>
              <span className="font-black text-xl text-jolen-pink-dark">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block text-lg"
            >
              إتمام الطلب ✅
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
            >
              متابعة التسوق
            </button>
          </div>
        )}
      </div>
    </>
  );
}
