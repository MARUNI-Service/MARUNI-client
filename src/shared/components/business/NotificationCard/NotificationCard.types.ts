import type { Notification } from '@/features/notification/types';

export interface NotificationCardProps {
  /** 알림 데이터 */
  notification: Notification;

  /** 클릭 이벤트 핸들러 */
  onClick: () => void;
}
