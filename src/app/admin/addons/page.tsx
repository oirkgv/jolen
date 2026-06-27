"use client";

import { useState, useEffect, useTransition } from "react";
import {
  adminGetAllAddons,
  adminCreateAddon,
  adminUpdateAddon,
  adminDeleteAddon,
} from "@/app/actions/addons";
import { Addon } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name_ar: z.string().min(1, "مطلوب"),
  name_en: z.string().min(1, "مطلوب"),
  price: z.coerce.number().min(0),
  is_available: z.boolean(),
  sort_order: z.coerce.number().default(0),
});

type FormData = z.infer<typeof schema>;

export default function AdminAddonsPage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAddon, setEditAddon] = useState<Addon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Addon | null>(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_available: true, sort_order: 0, price: 0 },
  });

  const fetch = async () => {
    setLoading(true);
    const data = await adminGetAllAddons();
    setAddons(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    reset({ is_available: true, sort_order: 0, price: 0 });
    setEditAddon(null);
    setShowForm(true);
  };

  const openEdit = (a: Addon) => {
    setEditAddon(a);
    reset({
      name_ar: a.name_ar,
      name_en: a.name_en,
      price: a.price,
      is_available: a.is_available,
      sort_order: a.sort_order,
    });
    setShowForm(true);
  };

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        if (editAddon) {
          await adminUpdateAddon(editAddon.id, data);
          toast.success("تم تحديث الإضافة ✅");
        } else {
          await adminCreateAddon(data);
          toast.success("تم إضافة الإضافة 🎉");
        }
        setShowForm(false);
        fetch();
      } catch {
        toast.error("حدث خطأ ما");
      }
    });
  };

  const handleDelete = (a: Addon) => {
    startTransition(async () => {
      try {
        await adminDeleteAddon(a.id);
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
          <h1 className="text-3xl font-black text-gray-800">الإضافات ✨</h1>
          <p className="text-gray-500 font-medium mt-1">{addons.length} إضافة</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          إضافة جديدة
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((addon) => (
            <div key={addon.id} className="card border-2 border-jolen-yellow-light p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800">{addon.name_ar}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{addon.name_en}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-black text-jolen-pink-dark text-sm">
                      {addon.price === 0 ? "مجاني" : `+${formatPrice(addon.price)}`}
                    </span>
                    <span className={`badge text-xs ${addon.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {addon.is_available ? "متاح" : "غير متاح"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEdit(addon)}
                    className="w-8 h-8 rounded-xl bg-jolen-yellow-light text-yellow-700 flex items-center justify-center hover:bg-jolen-yellow transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(addon)}
                    className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-black text-gray-800">
                {editAddon ? "تعديل الإضافة" : "إضافة جديدة"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الاسم عربي *</label>
                  <input {...register("name_ar")} className="input-field" placeholder="أوريو" />
                  {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الاسم إنجليزي *</label>
                  <input {...register("name_en")} className="input-field" placeholder="Oreo" dir="ltr" />
                  {errors.name_en && <p className="text-red-500 text-xs mt-1">{errors.name_en.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">السعر الإضافي</label>
                  <input {...register("price")} type="number" step="0.5" min="0" className="input-field" />
                  <p className="text-xs text-gray-400 mt-1">0 = مجاني</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الترتيب</label>
                  <input {...register("sort_order")} type="number" min="0" className="input-field" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("is_available")} className="w-4 h-4 rounded" />
                <span className="text-sm font-bold text-gray-700">متاح</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isPending} className="btn-primary flex-1 disabled:opacity-70">
                  {isPending ? "جاري الحفظ..." : editAddon ? "حفظ التعديلات" : "إضافة"}
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
            <h3 className="font-black text-gray-800 mb-2">حذف الإضافة؟</h3>
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
