import { createPortal } from 'react-dom';
import { useToastStore } from '@/shared/hooks/useToast';
import { Toast } from './Toast';

/**
 * Toast 컨테이너 (Portal로 body에 렌더링)
 * - 위치: 화면 상단 중앙
 * - z-index: 9999 (최상위)
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] space-y-3"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
}
