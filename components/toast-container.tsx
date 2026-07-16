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
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-xl border bg-card p-4 shadow-lg animate-in slide-in-from-right-full duration-300 ${
            t.variant === "destructive" ? "border-destructive/50" : "border-emerald-500/50"
          }`}
        >
          {t.variant === "destructive" ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          ) : (
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          )}
          <div className="flex-1">
            {t.title && <p className="text-sm font-semibold">{t.title}</p>}
            {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
          </div>
          <button onClick={() => onDismiss(t.id)} className="shrink-0 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
