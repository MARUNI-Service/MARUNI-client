import type { AlertType, AlertLevel } from '@/shared/types/enums';

/**
 * Phase 3-8: Alert Rule API 타입 정의
 * - 서버 API 응답 구조에 맞춘 타입
 */

/**
 * 알림 조건
 */
export interface AlertCondition {
  consecutiveDays?: number; // 연속 일수 (무응답 패턴)
  thresholdCount?: number; // 임계값 횟수 (감정 패턴)
  keywords?: string[]; // 키워드 배열 (키워드 감지)
}

/**
 * 알림 규칙 생성 요청
 */
export interface AlertRuleCreateRequest {
  alertType: AlertType; // 알림 유형
  alertLevel: AlertLevel; // 알림 레벨
  condition: AlertCondition; // 조건
}

/**
 * 알림 규칙 수정 요청
 */
export interface AlertRuleUpdateRequest {
  ruleName: string; // 규칙 이름
  description: string; // 규칙 설명
  alertLevel: AlertLevel; // 알림 레벨
}

/**
 * 알림 규칙 응답 DTO
 */
export interface AlertRuleResponseDto {
  id: number;
  memberId: number;
  alertType: AlertType;
  alertLevel: AlertLevel;
  ruleName: string;
  condition: AlertCondition;
  description: string;
  active: boolean; // 활성화 여부
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * 알림 이력 응답 DTO
 */
export interface AlertHistoryResponseDto {
  id: number;
  alertRuleId: number;
  memberId: number;
  alertLevel: AlertLevel;
  alertMessage: string;
  detectionDetails: string; // JSON 문자열
  isNotificationSent: boolean;
  notificationSentAt: string | null; // ISO 8601
  notificationResult: string;
  alertDate: string; // ISO 8601
  createdAt: string; // ISO 8601
}
