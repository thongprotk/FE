import {
  X,
  CheckCircle2,
  AlertCircle,
  InfoIcon,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  };
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    // Auto-remove after 5 seconds if not already removed
    const timeout = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timeout);
  }, [onDismiss]);

  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-yellow-50 border-yellow-200",
  }[toast.type];

  const iconColor = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
    warning: "text-yellow-600",
  }[toast.type];

  const titleColor = {
    success: "text-green-900",
    error: "text-red-900",
    info: "text-blue-900",
    warning: "text-yellow-900",
  }[toast.type];

  const messageColor = {
    success: "text-green-700",
    error: "text-red-700",
    info: "text-blue-700",
    warning: "text-yellow-700",
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: InfoIcon,
    warning: AlertTriangle,
  }[toast.type];

  return (
    <div
      className={`border rounded-lg shadow-md p-4 flex gap-3 animate-in fade-in slide-in-from-right-5 duration-300 pointer-events-auto ${bgColor}`}
    >
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${titleColor}`}>{toast.title}</p>
        {toast.message && (
          <p className={`text-sm mt-1 ${messageColor}`}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
