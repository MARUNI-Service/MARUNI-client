import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { CommonApiResponse } from '@/shared/types/common';
import type { LoginRequest, User } from '../types';

/**
 * 로그인 API
 * Phase 3-8: 2단계 처리
 * 1. POST /api/auth/login → 헤더에서 토큰 추출
 * 2. GET /api/members/me → 사용자 정보 조회
 */
export async function login(credentials: LoginRequest): Promise<{
  accessToken: string;
  user: User;
}> {
  // 1. 로그인 요청
  const loginResponse = await apiClient.post<CommonApiResponse<null>>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  // 2. 헤더에서 토큰 추출 (인터셉터에서 자동으로 localStorage에 저장)
  const authHeader = loginResponse.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('로그인 응답에 토큰이 없습니다');
  }
  const accessToken = authHeader.substring(7);

  // 3. 사용자 정보 조회
  const userResponse = await apiClient.get<CommonApiResponse<User>>(
    API_ENDPOINTS.MEMBERS.ME
  );

  if (!userResponse.data.isSuccess || !userResponse.data.data) {
    throw new Error('사용자 정보 조회 실패');
  }

  return {
    accessToken,
    user: userResponse.data.data,
  };
}

/**
 * 로그아웃 API
 * - 클라이언트 전용 (서버 호출 불필요)
 */
export async function logout(): Promise<void> {
  localStorage.removeItem('access_token');
  return Promise.resolve();
}
