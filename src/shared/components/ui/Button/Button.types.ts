import type { ComponentProps } from 'react';

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'className'> {
  /**
   * 버튼 스타일 변형
   * - primary: 메인 액션용 버튼 (파란색)
   * - secondary: 보조 액션용 버튼 (회색)
   */
  variant?: 'primary' | 'secondary';

  /**
   * 버튼 크기
   * - large: 일반 크기 (60px 높이)
   * - extra-large: 더 큰 크기 (72px 높이)
   */
  size?: 'large' | 'extra-large';

  /**
   * 버튼이 부모 컨테이너의 전체 너비를 차지할지 여부
   */
  fullWidth?: boolean;

  /**
   * 버튼 내부 콘텐츠
   */
  children: React.ReactNode;
}