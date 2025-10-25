import { create } from 'zustand';
import type { Toast, ToastType } from '@/shared/components/ui/Toast/Toast.types';

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

/**
 * Toast 상태 관리 (Zustand)
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (message, type, duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, message, type, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

/**
 * Toast 편의 함수 훅
 *
 * @example
 * const toast = useToast();
 * toast.success('성공했습니다!');
 * toast.error('오류가 발생했습니다');
 * toast.info('알림 메시지');
 */
export function useToast() {
  const { addToast } = useToastStore();

  return {
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
  };
}
