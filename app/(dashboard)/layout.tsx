"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { RoleGuard } from "@/components/role-guard";
import { ToastContainer } from "@/components/toast-container";
import { useToast } from "@/hooks/use-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toasts, dismiss } = useToast();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="fixed inset-0 mesh-gradient pointer-events-none opacity-40" />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`relative transition-all duration-300 ease-out ${collapsed ? "ml-[72px]" : "ml-64"}`}>
        <div className="hidden lg:block">
          <Navbar />
        </div>
        <div className="lg:hidden">
          <Navbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
        </div>
        <main className="p-5 lg:p-8">
          <RoleGuard>{children}</RoleGuard>
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
