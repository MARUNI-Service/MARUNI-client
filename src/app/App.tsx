import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';

/**
 * 메인 App 컴포넌트
 * React Router v7 기반 라우팅 제공
 * ErrorBoundary로 런타임 에러 캐치
 */
export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer />
    </ErrorBoundary>
  );
}
