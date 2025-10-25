import { useState } from 'react';
import { useAuthStore } from '@/features/auth';
import type { Message } from '../types/conversation.types';
import { mockGetMessages, mockSendMessage } from '../api/mockConversationApi';

/**
 * 대화 관리 훅
 *
 * TODO: Phase 3-6 (알림 기능)에서 대시보드 뱃지 구현 시 검토 필요
 * - "읽지 않은 메시지 수" 기능 추가 시
 * - 여러 컴포넌트에서 대화 상태 공유 필요 시
 * - Zustand store로 마이그레이션 고려
 *
 * 현재는 ConversationPage에서만 사용하므로 useState로 충분
 */
export function useConversation() {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  /**
   * 메시지 목록 조회
   */
  const loadMessages = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await mockGetMessages(user.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 메시지 전송
   */
  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    setIsSending(true);
    try {
      const { userMessage, aiMessage } = await mockSendMessage(user.id, content.trim());

      // 메시지 추가
      setMessages((prev) => [...prev, userMessage, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    loadMessages,
    sendMessage,
  };
}
