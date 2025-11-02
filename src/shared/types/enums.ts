/**
 * 공통 Enum 타입 정의
 * Phase 3-8 API 연결을 위한 서버 응답 타입
 */

/**
 * 보호자 관계
 */
export type GuardianRelation =
  | 'FAMILY'      // 가족
  | 'FRIEND'      // 친구
  | 'CAREGIVER'   // 돌봄제공자
  | 'NEIGHBOR'    // 이웃
  | 'OTHER';      // 기타

/**
 * 요청 상태
 */
export type RequestStatus =
  | 'PENDING'     // 대기중
  | 'ACCEPTED'    // 수락됨
  | 'REJECTED';   // 거절됨

/**
 * 메시지 타입
 */
export type MessageType =
  | 'USER_MESSAGE'   // 사용자 메시지
  | 'AI_RESPONSE'    // AI 응답
  | 'SYSTEM_MESSAGE'; // 시스템 메시지

/**
 * 감정 분석 결과
 */
export type EmotionType =
  | 'POSITIVE'   // 긍정
  | 'NEGATIVE'   // 부정
  | 'NEUTRAL';   // 중립

/**
 * 알림 유형
 */
export type AlertType =
  | 'EMOTION_PATTERN'    // 감정 패턴 분석
  | 'NO_RESPONSE'        // 무응답 패턴 분석
  | 'KEYWORD_DETECTION'; // 키워드 감지

/**
 * 알림 레벨
 */
export type AlertLevel =
  | 'EMERGENCY'  // 긴급 (즉시 알림)
  | 'HIGH'       // 높음
  | 'MEDIUM'     // 중간
  | 'LOW';       // 낮음
