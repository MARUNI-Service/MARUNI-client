import { Component, type ReactNode, type ErrorInfo } from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary.types';
import { Button } from '../Button';

/**
 * 노인 친화적 에러 바운더리 컴포넌트
 *
 * @example
 * <ErrorBoundary onError={(error) => console.error(error)}>
 *   <App />
 * </ErrorBoundary>
 *
 * @features
 * - React 에러 캐치 및 처리
 * - 노인 친화적 에러 UI
 * - 다시 시도 버튼
 * - 홈으로 가기 버튼
 * - 개발 환경에서 에러 상세 표시
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * 에러 발생 시 state 업데이트
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * 에러 캐치 및 로깅
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 콘솔에 에러 로깅
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 부모 컴포넌트에 에러 전달
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * 에러 상태 초기화 (다시 시도)
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  /**
   * 홈으로 이동
   */
  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 커스텀 fallback UI가 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI (노인 친화적)
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            {/* 에러 아이콘 */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* 에러 메시지 */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              문제가 발생했습니다
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              일시적인 문제가 발생했습니다.
              <br />
              다시 시도해 주세요.
            </p>

            {/* 개발 환경: 에러 상세 표시 */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <p className="text-sm font-semibold text-red-600 mb-2">
                  개발 모드 - 에러 상세:
                </p>
                <p className="text-sm font-mono text-red-600 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={this.handleReset}
              >
                다시 시도
              </Button>
              <Button
                variant="secondary"
                size="large"
                fullWidth
                onClick={this.handleGoHome}
              >
                홈으로 가기
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}