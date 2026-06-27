export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  emoji: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_limited: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  categories?: Category;
  addons?: Addon[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  price_override: number | null;
  is_available: boolean;
  sort_order: number;
}

export interface Addon {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithAddons extends Product {
  product_addons: { addons: Addon }[];
  category: Category | null;
}

export type OrderStatus = "new" | "preparing" | "ready" | "delivered";
export type DeliveryType = "pickup" | "delivery";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  delivery_address: string | null;
  notes: string | null;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_variant_id: string | null;
  product_name_ar: string;
  product_name_en: string;
  variant_name_ar: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  order_item_addons?: OrderItemAddon[];
}

export interface OrderItemAddon {
  id: string;
  order_item_id: string;
  addon_id: string | null;
  addon_name_ar: string;
  addon_name_en: string;
  price: number;
}

// Cart types (Zustand)
export interface CartAddon {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
}

export interface CartItem {
  cartId: string; // unique per cart entry
  productId: string;
  productName: string;
  productNameEn: string;
  price: number; // unit price including addons
  basePrice: number;
  quantity: number;
  addons: CartAddon[];
  addonsTotal: number;
}

export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  delivery_address?: string;
  notes?: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "جديد",
  preparing: "قيد التحضير",
  ready: "جاهز",
  delivered: "تم التسليم",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  preparing: "bg-yellow-100 text-yellow-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-gray-100 text-gray-600",
};
