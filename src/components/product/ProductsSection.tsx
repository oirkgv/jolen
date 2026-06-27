import { getProductsByCategory } from "@/app/actions/products";
import ProductCard from "./ProductCard";

export default async function ProductsSection() {
  let categoryGroups: Awaited<ReturnType<typeof getProductsByCategory>> = [];

  try {
    categoryGroups = await getProductsByCategory();
  } catch {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="bg-jolen-yellow-light border-2 border-jolen-yellow rounded-3xl p-8 max-w-lg mx-auto">
          <div className="text-5xl mb-4">⚙️</div>
          <h3 className="font-black text-gray-800 text-xl mb-2">
            إعداد Supabase مطلوب
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            لتشغيل المتجر، أضف متغيرات البيئة في ملف{" "}
            <code className="bg-white px-2 py-0.5 rounded-lg font-mono text-xs border">
              .env.local
            </code>
          </p>
          <div className="bg-white rounded-2xl p-4 text-right font-mono text-xs text-gray-700 border border-gray-200 space-y-1">
            <p>
              <span className="text-jolen-pink-dark">
                NEXT_PUBLIC_SUPABASE_URL
              </span>
              =https://xxxx.supabase.co
            </p>
            <p>
              <span className="text-jolen-pink-dark">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </span>
              =eyJxxx...
            </p>
          </div>
          <p className="text-gray-400 text-xs mt-3">
            ثم أعد تشغيل الخادم: <code>npm run dev</code>
          </p>
        </div>
      </div>
    );
  }

  if (categoryGroups.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg">لا توجد منتجات بعد</p>
      </div>
    );
  }

  return (
    <section id="products" className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-jolen-yellow-light border border-jolen-yellow px-4 py-2 rounded-full text-sm font-bold text-yellow-800 mb-4">
          ✨ قائمتنا الصيفية
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-3">
          اختار اللي يحلّيك 🍦
        </h2>
        <p className="text-gray-500 font-medium">
          كل شيء يُحضَّر بحب وجودة عالية
        </p>
      </div>

      <div className="space-y-12">
        {categoryGroups.map(({ category, products }) => {
          if (products.length === 0) return null;
          return (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-jolen-yellow to-jolen-pink flex items-center justify-center text-2xl shadow-md">
                  {category.emoji}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800">
                    {category.name_ar}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    {category.name_en}
                  </p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-jolen-yellow-light to-transparent mr-4" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
