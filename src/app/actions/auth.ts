"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function adminLogin(formData: {
  email: string;
  password: string;
}): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }
  } catch {
    return { error: "تعذّر الاتصال بـ Supabase — تأكد من إعداد .env.local" };
  }

  redirect("/admin/dashboard");
}

export async function adminLogout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
  redirect("/admin/login");
}

export async function getAdminUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
