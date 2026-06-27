"use server";

import { createClient } from "@/lib/supabase/server";
import { CartItem, CheckoutFormData, Order, OrderStatus } from "@/types";
import { revalidatePath } from "next/cache";

export async function createOrder(
  formData: CheckoutFormData,
  cartItems: CartItem[]
): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + (item.basePrice + item.addonsTotal) * item.quantity,
      0
    );

    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const orderNumber = `JLN-${String((count ?? 0) + 1).padStart(4, "0")}`;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        delivery_type: formData.delivery_type,
        delivery_address: formData.delivery_address || null,
        notes: formData.notes || null,
        status: "new",
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    for (const item of cartItems) {
      const { data: orderItem, error: itemError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          product_id: item.productId,
          product_name_ar: item.productName,
          product_name_en: item.productNameEn,
          quantity: item.quantity,
          unit_price: item.basePrice + item.addonsTotal,
          subtotal: (item.basePrice + item.addonsTotal) * item.quantity,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      if (item.addons.length > 0) {
        const { error: addonError } = await supabase
          .from("order_item_addons")
          .insert(
            item.addons.map((addon) => ({
              order_item_id: orderItem.id,
              addon_id: addon.id,
              addon_name_ar: addon.name_ar,
              addon_name_en: addon.name_en,
              price: addon.price,
            }))
          );
        if (addonError) throw addonError;
      }
    }

    revalidatePath("/admin/orders");
    return { success: true, orderNumber };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error: "فشل إنشاء الطلب، يرجى المحاولة مجدداً" };
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items(*, order_item_addons(*))`)
    .eq("order_number", orderNumber)
    .single();
  if (error) return null;
  return data as unknown as Order;
}

export async function adminGetOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items(*, order_item_addons(*))`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as Order[]) || [];
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function adminGetDashboardStats() {
  const supabase = await createClient();

  const [allRes, newRes, preparingRes, readyRes] = await Promise.all([
    supabase.from("orders").select("id, total_amount, status"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "preparing"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "ready"),
  ]);

  const orders = allRes.data || [];
  const totalRevenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);

  return {
    totalOrders: orders.length,
    totalRevenue,
    newOrders: newRes.count || 0,
    preparingOrders: preparingRes.count || 0,
    readyOrders: readyRes.count || 0,
    deliveredOrders: orders.filter((o) => o.status === "delivered").length,
  };
}
