import { adminGetDashboardStats, adminGetOrders } from "@/app/actions/orders";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, TrendingUp, Clock, CheckCircle, Package, Star } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let stats = {
    totalOrders: 0, totalRevenue: 0,
    newOrders: 0, preparingOrders: 0,
    readyOrders: 0, deliveredOrders: 0,
  };
  let latestOrders: Awaited<ReturnType<typeof adminGetOrders>> = [];

  try {
    [stats, latestOrders] = await Promise.all([
      adminGetDashboardStats(),
      adminGetOrders(),
    ]);
  } catch {
    // Supabase not configured yet
  }

  const recent = latestOrders.slice(0, 5);

  const statCards = [
    { label: "إجمالي الطلبات", value: stats.totalOrders, icon: ShoppingBag, color: "from-jolen-yellow-light to-white", iconColor: "text-yellow-600", border: "border-jolen-yellow" },
    { label: "الإيرادات", value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: "from-jolen-pink-light to-white", iconColor: "text-pink-600", border: "border-jolen-pink" },
    { label: "طلبات جديدة", value: stats.newOrders, icon: Clock, color: "from-blue-50 to-white", iconColor: "text-blue-600", border: "border-blue-200" },
    { label: "جاهزة للتسليم", value: stats.readyOrders, icon: CheckCircle, color: "from-green-50 to-white", iconColor: "text-green-600", border: "border-green-200" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-800">لوحة التحكم 📊</h1>
        <p className="text-gray-500 font-medium mt-1">مرحباً بك في إدارة جولين</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`card bg-gradient-to-br ${stat.color} border-2 ${stat.border} p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-bold mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center ${stat.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/orders", icon: ShoppingBag, bg: "bg-jolen-yellow-light", iconColor: "text-yellow-700", label: "إدارة الطلبات", sub: `${stats.newOrders} طلب جديد` },
          { href: "/admin/products", icon: Package, bg: "bg-jolen-pink-light", iconColor: "text-pink-700", label: "إدارة المنتجات", sub: "إضافة وتعديل المنتجات" },
          { href: "/admin/addons", icon: Star, bg: "bg-jolen-lavender", iconColor: "text-purple-600", label: "إدارة الإضافات", sub: "إضافة وتعديل الإضافات" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="card p-5 border-2 border-jolen-yellow-light hover:border-jolen-yellow transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={item.iconColor} />
                </div>
                <div>
                  <p className="font-black text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-800">آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-sm text-jolen-pink font-bold hover:text-jolen-pink-dark transition-colors">عرض الكل ←</Link>
        </div>
        <div className="card overflow-hidden border border-gray-100">
          {recent.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">لا توجد طلبات بعد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-gray-800 text-sm">{order.order_number}</p>
                      <span className={`badge text-xs ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{order.customer_name} — {order.customer_phone}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-gray-800">{formatPrice(order.total_amount)}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString("ar-SA")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
