/**
 * Toast 메시지 타입
 */
export type ToastType = 'success' | 'error' | 'info';

/**
 * Toast 객체
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ms, default 3000
}

/**
 * Toast 컴포넌트 Props
 */
export interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

/**
 * ToastContainer는 props가 필요 없음 (Portal로 렌더링)
 */
