"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductWithAddons, Category } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

export async function getProducts(): Promise<ProductWithAddons[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, categories(*), product_addons(addons(*))`)
    .eq("is_available", true)
    .order("sort_order");
  if (error) throw error;
  return (data as unknown as ProductWithAddons[]) || [];
}

export async function getProductById(id: string): Promise<ProductWithAddons | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, categories(*), product_addons(addons(*))`)
    .eq("id", id)
    .single();
  if (error) return null;
  return data as unknown as ProductWithAddons;
}

export async function getProductsByCategory(): Promise<
  { category: Category; products: ProductWithAddons[] }[]
> {
  const categories = await getCategories();
  const products = await getProducts();
  return categories.map((category) => ({
    category,
    products: products.filter((p) => p.category_id === category.id),
  }));
}

export async function adminGetAllProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, categories(*)`)
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

export async function adminCreateProduct(formData: {
  category_id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  price: number;
  is_available: boolean;
  is_limited: boolean;
  sort_order: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").insert(formData);
  if (error) throw error;
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function adminUpdateProduct(
  id: string,
  formData: {
    category_id?: string;
    name_ar?: string;
    name_en?: string;
    description_ar?: string;
    price?: number;
    is_available?: boolean;
    is_limited?: boolean;
    sort_order?: number;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update(formData).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function adminDeleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/products");
  revalidatePath("/");
}
