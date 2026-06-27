"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle, Home, Package } from "lucide-react";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");

  return (
    <div className="min-h-screen bg-jolen-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        {/* Success animation */}
        <div className="relative inline-block mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-jolen-yellow to-jolen-pink flex items-center justify-center shadow-2xl animate-scale-in mx-auto">
            <CheckCircle size={52} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 text-3xl animate-bounce">🎉</div>
          <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>⭐</div>
        </div>

        <h1 className="text-4xl font-black text-gray-800 mb-3 animate-slide-up">
          تم استلام طلبك! 🎊
        </h1>

        <p className="text-gray-500 font-medium mb-6 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
          شكراً لثقتك بجولين ✨<br />
          سيصلك طلبك قريباً!
        </p>

        {/* Order number */}
        {orderNumber && (
          <div className="bg-gradient-to-r from-jolen-yellow-light to-jolen-pink-light border-2 border-jolen-yellow rounded-3xl p-6 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-sm text-gray-500 font-medium mb-1">رقم طلبك</p>
            <p className="text-3xl font-black text-gray-800 tracking-wider">{orderNumber}</p>
            <p className="text-xs text-gray-400 mt-2">احتفظ بهذا الرقم لمتابعة طلبك</p>
          </div>
        )}

        {/* Status steps */}
        <div className="bg-white rounded-3xl border border-jolen-yellow-light p-5 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p className="font-black text-gray-800 mb-4 text-sm">مراحل الطلب</p>
          <div className="space-y-3">
            {[
              { icon: "✅", label: "تم استلام الطلب", done: true },
              { icon: "👨‍🍳", label: "قيد التحضير", done: false },
              { icon: "🎉", label: "جاهز للاستلام", done: false },
              { icon: "🚗", label: "تم التسليم", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${step.done ? "bg-jolen-yellow-light" : "bg-gray-50"}`}>
                  {step.icon}
                </div>
                <span className={`text-sm font-bold ${step.done ? "text-gray-800" : "text-gray-400"}`}>
                  {step.label}
                </span>
                {step.done && <span className="mr-auto text-xs font-bold text-green-500">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-jolen-pink-light border border-jolen-pink-light rounded-3xl p-4 mb-6 text-sm text-gray-600 font-medium animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p>💳 الدفع عند الاستلام — تذكر إحضار المبلغ</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <Link href="/" className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
            <Home size={18} />
            الصفحة الرئيسية
          </Link>
          <Link href="/" className="btn-secondary flex-1 text-center flex items-center justify-center gap-2">
            <Package size={18} />
            طلب جديد 🛍️
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-jolen-cream flex items-center justify-center"><div className="text-5xl animate-float">🎉</div></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
