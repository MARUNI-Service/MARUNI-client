import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth';
import { DashboardPage } from '@/pages/dashboard';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ROUTES } from '@/shared/constants/routes';

/**
 * React Router v7 라우터 설정
 *
 * 구조:
 * - 루트: / → /dashboard로 리다이렉트
 * - 공개 라우트: /login
 * - 보호 라우트: /dashboard (Phase 2 Day 5에서 ProtectedRoute 추가 예정)
 * - 404: 존재하지 않는 모든 경로
 */
export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFoundPage />,
    children: [
      // 루트 경로 - 대시보드로 리다이렉트
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },

      // 공개 라우트 - 인증 페이지
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },

      // 보호된 라우트 - 대시보드 (Day 5에서 ProtectedRoute 추가)
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },

      // 404 페이지 (존재하지 않는 모든 경로)
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
