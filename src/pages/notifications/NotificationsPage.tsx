/**
 * 알림 목록 페이지
 * - 전체 알림 목록 표시
 * - 읽음/안읽음 구분
 * - 빈 상태 처리
 */

import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/features/notification';
import type { Notification } from '@/features/notification/types';
import { EmptyState, NavigationBar, Button } from '@/shared/components';
import { NotificationCard } from '@/shared/components/business/NotificationCard';
import { ROUTES } from '@/shared/constants/routes';

export function NotificationsPage() {
  const { notifications, isLoading, markAsRead, createDemoAlert, isCreatingDemo } = useNotifications();
  const navigate = useNavigate();

  const handleCreateDemoAlert = async () => {
    try {
      await createDemoAlert();
    } catch {
      // 에러는 hook에서 toast로 처리됨
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // 안읽음 알림이면 읽음 처리
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // 알림 상세 페이지로 이동
    navigate(`${ROUTES.NOTIFICATIONS}/${notification.id}`);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header - 데모 버튼 포함 */}
        <header className="bg-blue-50 border-b border-blue-100 px-4 py-6 shadow-sm">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">알림</h1>
            <Button
              variant="secondary"
              size="large"
              onClick={handleCreateDemoAlert}
              disabled={isCreatingDemo}
            >
              {isCreatingDemo ? '생성 중...' : '📢 데모 알림'}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-md mx-auto px-4 py-6 pb-24">
          {/* 로딩 중 */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">알림을 불러오는 중...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            /* 알림 없음 */
            <EmptyState emoji="🔔" title="알림이 없습니다" description="새로운 알림이 오면 여기에 표시됩니다" />
          ) : (
            /* 알림 목록 */
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <NavigationBar />
    </>
  );
}
