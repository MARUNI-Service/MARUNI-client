import type { LoadingSpinnerProps } from './LoadingSpinner.types';

/**
 * 노인 친화적 로딩 스피너 컴포넌트
 *
 * @example
 * <LoadingSpinner size="large" label="데이터 불러오는 중..." />
 *
 * @features
 * - 3가지 크기 (small, medium, large)
 * - 명확한 로딩 메시지
 * - 접근성 지원 (role="status", aria-live)
 * - 애니메이션 (회전)
 */
export function LoadingSpinner({
  size = 'medium',
  label = '로딩 중...',
  className = '',
}: LoadingSpinnerProps) {
  // 크기별 클래스 정의
  const sizeClasses = {
    small: 'w-8 h-8 border-2',
    medium: 'w-12 h-12 border-[3px]',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* 회전 애니메이션 스피너 */}
      <div
        className={`
          ${sizeClasses[size]}
          border-blue-200
          border-t-blue-600
          rounded-full
          animate-spin
        `}
        aria-hidden="true"
      />

      {/* 로딩 텍스트 (노인 친화적 크기) */}
      {label && <p className="text-lg font-medium text-gray-700">{label}</p>}
    </div>
  );
}