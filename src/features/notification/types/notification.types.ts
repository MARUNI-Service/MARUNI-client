/**
 * 알림 기능 타입 정의
 * - Phase 3-8: 실제 서버 API 연동
 */

/**
 * 알림 종류 (서버 API 기준 - 8종)
 * - DAILY_CHECK: 안부 메시지
 * - GUARDIAN_REQUEST: 보호자 등록 요청
 * - GUARDIAN_ACCEPT: 보호자 요청 수락
 * - GUARDIAN_REJECT: 보호자 요청 거절
 * - EMOTION_ALERT: 감정 패턴 이상
 * - NO_RESPONSE_ALERT: 무응답 이상
 * - KEYWORD_ALERT: 키워드 감지
 * - SYSTEM: 시스템 알림
 */
export type NotificationType =
  | 'DAILY_CHECK'
  | 'GUARDIAN_REQUEST'
  | 'GUARDIAN_ACCEPT'
  | 'GUARDIAN_REJECT'
  | 'EMOTION_ALERT'
  | 'NO_RESPONSE_ALERT'
  | 'KEYWORD_ALERT'
  | 'SYSTEM';

/**
 * 알림 출처 타입
 */
export type NotificationSourceType =
  | 'DAILY_CHECK'
  | 'ALERT_RULE'
  | 'GUARDIAN_REQUEST'
  | 'SYSTEM'
  | 'CHAT';

/**
 * 알림 레벨 (중요도) - UI 표시용
 * - LOW: 일반 알림
 * - MEDIUM: 중간 중요도
 * - HIGH: 높은 중요도
 * - EMERGENCY: 긴급 상황
 */
export type NotificationLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

/**
 * 알림 엔티티 (서버 응답 구조)
 */
export interface Notification {
  /** 알림 ID */
  id: number;

  /** 알림 종류 */
  type: NotificationType;

  /** 알림 제목 */
  title: string;

  /** 알림 메시지 */
  message: string;

  /** 알림 출처 타입 */
  sourceType: NotificationSourceType;

  /** 출처 엔티티 ID (상세 조회 시 사용) */
  sourceEntityId: number | null;

  /** 읽음 여부 */
  isRead: boolean;

  /** 읽은 시각 (ISO 8601) */
  readAt: string | null;

  /** 생성 일시 (ISO 8601) */
  createdAt: string;
}

/**
 * 알림 타입에서 레벨 추론 (UI 표시용)
 */
export function getNotificationLevel(type: NotificationType): NotificationLevel {
  switch (type) {
    case 'KEYWORD_ALERT':
      return 'EMERGENCY';
    case 'EMOTION_ALERT':
    case 'NO_RESPONSE_ALERT':
      return 'HIGH';
    case 'GUARDIAN_REQUEST':
    case 'GUARDIAN_ACCEPT':
    case 'GUARDIAN_REJECT':
      return 'MEDIUM';
    case 'DAILY_CHECK':
    case 'SYSTEM':
    default:
      return 'LOW';
  }
}
