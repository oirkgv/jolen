"use client";

import { useState, useEffect, useTransition } from "react";
import { adminGetOrders, adminUpdateOrderStatus } from "@/app/actions/orders";
import { Order, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ChevronDown, Search, RefreshCw, Eye, X } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "جديد" },
  { value: "preparing", label: "قيد التحضير" },
  { value: "ready", label: "جاهز" },
  { value: "delivered", label: "تم التسليم" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchOrders = async () => {
    setLoading(true);
    const data = await adminGetOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    startTransition(async () => {
      const result = await adminUpdateOrderStatus(orderId, status);
      if (result.success) {
        toast.success("تم تحديث حالة الطلب ✅");
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status } : null);
        }
      } else {
        toast.error("فشل تحديث الحالة");
      }
    });
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number.includes(search) ||
      o.customer_name.includes(search) ||
      o.customer_phone.includes(search);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-800">الطلبات 🛍️</h1>
          <p className="text-gray-500 font-medium mt-1">{orders.length} طلب إجمالي</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          تحديث
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute top-3.5 right-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب أو الاسم أو الجوال"
            className="input-field pr-10 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          className="input-field bg-white sm:w-48"
        >
          <option value="all">جميع الحالات</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Status pills summary */}
      <div className="flex flex-wrap gap-2">
        {(["all", "new", "preparing", "ready", "delivered"] as const).map((s) => {
          const count = s === "all" ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all ${
                statusFilter === s
                  ? "bg-gray-800 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s === "all" ? "الكل" : ORDER_STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="card overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw size={32} className="animate-spin mx-auto mb-3 opacity-30" />
            <p>جاري التحميل...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">لا توجد طلبات</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-right">
                  <th className="px-4 py-3 text-xs font-black text-gray-500">رقم الطلب</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500">العميل</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 hidden md:table-cell">الاستلام</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500">الإجمالي</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500">الحالة</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 hidden lg:table-cell">التاريخ</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-black text-gray-800 text-sm">{order.order_number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-800 text-sm">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`badge text-xs ${order.delivery_type === "delivery" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                        {order.delivery_type === "delivery" ? "🚗 توصيل" : "🏪 استلام"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-black text-gray-800 text-sm">{formatPrice(order.total_amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          disabled={isPending}
                          className={`appearance-none pr-3 pl-6 py-1.5 rounded-xl text-xs font-black border-0 cursor-pointer focus:outline-none ${ORDER_STATUS_COLORS[order.status]}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={10} className="absolute top-2 left-1 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-8 h-8 rounded-xl bg-jolen-yellow-light text-yellow-700 flex items-center justify-center hover:bg-jolen-yellow transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="font-black text-gray-800">{selectedOrder.order_number}</h3>
                <span className={`badge text-xs mt-1 ${ORDER_STATUS_COLORS[selectedOrder.status]}`}>
                  {ORDER_STATUS_LABELS[selectedOrder.status]}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-black text-gray-500 mb-2">معلومات العميل</p>
                <p className="font-bold text-gray-800">👤 {selectedOrder.customer_name}</p>
                <p className="text-sm text-gray-600">📱 {selectedOrder.customer_phone}</p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.delivery_type === "delivery" ? "🚗 توصيل" : "🏪 استلام"}
                  {selectedOrder.delivery_address && ` — ${selectedOrder.delivery_address}`}
                </p>
                {selectedOrder.notes && (
                  <p className="text-sm text-gray-500 italic">📝 {selectedOrder.notes}</p>
                )}
              </div>

              {/* Items */}
              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div>
                  <p className="text-xs font-black text-gray-500 mb-2">المنتجات</p>
                  <div className="space-y-2">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="bg-jolen-yellow-light rounded-2xl p-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-gray-800 text-sm">{item.product_name_ar} × {item.quantity}</span>
                          <span className="font-black text-gray-800 text-sm">{formatPrice(item.subtotal)}</span>
                        </div>
                        {item.order_item_addons && item.order_item_addons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.order_item_addons.map((a) => (
                              <span key={a.id} className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full">
                                {a.addon_name_ar}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total + change status */}
              <div className="flex items-center justify-between bg-gradient-to-r from-jolen-yellow-light to-jolen-pink-light rounded-2xl p-4">
                <span className="font-black text-gray-800">الإجمالي</span>
                <span className="font-black text-xl text-jolen-pink-dark">{formatPrice(selectedOrder.total_amount)}</span>
              </div>

              <div>
                <p className="text-xs font-black text-gray-500 mb-2">تغيير الحالة</p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleStatusChange(selectedOrder.id, s.value)}
                      disabled={isPending}
                      className={`py-2.5 px-3 rounded-2xl text-sm font-black transition-all ${
                        selectedOrder.status === s.value
                          ? ORDER_STATUS_COLORS[s.value] + " ring-2 ring-offset-1 ring-current"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
