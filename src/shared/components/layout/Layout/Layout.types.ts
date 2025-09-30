import type { ReactNode } from 'react';

export interface LayoutProps {
  /**
   * 헤더에 표시할 제목
   */
  title?: string;

  /**
   * 뒤로가기 버튼 표시 여부
   */
  showBack?: boolean;

  /**
   * 뒤로가기 버튼 클릭 핸들러
   */
  onBack?: () => void;

  /**
   * 메인 콘텐츠 영역에 렌더링할 내용
   */
  children: ReactNode;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}