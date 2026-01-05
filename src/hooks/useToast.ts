import { useState, useEffect } from 'react';
import { toastService } from '@/services/toast.service';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
}

/**
 * Hook to use toast notifications
 */
export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const unsubscribe = toastService.subscribe((toasts) => {
            setToasts(toasts);
        });

        return unsubscribe;
    }, []);

    return {
        toasts,
        success: (title: string, message?: string) =>
            toastService.success(title, message),
        error: (title: string, message?: string) =>
            toastService.error(title, message),
        info: (title: string, message?: string) =>
            toastService.info(title, message),
        warning: (title: string, message?: string) =>
            toastService.warning(title, message),
        dismiss: (id: string) => toastService.remove(id),
        clear: () => toastService.clear(),
    };
}
