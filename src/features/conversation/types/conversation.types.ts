/**
 * Conversation 도메인 타입 정의
 */

export type EmotionType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type MessageType = 'USER_MESSAGE' | 'AI_RESPONSE' | 'SYSTEM_MESSAGE';

export interface Message {
  id: number;
  type: MessageType;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface ConversationResponse {
  conversationId: number;
  userMessage: Message;
  aiMessage: Message;
}
