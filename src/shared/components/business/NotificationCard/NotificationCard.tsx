/**
 * 알림 카드 컴포넌트
 * - 알림 목록에서 개별 알림 표시
 * - 알림 종류별 아이콘, 레벨별 색상 구분
 * - 읽음/안읽음 상태 표시
 */

import { Bell, Users, AlertTriangle, AlertCircle, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import type { NotificationCardProps } from './NotificationCard.types';
import { getNotificationLevel, type NotificationType, type NotificationLevel } from '@/features/notification/types';
import { Card } from '@/shared/components';
import { formatTimeAgo } from '@/shared/utils/date';
import { cn } from '@/shared/utils/cn';

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const level = getNotificationLevel(notification.type);
  const icon = getNotificationIcon(notification.type, level);
  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <Card
      padding="medium"
      onClick={onClick}
      className={cn(
        'cursor-pointer hover:bg-gray-50 transition-colors',
        !notification.isRead && 'bg-blue-50'
      )}
    >
      <div className="flex items-start gap-4">
        {/* 아이콘 */}
        <div className={cn('flex-shrink-0', getLevelColor(level))}>{icon}</div>

        {/* 알림 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-gray-900 truncate">{notification.title}</h3>
            {/* 안읽음 표시 */}
            {!notification.isRead && <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />}
          </div>
          <p className="text-base text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
          <p className="text-sm text-gray-400 mt-2">{timeAgo}</p>
        </div>
      </div>
    </Card>
  );
}

/**
 * 알림 종류 및 레벨에 따른 아이콘 반환
 */
function getNotificationIcon(type: NotificationType, level: NotificationLevel) {
  // 긴급/높음 레벨은 경고 아이콘 우선
  if (level === 'EMERGENCY') {
    return <AlertCircle size={32} />;
  }

  // 알림 종류별 아이콘
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
