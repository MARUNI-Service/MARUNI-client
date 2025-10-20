import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps } from './Modal.types';

/**
 * 재사용 가능한 Modal 컴포넌트
 * - ESC 키로 닫기
 * - 배경 클릭 시 닫기 (옵션)
 * - 노인 친화적 큰 텍스트
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
}: ModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[9998]"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // 배경 클릭 시 닫기 방지
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* 제목 */}
        {title && (
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
            {title}
          </h2>
        )}

        {/* 내용 */}
        <div className="text-lg text-gray-700">{children}</div>
      </div>
    </div>,
    document.body
  );
}
