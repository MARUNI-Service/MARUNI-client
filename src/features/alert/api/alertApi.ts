import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { CommonApiResponse } from '@/shared/types/common';
import type {
  AlertRuleCreateRequest,
  AlertRuleUpdateRequest,
  AlertRuleResponseDto,
  AlertHistoryResponseDto,
} from '../types';

/**
 * Phase 3-8: Alert Rule API 구현
 * - 알림 규칙 CRUD 및 알림 이력 조회
 */

/**
 * 알림 규칙 생성
 */
export async function createAlertRule(
  request: AlertRuleCreateRequest
): Promise<AlertRuleResponseDto> {
  const response = await apiClient.post<CommonApiResponse<AlertRuleResponseDto>>(
    API_ENDPOINTS.ALERT_RULES.CREATE,
    request
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 생성 실패');
  }

  return response.data.data;
}

/**
 * 알림 규칙 목록 조회
 */
export async function getAlertRules(): Promise<AlertRuleResponseDto[]> {
  const response = await apiClient.get<CommonApiResponse<AlertRuleResponseDto[]>>(
    API_ENDPOINTS.ALERT_RULES.LIST
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 목록 조회 실패');
  }

  return response.data.data;
}

/**
 * 알림 규칙 상세 조회
 */
export async function getAlertRuleDetail(id: number): Promise<AlertRuleResponseDto> {
  const response = await apiClient.get<CommonApiResponse<AlertRuleResponseDto>>(
    API_ENDPOINTS.ALERT_RULES.DETAIL(id)
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 조회 실패');
  }

  return response.data.data;
}

/**
 * 알림 규칙 수정
 */
export async function updateAlertRule(
  id: number,
  request: AlertRuleUpdateRequest
): Promise<AlertRuleResponseDto> {
  const response = await apiClient.put<CommonApiResponse<AlertRuleResponseDto>>(
    API_ENDPOINTS.ALERT_RULES.UPDATE(id),
    request
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 수정 실패');
  }

  return response.data.data;
}

/**
 * 알림 규칙 삭제
 */
export async function deleteAlertRule(id: number): Promise<void> {
  await apiClient.delete<CommonApiResponse<null>>(API_ENDPOINTS.ALERT_RULES.DELETE(id));
}

/**
 * 알림 규칙 활성화/비활성화
 */
export async function toggleAlertRule(
  id: number,
  active: boolean
): Promise<AlertRuleResponseDto> {
  const response = await apiClient.post<CommonApiResponse<AlertRuleResponseDto>>(
    `${API_ENDPOINTS.ALERT_RULES.TOGGLE(id)}?active=${active}`
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 토글 실패');
  }

  return response.data.data;
}

/**
 * 알림 이력 조회
 */
export async function getAlertHistory(days: number = 30): Promise<AlertHistoryResponseDto[]> {
  const response = await apiClient.get<CommonApiResponse<AlertHistoryResponseDto[]>>(
    `${API_ENDPOINTS.ALERT_RULES.HISTORY}?days=${days}`
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 이력 조회 실패');
  }

  return response.data.data;
}

/**
 * 알림 이력 상세 조회
 */
export async function getAlertHistoryDetail(id: number): Promise<AlertHistoryResponseDto> {
  const response = await apiClient.get<CommonApiResponse<AlertHistoryResponseDto>>(
    API_ENDPOINTS.ALERT_RULES.HISTORY_DETAIL(id)
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 이력 상세 조회 실패');
  }

  return response.data.data;
}
