import { create } from 'zustand';
import { getApiErrorMessage } from '@/shared/api/client';
import * as conversationApi from '../api';
import type { SendMessageRequest, MessageDto, ConversationResponseDto } from '../types';

/**
 * Conversation Store State
 * Phase 3-8: 실제 API 호출로 변경
 */
interface ConversationState {
  messages: MessageDto[];
  isLoading: boolean;
  error: string | null;

  sendMessage: (request: SendMessageRequest) => Promise<ConversationResponseDto>;
  loadHistory: (days?: number) => Promise<void>;
  clearMessages: () => void;
}

/**
 * Conversation Store
 * Phase 3-8: 메시지 캐싱 및 상태 관리
 */
export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  /**
   * 메시지 전송
   * POST /api/conversations/messages
   */
  sendMessage: async (request: SendMessageRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await conversationApi.sendMessage(request);

      // 메시지 목록에 추가
      set((state) => ({
        messages: [...state.messages, response.userMessage, response.aiMessage],
        isLoading: false,
      }));

      return response;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  /**
   * 대화 내역 조회
   * GET /api/conversations/history?days={days}
   */
  loadHistory: async (days = 7) => {
    set({ isLoading: true, error: null });

    try {
      const messages = await conversationApi.getHistory(days);
      set({ messages, isLoading: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  /**
   * 메시지 목록 초기화
   */
  clearMessages: () => {
    set({ messages: [], error: null });
  },
}));
