"use client";

import { useEffect, useState } from "react";

type Toast = {
  id: number;
  message: string;
};

export function showToast(message: string) {
  window.dispatchEvent(
    new CustomEvent("disasteriq-toast", {
      detail: message,
    })
  );
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function handleToast(event: Event) {
      const message = (event as CustomEvent).detail;
      const id = Date.now();

      setToasts((current) => [...current, { id, message }]);

      setTimeout(() => {
        setToasts((current) =>
          current.filter((toast) => toast.id !== id)
        );
      }, 3000);
    }

    window.addEventListener("disasteriq-toast", handleToast);

    return () => {
      window.removeEventListener("disasteriq-toast", handleToast);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[200] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-xs text-green-300 shadow-xl backdrop-blur"
        >
          ✓ {toast.message}
        </div>
      ))}
    </div>
  );
}