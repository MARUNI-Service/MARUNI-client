/**
 * 알림 목록 페이지
 * - 전체 알림 목록 표시
 * - 읽음/안읽음 구분
 * - 빈 상태 처리
 */

import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/features/notification';
import type { Notification } from '@/features/notification/types';
import { Layout, EmptyState, NavigationBar } from '@/shared/components';
import { NotificationCard } from '@/shared/components/business/NotificationCard';
import { ROUTES } from '@/shared/constants/routes';

export function NotificationsPage() {
  const { notifications, isLoading, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: Notification) => {
    // 안읽음 알림이면 읽음 처리
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // 알림 상세 페이지로 이동
    navigate(`${ROUTES.NOTIFICATIONS}/${notification.id}`);
  };

  // 로딩 중
  if (isLoading) {
    return (
      <>
        <Layout title="알림">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">알림을 불러오는 중...</p>
            </div>
          </div>
        </Layout>
        <NavigationBar />
      </>
    );
  }

  // 알림 없음
  if (notifications.length === 0) {
    return (
      <>
        <Layout title="알림">
          <EmptyState emoji="🔔" title="알림이 없습니다" description="새로운 알림이 오면 여기에 표시됩니다" />
        </Layout>
        <NavigationBar />
      </>
    );
  }

  // 알림 목록 표시
  return (
    <>
      <Layout title="알림">
        <div className="space-y-2 pb-24">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
            />
          ))}
        </div>
      </Layout>
      <NavigationBar />
    </>
  );
}
