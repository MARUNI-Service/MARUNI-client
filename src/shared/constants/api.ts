// 기본 API 설정 (서버와 연동 준비)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 서버 API 엔드포인트 (서버 문서 기반)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
  },
} as const;