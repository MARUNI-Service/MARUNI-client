import type { ReactNode } from 'react';

export interface CardProps {
  /**
   * 카드 내부 콘텐츠
   */
  children: ReactNode;

  /**
   * 클릭 가능한 카드인지 여부
   */
  clickable?: boolean;

  /**
   * 카드 내부 패딩 크기
   */
  padding?: 'small' | 'medium' | 'large';

  /**
   * 카드 그림자 강도
   */
  shadow?: 'none' | 'small' | 'medium' | 'large';

  /**
   * 카드 테두리 둥글기
   */
  rounded?: 'none' | 'small' | 'medium' | 'large';

  /**
   * 클릭 핸들러 (clickable이 true일 때)
   */
  onClick?: () => void;
}