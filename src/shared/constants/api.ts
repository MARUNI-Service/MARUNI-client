// 기본 API 설정 (서버와 연동 준비)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 서버 API 엔드포인트 (서버 문서 기반)
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
  },

  // 회원가입
  JOIN: {
    SIGNUP: '/join',
    EMAIL_CHECK: '/join/email-check',
  },

  // 회원 관리
  MEMBERS: {
    ME: '/members/me',
    SEARCH: '/members/search',
    UPDATE_ME: '/members/me',
    DELETE_ME: '/members/me',
    MANAGED_MEMBERS: '/members/me/managed-members',
    DAILY_CHECK: '/members/me/daily-check',
    REMOVE_GUARDIAN: '/members/me/guardian',
  },

  // AI 대화
  CONVERSATIONS: {
    SEND_MESSAGE: '/conversations/messages',
    HISTORY: '/conversations/history',
  },

  // 보호자 관계
  GUARDIANS: {
    REQUESTS: '/guardians/requests',
    ACCEPT: (id: number) => `/guardians/requests/${id}/accept`,
    REJECT: (id: number) => `/guardians/requests/${id}/reject`,
  },

  // 이상징후 감지
  ALERT_RULES: {
    LIST: '/alert-rules',
    DETAIL: (id: number) => `/alert-rules/${id}`,
    CREATE: '/alert-rules',
    UPDATE: (id: number) => `/alert-rules/${id}`,
    DELETE: (id: number) => `/alert-rules/${id}`,
    TOGGLE: (id: number) => `/alert-rules/${id}/toggle`,
    HISTORY: '/alert-rules/history',
    HISTORY_DETAIL: (id: number) => `/alert-rules/history/${id}`,
    DETECT: '/alert-rules/detect',
  },
} as const;