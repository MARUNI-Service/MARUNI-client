import axios from 'axios';
import { API_BASE_URL } from '@/shared/constants/api';
import type { ApiError } from '@/shared/types/common';

/**
 * Axios 인스턴스 생성
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request 인터셉터: JWT 토큰 자동 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response 인터셉터: 토큰 추출 및 에러 처리
 */
apiClient.interceptors.response.use(
  (response) => {
    // 로그인 응답인 경우 헤더에서 토큰 추출
    const authHeader = response.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      localStorage.setItem('access_token', token);
    }

    return response;
  },
  (error) => {
    // 401 Unauthorized - 자동 로그아웃
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

/**
 * API 에러 추출 헬퍼 함수
 * - AxiosError에서 사용자에게 보여줄 메시지를 추출
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.message || error.message || '알 수 없는 오류가 발생했습니다';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다';
}

/**
 * API 에러 코드 추출 헬퍼 함수
 */
export function getApiErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.code;
  }

  return undefined;
}
