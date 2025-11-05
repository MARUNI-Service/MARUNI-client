import type { MessageType, EmotionType } from '@/shared/types/enums';

/**
 * 메시지 전송 요청
 * Phase 3-8: AI 대화 메시지 전송
 */
export interface SendMessageRequest {
  content: string; // 최대 500자
}

/**
 * 메시지 DTO (서버 응답)
 * Phase 3-8: 서버 API 응답 구조
 */
export interface MessageDto {
  id: number;
  type: MessageType; // USER_MESSAGE, AI_RESPONSE, SYSTEM_MESSAGE
  content: string;
  emotion: EmotionType | null; // POSITIVE, NEGATIVE, NEUTRAL
  createdAt: string; // ISO 8601
}

/**
 * 대화 응답 DTO
 * Phase 3-8: AI 대화 메시지 전송 응답
 */
export interface ConversationResponseDto {
  conversationId: number;
  userMessage: MessageDto;
  aiMessage: MessageDto;
}
