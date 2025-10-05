import { apiClient } from '@/shared/api/client';
import type { ConversationResponse, SendMessageRequest } from '../types';

/**
 * Conversation API
 */
export const conversationApi = {
  /**
   * AI 대화 메시지 전송
   */
  sendMessage: async (data: SendMessageRequest): Promise<ConversationResponse> => {
    const response = await apiClient.post<{ data: ConversationResponse }>(
      '/conversations/messages',
      data
    );
    return response.data.data;
  },
};
