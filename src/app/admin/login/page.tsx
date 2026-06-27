"use client";

import { useState } from "react";
import { adminLogin } from "@/app/actions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور قصيرة"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    const result = await adminLogin(data);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-jolen-yellow rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-jolen-pink rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-jolen-yellow to-jolen-pink flex items-center justify-center text-white font-black text-3xl shadow-2xl mx-auto mb-4">
            J
          </div>
          <h1 className="text-2xl font-black text-gray-800">لوحة التحكم</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">جولين | JOLEN</p>
        </div>

        <div className="card p-8 border-2 border-jolen-yellow-light">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail size={16} className="absolute top-3.5 right-4 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="admin@jolen.com"
                  dir="ltr"
                  className="input-field pr-10"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
              <div className="relative">
                <Lock size={16} className="absolute top-3.5 right-4 text-gray-400" />
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  dir="ltr"
                  className="input-field pr-10 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-3.5 left-4 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3 disabled:opacity-70"
            >
              {loading ? "جاري الدخول..." : "تسجيل الدخول 🔐"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
