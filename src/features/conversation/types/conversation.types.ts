import type { EmotionStatus } from '@/shared/utils/emotion';

/**
 * 메시지 발신자 타입
 */
export type MessageSender = 'USER' | 'AI';

/**
 * 감정 상태 (중앙화된 타입 재export)
 */
export type { EmotionStatus };

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
