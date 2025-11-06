/**
 * 알림 기능 훅
 * - TanStack Query를 사용한 서버 상태 관리
 * - Phase 3-8: 실제 서버 API 연동
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, getNotificationById, getUnreadCount, markAsRead } from '../api';
import { useToast } from '@/shared/hooks/useToast';

/**
 * 알림 목록 조회 및 관리 훅
 * @returns 알림 목록, 로딩 상태, 읽음 처리 함수, 미읽음 개수
 * @example
 * const { notifications, isLoading, markAsRead, unreadCount } = useNotifications();
 */
export function useNotifications() {
  const toast = useToast();
  const queryClient = useQueryClient();

  // 알림 목록 조회
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  // 안읽은 알림 개수 조회
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
  });

  // 알림 읽음 처리
  const { mutateAsync: markAsReadMutation } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // 알림 목록 및 미읽음 개수 다시 조회
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('알림 읽음 처리에 실패했습니다');
    },
  });

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation,
    unreadCount,
  };
}

/**
 * 특정 알림 상세 조회 훅
 * @param id - 알림 ID
 * @returns 알림 상세 정보, 로딩 상태
 * @example
 * const { data: notification, isLoading } = useNotification(123);
 */
export function useNotification(id: number) {
  return useQuery({
    queryKey: ['notifications', id],
    queryFn: () => getNotificationById(id),
    enabled: !!id,
  });
}
