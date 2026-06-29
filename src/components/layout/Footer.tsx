import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-jolen-yellow-light via-white to-jolen-pink-light border-t border-jolen-yellow-light mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-jolen-yellow to-jolen-pink flex items-center justify-center text-white font-black text-xl shadow-md">
                J
              </div>
              <div>
                <p className="font-black text-gray-800 text-xl">جولين</p>
                <p className="text-sm text-jolen-pink font-bold">JOLEN</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              آيس كريم على الصاج، موهيتو، وورق العنب 🌿
              <br />
              طعم خيال، لحظات لا تُنسى ✨
            </p>
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="font-black text-gray-800 mb-3">روابط سريعة</p>
            <div className="flex flex-col gap-2">
              <Link href="/#products" className="text-sm text-gray-500 hover:text-jolen-pink transition-colors">
                🍦 المنتجات
              </Link>
              <Link href="/cart" className="text-sm text-gray-500 hover:text-jolen-pink transition-colors">
                🛍️ السلة
              </Link>
              <Link href="/checkout" className="text-sm text-gray-500 hover:text-jolen-pink transition-colors">
                ✅ إتمام الطلب
              </Link>
            </div>
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <p className="font-black text-gray-800 mb-3">معلومات</p>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <p>متجر جنى🐈 الين🐰 جود🐿️ ء  </p>
              <p>🚗 توصيل داخل المنطقة</p>
              <p>⏰ يومياً من 5 م – 11 م</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-jolen-yellow-light text-center">
          <p className="text-xs text-gray-400">
            © 2025 جولين JOLEN · 👑صُنع بـ ❤️بواسطة الملكة جنى 
          </p>
        </div>
      </div>
    </footer>
  );
}
