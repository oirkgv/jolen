"use client";

import { adminLogout } from "@/app/actions/auth";
import { LayoutDashboard, ShoppingBag, Package, Star, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/admin/orders", icon: ShoppingBag, label: "الطلبات" },
  { href: "/admin/products", icon: Package, label: "المنتجات" },
  { href: "/admin/addons", icon: Star, label: "الإضافات" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-white rounded-2xl shadow-md flex items-center justify-center text-gray-600"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white border-l border-gray-100 shadow-xl z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-jolen-yellow-light to-jolen-pink-light border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-jolen-yellow to-jolen-pink flex items-center justify-center text-white font-black">
              J
            </div>
            <div>
              <p className="font-black text-gray-800">جولين</p>
              <p className="text-xs text-gray-500">لوحة التحكم</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-jolen-yellow-light to-jolen-pink-light text-gray-800 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon size={18} className={isActive ? "text-jolen-pink-dark" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
            >
              <LogOut size={18} />
              تسجيل الخروج
            </button>
          </form>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-gray-50 transition-colors font-medium text-xs mt-1"
          >
            ← زيارة المتجر
          </Link>
        </div>
      </aside>
    </>
  );
}
