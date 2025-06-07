import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type ToastType = 'default' | 'error' | 'warning' | 'success';
export type ToastPosition = 'top' | 'bottom';
export type ToastDuration = 'short' | 'long';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  position: ToastPosition;
}

interface ToastStore {
  toast: Toast | null;
  showToast: (message: string, type?: ToastType, position?: ToastPosition, duration?: ToastDuration) => void;
  clearToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (message, type = 'default', position = 'bottom', duration = 'long') => {
    const id = uuidv4();
    const newToast: Toast = { id, message, type, position };
    set({ toast: newToast });

    setTimeout(
      () => {
        set({ toast: null });
      },
      duration === 'long' ? 5000 : 3000,
    );
  },
  clearToast: () => set({ toast: null }),
}));
