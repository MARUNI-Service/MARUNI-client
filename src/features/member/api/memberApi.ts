import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { CommonApiResponse } from '@/shared/types/common';
import type { User } from '@/features/auth/types';
import type { UpdateMemberRequest } from '../types';

/**
 * 내 정보 조회
 * GET /api/members/me
 */
export async function getMyInfo(): Promise<User> {
  const response = await apiClient.get<CommonApiResponse<User>>(API_ENDPOINTS.MEMBERS.ME);

  if (!response.data.data) {
    throw new Error(response.data.message || '내 정보 조회 실패');
  }

  return response.data.data;
}

/**
 * 내 정보 수정
 * PUT /api/members/me
 */
export async function updateMyInfo(request: UpdateMemberRequest): Promise<User> {
  const response = await apiClient.put<CommonApiResponse<User>>(
    API_ENDPOINTS.MEMBERS.UPDATE_ME,
    request
  );

  if (!response.data.data) {
    throw new Error(response.data.message || '정보 수정 실패');
  }

  return response.data.data;
}

/**
 * 내 계정 삭제
 * DELETE /api/members/me
 */
export async function deleteMyAccount(): Promise<void> {
  await apiClient.delete<CommonApiResponse<null>>(API_ENDPOINTS.MEMBERS.DELETE_ME);
}

/**
 * 회원 검색 (이메일)
 * GET /api/members/search?email={email}
 */
export async function searchMember(email: string): Promise<User> {
  const response = await apiClient.get<CommonApiResponse<User>>(
    `${API_ENDPOINTS.MEMBERS.SEARCH}?email=${encodeURIComponent(email)}`
  );

  if (!response.data.data) {
    throw new Error(response.data.message || '회원 검색 실패');
  }

  return response.data.data;
}

/**
 * 내가 돌보는 사람들 목록
 * GET /api/members/me/managed-members
 */
export async function getManagedMembers(): Promise<User[]> {
  const response = await apiClient.get<CommonApiResponse<User[]>>(
    API_ENDPOINTS.MEMBERS.MANAGED_MEMBERS
  );

  if (!response.data.data) {
    throw new Error(response.data.message || '목록 조회 실패');
  }

  return response.data.data;
}

/**
 * 안부 메시지 설정 변경
 * PATCH /api/members/me/daily-check?enabled={enabled}
 */
export async function updateDailyCheckSetting(enabled: boolean): Promise<User> {
  const response = await apiClient.patch<CommonApiResponse<User>>(
    `${API_ENDPOINTS.MEMBERS.DAILY_CHECK}?enabled=${enabled}`
  );

  if (!response.data.data) {
    throw new Error(response.data.message || '설정 변경 실패');
  }

  return response.data.data;
}

/**
 * 보호자 관계 해제
 * DELETE /api/members/me/guardian
 */
export async function removeGuardian(): Promise<void> {
  await apiClient.delete<CommonApiResponse<null>>(API_ENDPOINTS.MEMBERS.REMOVE_GUARDIAN);
}
