// 라우트 경로 상수
export const ROUTES = {
  // 공개 라우트
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // 보호된 라우트
  DASHBOARD: '/dashboard',
  CONVERSATION: '/conversation',

  // 보호자 관리 (Phase 3-3)
  GUARDIANS: '/guardians',
  GUARDIANS_SEARCH: '/guardians/search',
  GUARDIANS_REQUESTS: '/guardians/requests',

  // 설정 관리 (Phase 3-5)
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_PASSWORD: '/settings/password',
} as const;

// 타입 정의
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];