import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { ApiResponse } from '@/shared/types/common';
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '../types';

/**
 * 로그인 API
 * @param credentials - 사용자 이름과 비밀번호
 * @returns 액세스 토큰, 리프레시 토큰, 사용자 정보
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  return response.data.data;
}

/**
 * 로그아웃 API
 * - 클라이언트 측 로그아웃 (토큰 삭제)
 * - 서버에 로그아웃 엔드포인트가 있다면 호출 가능
 */
export async function logout(): Promise<void> {
  // 필요시 서버에 로그아웃 요청
  // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);

  // 현재는 클라이언트 측에서만 처리
  return Promise.resolve();
}

/**
 * 토큰 갱신 API
 * @param refreshToken - 리프레시 토큰
 * @returns 새로운 액세스 토큰과 리프레시 토큰
 */
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
    API_ENDPOINTS.AUTH.REFRESH,
    { refreshToken }
  );
  return response.data.data;
}
