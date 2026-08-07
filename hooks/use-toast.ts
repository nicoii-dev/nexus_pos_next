"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toasts: Toast[] = [];
const listeners = new Set<() => void>();
let toastCount = 0;
const EMPTY_TOASTS: Toast[] = [];

function emit() {
  for (const listener of listeners) listener();
}

export function useToast() {
  const state = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => toasts,
    () => EMPTY_TOASTS
  );

  const toast = useCallback(
    ({ title, description, variant }: Omit<Toast, "id">) => {
      const id = String(++toastCount);
      toasts = [...toasts, { id, title, description, variant }];
      emit();
      setTimeout(() => {
        toasts = toasts.filter((t) => t.id !== id);
        emit();
      }, 3000);
      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, []);

  return { toasts: state, toast, dismiss };
}
