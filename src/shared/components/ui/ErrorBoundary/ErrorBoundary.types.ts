import type { ReactNode, ErrorInfo } from 'react';

/**
 * ErrorBoundary 컴포넌트 Props
 */
export interface ErrorBoundaryProps {
  /**
   * 에러가 없을 때 표시할 자식 컴포넌트
   */
  children: ReactNode;

  /**
   * 에러 발생 시 표시할 커스텀 UI (선택)
   */
  fallback?: ReactNode;

  /**
   * 에러 발생 시 호출될 콜백 (선택)
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * ErrorBoundary 컴포넌트 State
 */
export interface ErrorBoundaryState {
  /**
   * 에러 발생 여부
   */
  hasError: boolean;

  /**
   * 발생한 에러 객체
   */
  error: Error | null;
}