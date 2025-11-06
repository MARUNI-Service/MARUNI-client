/**
 * 알림 API (실제 서버 연동)
 * - Phase 3-8: 실제 서버 API 연결 완료
 */

import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { Notification } from '../types';

/**
 * 전체 알림 조회 (최신순)
 */
export async function getNotifications(): Promise<Notification[]> {
  const response = await apiClient.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.LIST);
  return response.data;
}

/**
 * 안읽은 알림 개수 조회
 */
export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<number>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  return response.data;
}

/**
 * 알림 읽음 처리
 * @param notificationId - 알림 ID
 */
export async function markAsRead(notificationId: number): Promise<Notification> {
  const response = await apiClient.patch<Notification>(
    API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
  );
  return response.data;
}

/**
 * 알림 상세 조회 (목록에서 필터링)
 * @param notificationId - 알림 ID
 */
export async function getNotificationById(notificationId: number): Promise<Notification | null> {
  const notifications = await getNotifications();
  return notifications.find((n) => n.id === notificationId) || null;
}
