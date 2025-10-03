import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from '@/shared/components';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * 모든 Provider를 통합하는 컴포넌트
 *
 * Provider 계층 구조:
 * 1. ErrorBoundary (최상위 - 전역 에러 캐치)
 * 2. QueryProvider (TanStack Query)
 * 3. 향후 추가될 Provider들...
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 전역 에러 로깅
        console.error('Global error caught:', error, errorInfo);
        // 향후: 에러 트래킹 서비스에 전송 (Sentry 등)
      }}
    >
      <QueryProvider>{children}</QueryProvider>
    </ErrorBoundary>
  );
}
