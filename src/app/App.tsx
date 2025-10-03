import { RouterProvider } from 'react-router-dom';
import { router } from './router';

/**
 * 메인 App 컴포넌트
 * React Router v7 기반 라우팅 제공
 */
export function App() {
  return <RouterProvider router={router} />;
}
