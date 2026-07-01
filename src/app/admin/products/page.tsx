"use client";

import { useState, useEffect, useTransition } from "react";
import {
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "@/app/actions/products";
import { getCategories } from "@/app/actions/products";
import { Category } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Package, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  category_id: z.string().min(1, "اختر الفئة"),
  name_ar: z.string().min(1, "مطلوب"),
  name_en: z.string().min(1, "مطلوب"),
  description_ar: z.string().optional(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  is_available: z.boolean(),
  is_limited: z.boolean(),
  sort_order: z.coerce.number().default(0),
});

type FormData = z.infer<typeof schema>;

interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  price: number;
  stock: number;
  is_available: boolean;
  is_limited: boolean;
  sort_order: number;
  category_id: string | null;
  categories?: { name_ar: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { stock: 0, is_available: true, is_limited: false, sort_order: 0 },
  });

  const fetch = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([adminGetAllProducts(), getCategories()]);
    setProducts(p as Product[]);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    reset({ is_available: true, is_limited: false, sort_order: 0 });
    setEditProduct(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    reset({
      category_id: p.category_id || "",
      name_ar: p.name_ar,
      name_en: p.name_en,
      description_ar: p.description_ar || "",
      price: p.price,
      stock: p.stock,
      is_available: p.is_available,
      is_limited: p.is_limited,
      sort_order: p.sort_order,
    });
    setShowForm(true);
  };

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        if (editProduct) {
          await adminUpdateProduct(editProduct.id, data);
          toast.success("تم تحديث المنتج ✅");
        } else {
          await adminCreateProduct({...data, description_ar: data.description_ar ?? ""});
          
        }
        setShowForm(false);
        fetch();
      } catch {
        toast.error("حدث خطأ ما");
      }
    });
  };

  const handleDelete = (p: Product) => {
    startTransition(async () => {
      try {
        await adminDeleteProduct(p.id);
        toast.success("تم الحذف");
        setDeleteTarget(null);
        fetch();
      } catch {
        toast.error("فشل الحذف");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-800">المنتجات 📦</h1>
          <p className="text-gray-500 font-medium mt-1">{products.length} منتج</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          إضافة منتج
        </button>
      </div>

      {/* Products table */}
      <div className="card overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-12 text-center text-gray-400">جاري التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-right">
                  <th className="px-4 py-3 text-xs font-black text-gray-500">المنتج</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 hidden sm:table-cell">الفئة</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500">السعر</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 hidden md:table-cell">الحالة</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-800 text-sm">{p.name_ar}</p>
                      <p className="text-xs text-gray-400">{p.name_en}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500 font-medium">
                        {p.categories?.name_ar || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-black text-gray-800">{formatPrice(p.price)}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-2">
                        <span className={`badge text-xs ${p.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {p.is_available ? "متاح" : "غير متاح"}
                        </span>
                        {p.is_limited && (
                          <span className="badge text-xs bg-orange-100 text-orange-700">محدود</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-xl bg-jolen-yellow-light text-yellow-700 flex items-center justify-center hover:bg-jolen-yellow transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h3 className="font-black text-gray-800">
                {editProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الفئة *</label>
                <select {...register("category_id")} className="input-field">
                  <option value="">اختر الفئة</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name_ar}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الاسم عربي *</label>
                  <input {...register("name_ar")} className="input-field" placeholder="فانيلا" />
                  {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الاسم إنجليزي *</label>
                  <input {...register("name_en")} className="input-field" placeholder="Vanilla" dir="ltr" />
                  {errors.name_en && <p className="text-red-500 text-xs mt-1">{errors.name_en.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الوصف</label>
                <textarea {...register("description_ar")} rows={2} className="input-field resize-none" placeholder="وصف المنتج..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">السعر (ريال) *</label>
                  <input {...register("price")} type="number" step="0.5" min="0" className="input-field" />
                
                </div>
                <div>
  <label className="block text-sm font-bold text-gray-700 mb-1">
    المخزون
  </label>
  <input
    {...register("stock")}
    type="number"
    min="0"
    className="input-field"
  />
</div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("is_available")} className="w-4 h-4 rounded text-jolen-pink" />
                  <span className="text-sm font-bold text-gray-700">متاح</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("is_limited")} className="w-4 h-4 rounded text-jolen-pink" />
                  <span className="text-sm font-bold text-gray-700">كمية محدودة</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isPending} className="btn-primary flex-1 disabled:opacity-70">
                  {isPending ? "جاري الحفظ..." : editProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="font-black text-gray-800 mb-2">حذف المنتج؟</h3>
            <p className="text-gray-500 text-sm mb-6">سيتم حذف "{deleteTarget.name_ar}" نهائياً</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteTarget)}
                disabled={isPending}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-colors disabled:opacity-70"
              >
                {isPending ? "جاري الحذف..." : "حذف"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-black hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
