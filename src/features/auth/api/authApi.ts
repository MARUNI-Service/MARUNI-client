import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { CommonApiResponse } from '@/shared/types/common';
import type { LoginRequest, User } from '../types';

/**
 * 로그인 API
 * Phase 3-8: 3단계 처리
 * 1. POST /api/auth/login → Body에서 토큰 추출
 * 2. localStorage에 토큰 저장 (인터셉터에서 자동 사용)
 * 3. GET /api/members/me → 전체 사용자 정보 조회
 */
export async function login(credentials: LoginRequest): Promise<{
  accessToken: string;
  user: User;
}> {
  // 1. 로그인 요청
  const loginResponse = await apiClient.post<CommonApiResponse<{
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    member: {
      memberId: number;
      memberEmail: string;
      memberName: string;
      dailyCheckEnabled: boolean;
      hasGuardian: boolean;
      managedMembersCount: number;
    };
  }>>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  console.log('📦 로그인 응답:', loginResponse.data);

  // 서버 응답 구조: { code, message, data } - isSuccess 필드 없음
  if (!loginResponse.data.data) {
    throw new Error(loginResponse.data.message || '로그인 실패');
  }

  const { accessToken } = loginResponse.data.data;

  if (!accessToken) {
    throw new Error('로그인 응답에 토큰이 없습니다');
  }

  // 2. 토큰을 localStorage에 저장 (이후 API 호출에서 자동 사용)
  localStorage.setItem('access_token', accessToken);
  console.log('✅ 토큰 저장 완료');

  // 3. 전체 사용자 정보 조회
  const userResponse = await apiClient.get<CommonApiResponse<User>>(
    API_ENDPOINTS.MEMBERS.ME
  );

  if (!userResponse.data.data) {
    throw new Error('사용자 정보 조회 실패');
  }

  console.log('✅ 로그인 성공:', userResponse.data.data.memberEmail);

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
