"use client";

import { useState } from "react";
import { ProductWithAddons, CartAddon } from "@/types";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Plus, Minus, Check } from "lucide-react";
import toast from "react-hot-toast";

interface AddToCartProps {
  product: ProductWithAddons;
}

export default function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<CartAddon[]>([]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const addons = product.product_addons?.map((pa) => pa.addons).filter(Boolean) || [];

  const toggleAddon = (addon: { id: string; name_ar: string; name_en: string; price: number }) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) return prev.filter((a) => a.id !== addon.id);
      return [...prev, { id: addon.id, name_ar: addon.name_ar, name_en: addon.name_en, price: addon.price }];
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitTotal = product.price + addonsTotal;
  const totalPrice = unitTotal * quantity;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name_ar,
      productNameEn: product.name_en,
      price: unitTotal,
      basePrice: product.price,
      quantity,
      addons: selectedAddons,
      addonsTotal,
    });

    setAdded(true);
    toast.success(`تمت إضافة ${product.name_ar} للسلة 🎉`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Addons */}
      {addons.length > 0 && (
        <div>
          <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-jolen-yellow flex items-center justify-center text-xs">✨</span>
            الإضافات
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {addons.map((addon) => {
              const isSelected = selectedAddons.some((a) => a.id === addon.id);
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon)}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-sm font-bold ${
                    isSelected
                      ? "border-jolen-pink bg-jolen-pink-light text-jolen-pink-dark"
                      : "border-gray-200 bg-white text-gray-700 hover:border-jolen-pink-light"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && <Check size={12} />}
                    {addon.name_ar}
                  </span>
                  <span className={`text-xs ${isSelected ? "text-jolen-pink-dark" : "text-gray-400"}`}>
                    {addon.price === 0 ? "مجاني" : `+${formatPrice(addon.price)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-jolen-yellow flex items-center justify-center text-xs">🔢</span>
          الكمية
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-jolen-pink-light transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-black text-gray-800 text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-jolen-yellow-light transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Price summary */}
          <div className="flex-1 bg-gradient-to-r from-jolen-yellow-light to-jolen-pink-light rounded-2xl p-3 text-center">
            <p className="text-xs text-gray-500 font-medium">الإجمالي</p>
            <p className="font-black text-xl text-jolen-pink-dark">{formatPrice(totalPrice)}</p>
            {addonsTotal > 0 && (
              <p className="text-xs text-gray-400">
                {formatPrice(product.price)} + {formatPrice(addonsTotal)} إضافات
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-3xl font-black text-lg transition-all duration-300 ${
          added
            ? "bg-green-500 text-white scale-95"
            : "bg-gradient-to-r from-jolen-pink to-jolen-pink-dark text-white hover:shadow-lg hover:scale-105 active:scale-95"
        }`}
      >
        {added ? (
          <>
            <Check size={22} />
            تمت الإضافة ✅
          </>
        ) : (
          <>
            <ShoppingBag size={22} />
            أضف للسلة — {formatPrice(totalPrice)}
          </>
        )}
      </button>
    </div>
  );
}
