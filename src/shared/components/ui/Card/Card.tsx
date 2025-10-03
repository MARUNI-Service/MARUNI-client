import type { CardProps } from './Card.types';

/**
 * 노인 친화적 카드 컴포넌트
 *
 * @features
 * - 콘텐츠 그룹핑을 위한 컨테이너
 * - 클릭 가능한 카드 지원 (button 역할)
 * - 명확한 포커스 표시
 * - 다양한 패딩과 그림자 옵션
 * - 접근성 속성 지원
 *
 * @example
 * // 기본 사용법
 * <Card>
 *   <h3>카드 제목</h3>
 *   <p>카드 내용</p>
 * </Card>
 *
 * // 클릭 가능한 카드
 * <Card clickable onClick={() => console.log('클릭!')}>
 *   <p>클릭할 수 있는 카드</p>
 * </Card>
 */
export function Card({
  children,
  clickable = false,
  padding = 'medium',
  shadow = 'small',
  rounded = 'medium',
  className = '',
  onClick
}: CardProps) {
  // 기본 스타일
  const baseClasses = [
    'bg-white',
    'border',
    'border-gray-200',
    'transition-all',
    'duration-200'
  ];

  // 패딩 스타일
  const paddingClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  // 그림자 스타일
  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg'
  };

  // 둥글기 스타일
  const roundedClasses = {
    none: '',
    small: 'rounded-md',
    medium: 'rounded-lg',
    large: 'rounded-xl'
  };

  // 클릭 가능한 카드의 상호작용 스타일
  const interactiveClasses = clickable ? [
    'cursor-pointer',
    'hover:shadow-md',
    'hover:border-gray-300',
    'focus:outline-none',
    'focus:ring-4',
    'focus:ring-blue-300',
    'focus:border-blue-500',
    'active:scale-[0.98]',
    'select-none'
  ] : [];

  // 모든 클래스 합치기
  const allClasses = [
    ...baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    roundedClasses[rounded],
    ...interactiveClasses,
    className
  ].filter(Boolean).join(' ');

  // 클릭 가능한 카드는 button으로, 아니면 div로 렌더링
  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={allClasses}
      {...(clickable && {
        type: 'button',
        role: 'button',
        tabIndex: 0,
        onClick
      })}
    >
      {children}
    </Component>
  );
}