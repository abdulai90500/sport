import type { Metadata } from "next";
import "@/app/globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin | Inter-Hall Sports",
  description: "Secure admin dashboard for Inter-Hall Sports Championship management.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflowY: "auto", background: "var(--bg-primary)" }}>
        {children}
      </div>
    </div>
  );
}
