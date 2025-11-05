import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { CommonApiResponse } from '@/shared/types/common';
import type { SignupRequest, User } from '../types';

/**
 * 이메일 중복 확인
 * GET /api/join/email-check?memberEmail={email}
 */
export async function checkEmailAvailability(email: string): Promise<{
  available: boolean;
  email: string;
}> {
  const response = await apiClient.get<
    CommonApiResponse<{
      available: boolean;
      email: string;
    }>
  >(`${API_ENDPOINTS.JOIN.EMAIL_CHECK}?memberEmail=${encodeURIComponent(email)}`);

  if (!response.data.data) {
    throw new Error(response.data.message || '이메일 확인 실패');
  }

  return response.data.data;
}

/**
 * 회원가입
 * POST /api/join
 * 요청 본문: { memberEmail, memberName, memberPassword, dailyCheckEnabled }
 */
export async function signup(request: SignupRequest): Promise<User> {
  const response = await apiClient.post<CommonApiResponse<User>>(API_ENDPOINTS.JOIN.SIGNUP, {
    memberEmail: request.memberEmail,
    memberName: request.memberName,
    memberPassword: request.memberPassword,
    dailyCheckEnabled: request.dailyCheckEnabled ?? true, // 기본값
  });

  if (!response.data.data) {
    throw new Error(response.data.message || '회원가입 실패');
  }

  return response.data.data;
}
