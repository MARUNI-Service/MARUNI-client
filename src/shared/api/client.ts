import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/shared/constants/api';
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
 * - Zustand store에서 액세스 토큰을 가져와 Authorization 헤더에 추가
 * - 토큰이 없으면 헤더 추가 없이 요청 진행 (공개 API용)
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Zustand persist storage에서 토큰 가져오기
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        const token = state?.accessToken;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('토큰 파싱 실패:', error);
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 토큰 갱신 중복 요청 방지 플래그
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * 응답 인터셉터
 * - 성공 응답: data를 그대로 반환
 * - 에러 응답: 에러 타입에 따라 처리
 *   - 401: 토큰 자동 갱신 시도 -> 실패 시 로그아웃
 *   - 403: 권한 없음
 *   - 500: 서버 에러
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 Unauthorized - 토큰 자동 갱신 시도
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // 로그인 요청이나 토큰 갱신 요청은 재시도하지 않음
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      // 이미 갱신 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Zustand persist storage에서 refreshToken 가져오기
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) {
        isRefreshing = false;
        // 로그아웃 처리
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
        return Promise.reject(error);
      }

      try {
        const { state } = JSON.parse(authStorage);
        const refreshToken = state?.refreshToken;

        if (!refreshToken) {
          throw new Error('리프레시 토큰이 없습니다');
        }

        // 토큰 갱신 요청 (순환 의존성 방지를 위해 직접 호출)
        const response = await axios.post<
          ApiResponse<{ accessToken: string; refreshToken: string }>
        >(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Zustand storage 업데이트
        const updatedState = {
          ...state,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
        localStorage.setItem(
          'auth-storage',
          JSON.stringify({
            state: updatedState,
            version: 0,
          })
        );

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        isRefreshing = false;

        // 토큰 갱신 실패 시 로그아웃 처리
        localStorage.removeItem('auth-storage');
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }

        return Promise.reject(refreshError);
      }
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
