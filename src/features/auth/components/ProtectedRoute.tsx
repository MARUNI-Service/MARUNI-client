import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '@/shared/constants/routes';
import { LoadingSpinner } from '@/shared/components';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 보호된 라우트 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 *
 * @example
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 *
 * @features
 * - 인증 상태 확인
 * - 미인증 시 /login 리다이렉트
 * - 초기화 완료 전 로딩 표시 (persist 복원 대기)
 * - 접근성 지원
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized } = useAuth();

  // 초기화 완료 전까지 로딩 표시 (persist 복원 대기)
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 인증된 경우 children 렌더링
  return <>{children}</>;
}
