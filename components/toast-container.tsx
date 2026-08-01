"use client";

import { X, CheckCircle, AlertCircle } from "lucide-react";
import type { Toast } from "@/hooks/use-toast";

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`relative overflow-hidden flex items-start gap-3.5 rounded-[10px] border bg-card/95 glass p-4 shadow-elevated animate-in slide-in-from-right-full duration-300 ${
            t.variant === "destructive" ? "border-destructive/30" : "border-emerald-500/30"
          }`}
        >
          <div className={`absolute inset-y-0 left-0 w-1 ${
            t.variant === "destructive" ? "bg-gradient-to-b from-destructive to-destructive/60" : "bg-gradient-to-b from-emerald-500 to-emerald-500/60"
          }`} />
          {t.variant === "destructive" ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          ) : (
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          )}
          <div className="flex-1">
            {t.title && <p className="text-sm font-semibold">{t.title}</p>}
            {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
          </div>
          <button onClick={() => onDismiss(t.id)} className="shrink-0 rounded-[10px] p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
