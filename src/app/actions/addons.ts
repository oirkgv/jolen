"use server";

import { createClient } from "@/lib/supabase/server";
import { Addon } from "@/types";
import { revalidatePath } from "next/cache";

export async function getAddons(): Promise<Addon[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addons")
    .select("*")
    .eq("is_available", true)
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

export async function adminGetAllAddons(): Promise<Addon[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addons")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

export async function adminCreateAddon(formData: {
  name_ar: string;
  name_en: string;
  price: number;
  is_available: boolean;
  sort_order: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("addons").insert(formData);
  if (error) throw error;
  revalidatePath("/admin/addons");
}

export async function adminUpdateAddon(
  id: string,
  formData: {
    name_ar?: string;
    name_en?: string;
    price?: number;
    is_available?: boolean;
    sort_order?: number;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("addons").update(formData).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/addons");
}

export async function adminDeleteAddon(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("addons").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/addons");
}
