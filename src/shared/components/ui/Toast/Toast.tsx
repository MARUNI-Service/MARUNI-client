import { useEffect } from 'react';
import type { ToastProps } from './Toast.types';

const TOAST_STYLES = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

const TOAST_ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

/**
 * Toast 메시지 컴포넌트
 * - 노인 친화적 큰 폰트 (text-xl)
 * - 자동 사라짐 (3초 default)
 * - fade-in/out 애니메이션
 */
export function Toast({ toast, onRemove }: ToastProps) {
  const { id, message, type, duration = 3000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <div
      className={`
        ${TOAST_STYLES[type]}
        rounded-2xl px-6 py-4 shadow-lg
        flex items-center gap-4
        animate-fade-in
        min-w-[320px] max-w-md
      `}
      role="alert"
      aria-live="polite"
    >
      {/* 아이콘 */}
      <span className="text-3xl font-bold">{TOAST_ICONS[type]}</span>

      {/* 메시지 */}
      <p className="text-xl font-medium flex-1">{message}</p>

      {/* 닫기 버튼 */}
      <button
        onClick={() => onRemove(id)}
        className="text-2xl hover:opacity-80 transition-opacity"
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
}
