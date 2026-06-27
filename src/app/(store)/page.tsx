import HeroSection from "@/components/product/HeroSection";
import ProductsSection from "@/components/product/ProductsSection";
import { Suspense } from "react";

function ProductsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white border-2 border-jolen-yellow-light overflow-hidden animate-pulse"
          >
            <div className="h-36 bg-gradient-to-br from-jolen-yellow-light to-jolen-pink-light" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded-full w-3/4" />
              <div className="h-3 bg-gray-100 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<ProductsLoading />}>
        <ProductsSection />
      </Suspense>

      {/* About section */}
      <section id="about" className="bg-gradient-to-br from-jolen-yellow-light via-white to-jolen-pink-light py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6 animate-float inline-block">🌟</div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">عن جولين</h2>
          <p className="text-gray-600 leading-relaxed font-medium text-lg">
            جولين هو متجرك الصيفي المفضل 🌞 نقدم أشهى الآيس كريم على الصاج،
            الموهيتو المنعش، وورق العنب اللذيذ. كل شيء يُحضَّر بحب وعناية
            لتحصل على أفضل تجربة.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { icon: "🍦", label: "آيس كريم طازج" },
              { icon: "🥤", label: "موهيتو منعش" },
              { icon: "🌿", label: "ورق عنب وملفوف" },
              { icon: "❤️", label: "صنع بحب" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
