import type { ButtonProps } from './Button.types';

/**
 * 노인 친화적 버튼 컴포넌트
 *
 * @features
 * - 최소 60px 터치 영역 (large), 72px (extra-large)
 * - 명확한 포커스 표시 (ring-4)
 * - 접근성 지원 (aria-label, disabled 상태)
 * - 노인 친화적 큰 폰트 크기
 * - 부드러운 모서리와 충분한 패딩
 *
 * @example
 * // 기본 사용법
 * <Button variant="primary" size="large">확인</Button>
 *
 * // 전체 너비 버튼
 * <Button variant="primary" size="extra-large" fullWidth>로그인</Button>
 */
export function Button({
  variant = 'primary',
  size = 'large',
  fullWidth = false,
  children,
  disabled = false,
  ...props
}: ButtonProps) {
  // 기본 스타일 - 모든 버튼에 공통 적용
  const baseClasses = [
    'font-semibold',
    'rounded-lg',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-4',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'select-none', // 텍스트 선택 방지
  ];

  // 크기별 스타일 - 노인 친화적 큰 크기
  const sizeClasses = {
    large: [
      'py-4',
      'px-6',
      'text-xl',
      'min-h-[60px]' // UI_CONSTANTS.TOUCH_TARGET.COMFORT
    ],
    'extra-large': [
      'py-5',
      'px-8',
      'text-2xl',
      'min-h-[72px]' // UI_CONSTANTS.TOUCH_TARGET.PRIMARY
    ]
  };

  // 변형별 색상 스타일
  const variantClasses = {
    primary: [
      'bg-blue-600',
      'text-white',
      'hover:bg-blue-700',
      'focus:ring-blue-300',
      'disabled:bg-blue-300'
    ],
    secondary: [
      'bg-gray-100',
      'text-gray-700',
      'border',
      'border-gray-200',
      'hover:bg-gray-200',
      'focus:ring-gray-300',
      'disabled:bg-gray-50',
      'disabled:text-gray-400'
    ]
  };

  // 모든 클래스 합치기
  const allClasses = [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
    fullWidth ? 'w-full' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={allClasses}
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {children}
    </button>
  );
}