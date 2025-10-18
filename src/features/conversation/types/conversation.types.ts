/**
 * 메시지 발신자 타입
 */
export type MessageSender = 'USER' | 'AI';

/**
 * 감정 상태 (ManagedMember와 동일)
 */
export type EmotionStatus = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

/**
 * 메시지
 */
export interface Message {
  id: number;
  sender: MessageSender;
  content: string;
  emotionStatus?: EmotionStatus; // 사용자 메시지만
  createdAt: string; // ISO 8601
}

/**
 * 메시지 전송 요청
 */
export interface SendMessageRequest {
  content: string;
}
