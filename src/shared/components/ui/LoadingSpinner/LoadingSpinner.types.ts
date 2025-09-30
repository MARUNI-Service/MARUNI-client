export interface LoadingSpinnerProps {
  /**
   * 스피너 크기
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 로딩 메시지
   * @default '로딩 중...'
   */
  label?: string;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}