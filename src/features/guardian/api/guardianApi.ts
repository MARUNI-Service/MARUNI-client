import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { CommonApiResponse } from '@/shared/types/common';
import type { GuardianRequestRequest, GuardianRequestResponse } from '../types';

/**
 * 보호자 요청 생성
 * POST /api/guardians/requests
 * Phase 3-8: 실제 API 호출
 */
export async function createGuardianRequest(
  request: GuardianRequestRequest
): Promise<GuardianRequestResponse> {
  const response = await apiClient.post<CommonApiResponse<GuardianRequestResponse>>(
    API_ENDPOINTS.GUARDIANS.REQUESTS,
    request
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '보호자 요청 생성 실패');
  }

  return response.data.data;
}

/**
 * 내가 받은 보호자 요청 목록
 * GET /api/guardians/requests
 * Phase 3-8: 실제 API 호출
 */
export async function getGuardianRequests(): Promise<GuardianRequestResponse[]> {
  const response = await apiClient.get<CommonApiResponse<GuardianRequestResponse[]>>(
    API_ENDPOINTS.GUARDIANS.REQUESTS
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '보호자 요청 목록 조회 실패');
  }

  return response.data.data;
}

/**
 * 보호자 요청 수락
 * POST /api/guardians/requests/{requestId}/accept
 * Phase 3-8: 실제 API 호출
 */
export async function acceptGuardianRequest(requestId: number): Promise<void> {
  await apiClient.post<CommonApiResponse<null>>(API_ENDPOINTS.GUARDIANS.ACCEPT(requestId));
}

/**
 * 보호자 요청 거절
 * POST /api/guardians/requests/{requestId}/reject
 * Phase 3-8: 실제 API 호출
 */
export async function rejectGuardianRequest(requestId: number): Promise<void> {
  await apiClient.post<CommonApiResponse<null>>(API_ENDPOINTS.GUARDIANS.REJECT(requestId));
}
