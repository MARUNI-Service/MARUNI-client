import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/shared/constants/api';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import type { ApiError, ApiResponse } from '@/shared/types/common';

/**
 * Axios 인스턴스 생성
 * - baseURL: 환경변수 또는 기본값
 * - timeout: 30초
 * - headers: JSON 통신 설정
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * - 로컬 스토리지에서 액세스 토큰을 가져와 Authorization 헤더에 추가
 * - 토큰이 없으면 헤더 추가 없이 요청 진행 (공개 API용)
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * - 성공 응답: data를 그대로 반환
 * - 에러 응답: 에러 타입에 따라 처리
 *   - 401: 토큰 만료/무효 -> 로그아웃 처리
 *   - 403: 권한 없음
 *   - 500: 서버 에러
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // 401 Unauthorized - 토큰 만료 또는 무효
    if (error.response?.status === 401) {
      // 토큰 제거 및 로그인 페이지로 리다이렉트
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

      // 현재 위치를 저장하여 로그인 후 돌아올 수 있도록 설정
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }

      return Promise.reject(error);
    }

    // 403 Forbidden - 권한 없음
    if (error.response?.status === 403) {
      console.error('접근 권한이 없습니다:', error.response.data);
    }

    // 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('서버 오류가 발생했습니다:', error.response.data);
    }

    // 네트워크 오류
    if (!error.response) {
      console.error('네트워크 연결을 확인해주세요');
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
