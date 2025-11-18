/**
 * 알림 API (실제 서버 연동)
 * - Phase 3-8: 실제 서버 API 연결 완료
 */

import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { CommonApiResponse } from '@/shared/types/common';
import type { Notification } from '../types';

/**
 * 전체 알림 조회 (최신순)
 */
export async function getNotifications(): Promise<Notification[]> {
  const response = await apiClient.get<CommonApiResponse<Notification[]>>(API_ENDPOINTS.NOTIFICATIONS.LIST);
  return response.data.data || [];
}

/**
 * 안읽은 알림 개수 조회
 */
export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<CommonApiResponse<number>>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  return response.data.data || 0;
}

/**
 * 알림 읽음 처리
 * @param notificationId - 알림 ID
 */
export async function markAsRead(notificationId: number): Promise<Notification> {
  const response = await apiClient.patch<CommonApiResponse<Notification>>(
    API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
  );
  if (!response.data.data) {
    throw new Error('알림 정보를 찾을 수 없습니다');
  }
  return response.data.data;
}

/**
 * 알림 상세 조회 (목록에서 필터링)
 * @param notificationId - 알림 ID
 */
export async function getNotificationById(notificationId: number): Promise<Notification | null> {
  const notifications = await getNotifications();
  return notifications.find((n) => n.id === notificationId) || null;
}

/**
 * 데모 알림 생성 (시연용)
 * - 랜덤으로 위험 알림 생성
 * - 보호자 계정만 사용 가능
 */
export async function createDemoAlert(): Promise<void> {
  const response = await apiClient.post<CommonApiResponse<null>>(API_ENDPOINTS.ALERT_RULES.DEMO_ALERT);

  if (!response.data || response.data.code !== 'SUCCESS') {
    throw new Error(response.data?.message || '데모 알림 생성 실패');
  }
}
