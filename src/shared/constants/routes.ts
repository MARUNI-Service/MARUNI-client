// 라우트 경로 상수
export const ROUTES = {
  // 공개 라우트
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // 보호된 라우트
  DASHBOARD: '/dashboard',
  CONVERSATION: '/conversation',
  GUARDIANS: '/guardians',
  SETTINGS: '/settings',
} as const;

// 타입 정의
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];