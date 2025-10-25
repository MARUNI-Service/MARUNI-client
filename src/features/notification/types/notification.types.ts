/**
 * 알림 기능 타입 정의
 * - Phase 3-6: Mock 데이터 기반 알림 목록 및 상세 확인
 */

/**
 * 알림 종류
 * - GUARDIAN_REQUEST: 보호자 등록 요청
 * - ALERT: 이상 징후 알림
 * - DAILY_CHECK: 안부 메시지 알림
 * - SYSTEM: 시스템 알림
 */
export type NotificationType = 'GUARDIAN_REQUEST' | 'ALERT' | 'DAILY_CHECK' | 'SYSTEM';

/**
 * 알림 레벨 (중요도)
 * - LOW: 일반 알림
 * - MEDIUM: 중간 중요도
 * - HIGH: 높은 중요도
 * - EMERGENCY: 긴급 상황
 */
export type NotificationLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

/**
 * 알림 엔티티
 */
export interface Notification {
  /** 알림 ID */
  id: string;

  /** 알림 종류 */
  type: NotificationType;

  /** 알림 레벨 (중요도) */
  level: NotificationLevel;

  /** 알림 제목 */
  title: string;

  /** 알림 메시지 */
  message: string;

  /** 읽음 여부 */
  isRead: boolean;

  /** 생성 일시 (ISO 8601) */
  createdAt: string;

  /** 타입별 추가 데이터 (선택적) */
  data?: {
    /** 보호자 요청 ID (GUARDIAN_REQUEST일 때) */
    guardianRequestId?: number;

    /** 이상 징후 알림 ID (ALERT일 때) */
    alertId?: number;

    /** 대화 ID (DAILY_CHECK일 때) */
    conversationId?: number;
  };
}
