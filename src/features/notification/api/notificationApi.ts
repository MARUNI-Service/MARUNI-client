/**
 * 알림 API (Mock 구현)
 * - Phase 3-6: localStorage 기반 Mock API
 * - Phase 3-8: 실제 API 연결로 교체 예정
 */

import type { Notification } from '../types';
import { getMockNotificationsForUser } from './mockNotificationData';

const STORAGE_KEY = 'notification-read-status';

/**
 * 알림 목록 조회
 * @returns Mock 알림 목록 (최신순)
 * @todo [Phase 3-8] API 연결 시 실제 API 호출로 교체 (GET /api/notifications)
 */
export async function getNotifications(): Promise<Notification[]> {
  // Mock 딜레이 (네트워크 시뮬레이션)
  await new Promise((resolve) => setTimeout(resolve, 300));

  // localStorage에서 현재 사용자 정보 조회
  const authStorage = localStorage.getItem('auth-storage');
  if (!authStorage) return [];

  const { state } = JSON.parse(authStorage);
  const currentUser = state.user;

  if (!currentUser) return [];

  // 사용자별 Mock 알림 데이터 조회
  const mockNotifications = getMockNotificationsForUser(currentUser.id);

  // localStorage에 저장된 읽음 상태 반영
  const readStatus = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  return mockNotifications.map((noti) => ({
    ...noti,
    isRead: readStatus[noti.id] || noti.isRead || false,
  }));
}

/**
 * 알림 상세 조회
 * @param notificationId - 알림 ID
 * @returns 알림 상세 정보
 * @todo [Phase 3-8] API 연결 시 실제 API 호출로 교체 (GET /api/notifications/:id)
 */
export async function getNotificationById(notificationId: string): Promise<Notification | null> {
  // Mock 딜레이
  await new Promise((resolve) => setTimeout(resolve, 200));

  const notifications = await getNotifications();
  return notifications.find((n) => n.id === notificationId) || null;
}

/**
 * 알림 읽음 처리
 * @param notificationId - 알림 ID
 * @todo [Phase 3-8] API 연결 시 실제 API 호출로 교체 (PATCH /api/notifications/:id/read)
 */
export async function markAsRead(notificationId: string): Promise<void> {
  // Mock 딜레이
  await new Promise((resolve) => setTimeout(resolve, 200));

  // localStorage에서 읽음 상태 업데이트
  const readStatus = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  readStatus[notificationId] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readStatus));
}
