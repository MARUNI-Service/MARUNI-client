import axios from 'axios';
import { API_BASE_URL } from '@/shared/constants/api';
import type { ApiError } from '@/shared/types/common';

/**
 * Axios 인스턴스 생성 (MVP 단순화 버전)
 * - Phase 3-1 ~ 3-7: Mock 데이터 사용하므로 복잡한 인터셉터 불필요
 * - Phase 3-8: API 연결 시 필요한 인터셉터 추가
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔴 Phase 3-1 ~ 3-7: Mock 데이터 사용하므로 인터셉터 불필요
// Phase 3-8 API 연결 시 아래 주석 해제하여 사용
// - 요청 인터셉터: Authorization 헤더 추가
// - 응답 인터셉터: 401 토큰 갱신, 403/500 에러 처리

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
