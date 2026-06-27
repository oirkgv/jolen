"use client";

import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createOrder } from "@/app/actions/orders";
import { CheckoutFormData } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User, Phone, MapPin, FileText, Truck, Store } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  customer_name: z.string().min(2, "يرجى إدخال اسمك الكامل"),
  customer_phone: z
    .string()
    .min(9, "يرجى إدخال رقم جوال صحيح")
    .regex(/^[0-9+\s-]+$/, "رقم الجوال غير صحيح"),
  delivery_type: z.enum(["pickup", "delivery"]),
  delivery_address: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.delivery_type === "delivery") {
      return data.delivery_address && data.delivery_address.length > 5;
    }
    return true;
  },
  { message: "يرجى إدخال عنوان التوصيل", path: ["delivery_address"] }
);

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const totalPrice = getTotalPrice();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { delivery_type: "pickup" },
  });

  const deliveryType = watch("delivery_type");

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) {
      toast.error("السلة فارغة!");
      return;
    }

    setLoading(true);
    try {
      const result = await createOrder(data as CheckoutFormData, items);
      if (result.success && result.orderNumber) {
        clearCart();
        router.push(`/order-success?order=${result.orderNumber}`);
      } else {
        toast.error(result.error || "حدث خطأ ما، يرجى المحاولة مجدداً");
      }
    } catch {
      toast.error("حدث خطأ ما، يرجى المحاولة مجدداً");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-jolen-cream flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-4 animate-float">🛍️</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">لا يوجد منتجات</h1>
        <p className="text-gray-500 mb-6">أضف منتجات للسلة أولاً</p>
        <Link href="/" className="btn-primary">تصفح المنتجات</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jolen-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-800 mb-8">إتمام الطلب ✅</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer info */}
          <div className="card p-6 border border-jolen-yellow-light">
            <h2 className="font-black text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-jolen-yellow flex items-center justify-center">
                <User size={16} />
              </span>
              بيانات العميل
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <User size={16} className="absolute top-3.5 right-4 text-gray-400" />
                  <input
                    {...register("customer_name")}
                    placeholder="أدخل اسمك الكامل"
                    className="input-field pr-10"
                  />
                </div>
                {errors.customer_name && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.customer_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  رقم الجوال *
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute top-3.5 right-4 text-gray-400" />
                  <input
                    {...register("customer_phone")}
                    placeholder="05XXXXXXXX"
                    type="tel"
                    dir="ltr"
                    className="input-field pr-10"
                  />
                </div>
                {errors.customer_phone && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.customer_phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery type */}
          <div className="card p-6 border border-jolen-yellow-light">
            <h2 className="font-black text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-jolen-pink-light flex items-center justify-center">
                <MapPin size={16} />
              </span>
              طريقة الاستلام
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <label
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  deliveryType === "pickup"
                    ? "border-jolen-yellow bg-jolen-yellow-light"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value="pickup"
                  {...register("delivery_type")}
                  className="sr-only"
                />
                <Store size={24} className={deliveryType === "pickup" ? "text-yellow-700" : "text-gray-400"} />
                <span className={`font-black text-sm ${deliveryType === "pickup" ? "text-yellow-800" : "text-gray-600"}`}>
                  استلام
                </span>
              </label>

              <label
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  deliveryType === "delivery"
                    ? "border-jolen-pink bg-jolen-pink-light"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value="delivery"
                  {...register("delivery_type")}
                  className="sr-only"
                />
                <Truck size={24} className={deliveryType === "delivery" ? "text-pink-700" : "text-gray-400"} />
                <span className={`font-black text-sm ${deliveryType === "delivery" ? "text-pink-800" : "text-gray-600"}`}>
                  توصيل
                </span>
              </label>
            </div>

            {deliveryType === "delivery" && (
              <div className="animate-slide-up">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  عنوان التوصيل *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute top-3.5 right-4 text-gray-400" />
                  <textarea
                    {...register("delivery_address")}
                    placeholder="أدخل عنوانك بالتفصيل"
                    rows={3}
                    className="input-field pr-10 resize-none"
                  />
                </div>
                {errors.delivery_address && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.delivery_address.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card p-6 border border-jolen-yellow-light">
            <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-jolen-mint flex items-center justify-center">
                <FileText size={16} />
              </span>
              ملاحظات إضافية
            </h2>
            <textarea
              {...register("notes")}
              placeholder="أي ملاحظات خاصة بالطلب... (اختياري)"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Order summary */}
          <div className="card p-5 border-2 border-jolen-yellow bg-gradient-to-br from-jolen-yellow-light to-white">
            <h3 className="font-black text-gray-800 mb-3">ملخص الطلب</h3>
            <div className="space-y-2 mb-3">
              {items.map((item) => (
                <div key={item.cartId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-bold">{formatPrice((item.basePrice + item.addonsTotal) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-jolen-yellow pt-3 flex justify-between">
              <span className="font-black text-gray-800">الإجمالي</span>
              <span className="font-black text-xl text-jolen-pink-dark">{formatPrice(totalPrice)}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span>💳</span>
              <span>الدفع عند الاستلام فقط — لا يوجد دفع إلكتروني</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg py-4 rounded-3xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                جاري إرسال الطلب...
              </span>
            ) : (
              "إرسال الطلب 🎉"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
