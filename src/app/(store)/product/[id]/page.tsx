import { getProductById } from "@/app/actions/products";
import AddToCart from "@/components/product/AddToCart";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

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

// لا نستخدم generateStaticParams لأنها تستدعي Supabase أثناء البناء
export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch {
    return (
      <div className="min-h-screen bg-jolen-cream flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">⚙️</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">
          Supabase غير مُعرَّف
        </h1>
        <p className="text-gray-500 mb-6">
          تأكد من إعداد ملف .env.local
        </p>
        <Link href="/" className="btn-secondary">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  if (!product) return notFound();

  const emoji = PRODUCT_EMOJIS[product.name_ar] || "🍦";

  return (
    <div className="min-h-screen bg-jolen-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-jolen-pink transition-colors mb-6 group"
        >
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          العودة للقائمة
        </Link>

        <div className="card mb-6 overflow-hidden">
          <div className="bg-gradient-to-br from-jolen-yellow-light via-jolen-pink-light to-white p-12 flex items-center justify-center relative">
            <span className="text-[120px] md:text-[150px] leading-none sticker animate-float">
              {emoji}
            </span>
            {product.is_limited && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-2xl text-sm font-bold">
                  <AlertCircle size={14} />
                  كمية محدودة يومياً
                </div>
              </div>
            )}
            <div className="absolute top-6 left-6 text-3xl opacity-30 animate-wiggle">✦</div>
            <div className="absolute bottom-6 right-6 text-2xl opacity-20 animate-float" style={{ animationDelay: "1s" }}>✦</div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h1 className="text-2xl font-black text-gray-800">{product.name_ar}</h1>
                <p className="text-sm text-gray-400 font-medium">{product.name_en}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-black text-jolen-pink-dark">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-gray-400">للحبة الواحدة</p>
              </div>
            </div>

            {product.description_ar && (
              <p className="text-gray-600 leading-relaxed mb-4 font-medium">
                {product.description_ar}
              </p>
            )}

            {product.categories && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{product.categories.emoji}</span>
                <span className="text-sm text-gray-500 font-medium">{product.categories.name_ar}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <AddToCart product={product} />
        </div>

        <div className="mt-6 bg-jolen-yellow-light border border-jolen-yellow rounded-3xl p-4 flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-yellow-900 text-sm">ملاحظة</p>
            <p className="text-yellow-800 text-sm leading-relaxed">
              جميع المنتجات تُحضَّر طازجة عند الطلب. الدفع عند الاستلام فقط 💳
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
