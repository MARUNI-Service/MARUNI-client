import type { InputProps } from './Input.types';
import { useId } from 'react';

/**
 * 노인 친화적 입력 필드 컴포넌트
 *
 * @features
 * - 큰 폰트 크기 (18px+) 및 충분한 패딩
 * - 최소 60px 높이로 터치 영역 확보
 * - 명확한 포커스 표시 (ring-4)
 * - 에러 상태 명확한 표시
 * - 라벨과 입력 필드 연결 (접근성)
 * - 필수 입력 표시
 *
 * @example
 * // 기본 사용법
 * <Input label="이름" placeholder="이름을 입력하세요" />
 *
 * // 에러 상태
 * <Input label="전화번호" error="올바른 전화번호를 입력하세요" />
 *
 * // 필수 입력
 * <Input label="이메일" required />
 */
export function Input({
  label,
  error,
  fullWidth = true,
  helperText,
  required = false,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperTextId = `${inputId}-helper`;

  // 입력 필드 스타일
  const inputClasses = [
    // 기본 스타일
    'text-lg',
    'py-4',
    'px-6',
    'border-2',
    'rounded-lg',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-4',
    'min-h-[60px]',
    'placeholder:text-gray-400',

    // 상태별 색상
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-300 bg-red-50'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-300 bg-white',

    // 비활성 상태
    'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',

    // 너비
    fullWidth ? 'w-full' : ''
  ].filter(Boolean).join(' ');

  // 라벨 스타일
  const labelClasses = [
    'block',
    'text-lg',
    'font-semibold',
    'text-gray-700',
    'mb-2'
  ].join(' ');

  return (
    <div className="space-y-2">
      {/* 라벨 */}
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="필수 입력">
              *
            </span>
          )}
        </label>
      )}

      {/* 입력 필드 */}
      <input
        id={inputId}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[
          error ? errorId : undefined,
          helperText ? helperTextId : undefined
        ].filter(Boolean).join(' ') || undefined}
        aria-required={required}
        {...props}
      />

      {/* 도움말 텍스트 */}
      {helperText && !error && (
        <p
          id={helperTextId}
          className="text-gray-600 text-base"
        >
          {helperText}
        </p>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p
          id={errorId}
          className="text-red-600 text-base font-medium flex items-center"
          role="alert"
        >
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}