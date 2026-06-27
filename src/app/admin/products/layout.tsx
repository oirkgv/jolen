import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminInnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 lg:mr-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
