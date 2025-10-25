import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { DashboardPage } from '@/pages/dashboard';
import { ConversationPage } from '@/pages/conversation';
import { GuardiansPage, GuardianSearchPage, GuardianRequestsPage } from '@/pages/guardians';
import { SettingsPage, ProfilePage, NotificationsPage, PasswordPage } from '@/pages/settings';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/features/auth';
import { ROUTES } from '@/shared/constants/routes';

/**
 * React Router v7 라우터 설정
 *
 * 구조:
 * - 루트: / → /login으로 리다이렉트
 * - 공개 라우트: /login, /register
 * - 보호 라우트: /dashboard, /conversation (ProtectedRoute로 보호)
 * - 404: 존재하지 않는 모든 경로
 */
export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFoundPage />,
    children: [
      // 루트 경로 - 로그인으로 리다이렉트
      {
        index: true,
        element: <Navigate to={ROUTES.LOGIN} replace />,
      },

      // 공개 라우트 - 인증 페이지
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },

      // 보호된 라우트 - 대시보드 (인증 필요)
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },

      // 🆕 Phase 3-4: AI 대화 라우트
      {
        path: ROUTES.CONVERSATION,
        element: (
          <ProtectedRoute>
            <ConversationPage />
          </ProtectedRoute>
        ),
      },

      // 🆕 Phase 3-3: 보호자 관리 라우트
      {
        path: ROUTES.GUARDIANS,
        element: (
          <ProtectedRoute>
            <GuardiansPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.GUARDIANS_SEARCH,
        element: (
          <ProtectedRoute>
            <GuardianSearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.GUARDIANS_REQUESTS,
        element: (
          <ProtectedRoute>
            <GuardianRequestsPage />
          </ProtectedRoute>
        ),
      },

      // 🆕 Phase 3-5: 설정 관리 라우트
      {
        path: ROUTES.SETTINGS,
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SETTINGS_PROFILE,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SETTINGS_NOTIFICATIONS,
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SETTINGS_PASSWORD,
        element: (
          <ProtectedRoute>
            <PasswordPage />
          </ProtectedRoute>
        ),
      },

      // 404 페이지 (존재하지 않는 모든 경로)
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
