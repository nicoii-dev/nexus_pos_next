"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { ToastContainer } from "@/components/toast-container";
import { useToast } from "@/hooks/use-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toasts, dismiss } = useToast();

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`transition-all duration-300 ${collapsed ? "ml-[68px]" : "ml-64"}`}>
        <div className="hidden lg:block">
          <Navbar />
        </div>
        <div className="lg:hidden">
          <Navbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
        </div>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
