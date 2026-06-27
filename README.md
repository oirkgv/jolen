# 🍦 جولين | JOLEN

متجر إلكتروني كامل للآيس كريم على الصاج، الموهيتو، وورق العنب.

---

## تشغيل المشروع

### الخطوة 1 — إنشاء مشروع Supabase
1. اذهب إلى [supabase.com](https://supabase.com) → **New Project**
2. بعد الإنشاء، اذهب إلى **SQL Editor** → **New Query**
3. افتح ملف `supabase/schema.sql`، انسخ المحتوى كله، الصقه، اضغط **Run**

### الخطوة 2 — إعداد البيئة
```bash
# انسخ ملف البيئة
cp .env.example .env.local
```
افتح `.env.local` وأضف قيمك من **Supabase → Settings → API**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### الخطوة 3 — تشغيل
```bash
npm install
npm run dev
```
افتح: http://localhost:3000

### الخطوة 4 — إنشاء حساب Admin
1. **Supabase → Authentication → Users → Add user**
2. أضف بريد إلكتروني وكلمة مرور
3. ادخل من: http://localhost:3000/admin/login

---

## النشر على Vercel
```bash
# 1. ارفع المشروع على GitHub
git init && git add . && git commit -m "jolen"
git remote add origin YOUR_REPO && git push

# 2. اذهب إلى vercel.com → Import Project
# 3. أضف Environment Variables نفس .env.local
# 4. Deploy
```

---

## الصفحات
| الرابط | الوصف |
|--------|-------|
| `/` | المتجر الرئيسي |
| `/product/[id]` | تفاصيل المنتج |
| `/cart` | السلة |
| `/checkout` | إتمام الطلب |
| `/order-success` | تأكيد الطلب |
| `/admin/login` | دخول المشرف |
| `/admin/dashboard` | لوحة التحكم |
| `/admin/orders` | الطلبات |
| `/admin/products` | المنتجات |
| `/admin/addons` | الإضافات |
