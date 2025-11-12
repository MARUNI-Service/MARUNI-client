/**
 * 알림 상세 페이지
 * - 알림 상세 정보 표시
 * - 타입별 추가 액션 버튼 제공
 * - 자동 읽음 처리
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bell, Users, AlertTriangle, AlertCircle, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNotification, useNotifications } from '@/features/notification';
import { getNotificationLevel, type NotificationType, type NotificationLevel } from '@/features/notification/types';
import { Layout, EmptyState, Button, Card } from '@/shared/components';
import { formatTimeAgo } from '@/shared/utils/date';
import { cn } from '@/shared/utils/cn';
import { ROUTES } from '@/shared/constants/routes';

export function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markAsRead } = useNotifications();
  const { data: notification, isLoading } = useNotification(Number(id));

  // 알림 자동 읽음 처리
  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  // 로딩 중
  if (isLoading) {
    return (
      <Layout title="알림 상세" showBack={true} onBack={() => navigate(-1)}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">알림을 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // 알림을 찾을 수 없음
  if (!notification) {
    return (
      <Layout title="알림 상세" showBack={true} onBack={() => navigate(-1)}>
        <EmptyState emoji="🔔" title="알림을 찾을 수 없습니다" description="삭제되었거나 존재하지 않는 알림입니다" />
      </Layout>
    );
  }

  const level = getNotificationLevel(notification.type);
  const icon = getNotificationIcon(notification.type, level);
  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <Layout title="알림 상세" showBack={true} onBack={() => navigate(-1)}>
      <div className="space-y-6">
        {/* 알림 내용 */}
        <Card padding="large">
          <div className="flex items-start gap-4">
            <div className={cn('flex-shrink-0', getLevelColor(level))}>{icon}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{notification.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{timeAgo}</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 mt-6 whitespace-pre-wrap">{notification.message}</p>
        </Card>

        {/* 타입별 추가 액션 */}
        {notification.type === 'GUARDIAN_REQUEST' && (
          <Card padding="medium">
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={() => navigate(ROUTES.GUARDIANS_REQUESTS)}
            >
              보호자 요청 확인하기
            </Button>
          </Card>
        )}

        {(notification.type === 'EMOTION_ALERT' ||
          notification.type === 'NO_RESPONSE_ALERT' ||
          notification.type === 'KEYWORD_ALERT') && (
          <Card padding="medium">
            <Button variant="primary" size="large" fullWidth onClick={() => navigate(ROUTES.CONVERSATION)}>
              대화 전체보기
            </Button>
          </Card>
        )}

        {notification.type === 'DAILY_CHECK' && (
          <Card padding="medium">
            <Button variant="primary" size="large" fullWidth onClick={() => navigate(ROUTES.CONVERSATION)}>
              답장하기
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}

/**
 * 알림 종류 및 레벨에 따른 아이콘 반환
 */
function getNotificationIcon(type: NotificationType, level: NotificationLevel) {
  if (level === 'EMERGENCY') {
    return <AlertCircle size={32} />;
  }

  switch (type) {
    case 'GUARDIAN_REQUEST':
      return <Users size={32} />;
    case 'GUARDIAN_ACCEPT':
      return <CheckCircle size={32} />;
    case 'GUARDIAN_REJECT':
      return <XCircle size={32} />;
    case 'EMOTION_ALERT':
    case 'NO_RESPONSE_ALERT':
    case 'KEYWORD_ALERT':
      return <AlertTriangle size={32} />;
    case 'DAILY_CHECK':
      return <MessageCircle size={32} />;
    case 'SYSTEM':
    default:
      return <Bell size={32} />;
  }
}

/**
 * 알림 레벨에 따른 색상 클래스 반환
 */
function getLevelColor(level: NotificationLevel) {
  switch (level) {
    case 'EMERGENCY':
    case 'HIGH':
      return 'text-red-600';
    case 'MEDIUM':
      return 'text-yellow-600';
    case 'LOW':
    default:
      return 'text-blue-600';
  }
}
