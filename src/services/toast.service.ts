/**
 * Toast Notification Service
 * Provides simple toast notifications across the app
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
    duration?: number;
}

// Simple in-memory toast queue
let toastQueue: Toast[] = [];
let listeners: Set<(toasts: Toast[]) => void> = new Set();

export const toastService = {
    /**
     * Subscribe to toast changes
     */
    subscribe(callback: (toasts: Toast[]) => void): () => void {
        listeners.add(callback);
        return () => listeners.delete(callback);
    },

    /**
     * Get current toasts
     */
    getToasts(): Toast[] {
        return [...toastQueue];
    },

    /**
     * Show success toast
     */
    success(title: string, message?: string, duration = 4000): string {
        return this.show('success', title, message || '', duration);
    },

    /**
     * Show error toast
     */
    error(title: string, message?: string, duration = 5000): string {
        return this.show('error', title, message || '', duration);
    },

    /**
     * Show info toast
     */
    info(title: string, message?: string, duration = 3000): string {
        return this.show('info', title, message || '', duration);
    },

    /**
     * Show warning toast
     */
    warning(title: string, message?: string, duration = 4000): string {
        return this.show('warning', title, message || '', duration);
    },

    /**
     * Show custom toast
     */
    show(
        type: ToastType,
        title: string,
        message: string = '',
        duration = 4000
    ): string {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const toast: Toast = { id, type, title, message, duration };

        toastQueue.push(toast);
        this.notifyListeners();

        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }

        return id;
    },

    /**
     * Remove toast by ID
     */
    remove(id: string): void {
        toastQueue = toastQueue.filter((t) => t.id !== id);
        this.notifyListeners();
    },

    /**
     * Clear all toasts
     */
    clear(): void {
        toastQueue = [];
        this.notifyListeners();
    },

    /**
     * Notify all listeners of changes
     */
    notifyListeners(): void {
        const toasts = [...toastQueue];
        listeners.forEach((callback) => callback(toasts));
    },
};
