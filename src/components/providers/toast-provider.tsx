// src/components/providers/toast-provider.tsx
"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand={true}
      richColors
      closeButton
      theme="system"
      duration={4000}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
      }}
    />
  );
}