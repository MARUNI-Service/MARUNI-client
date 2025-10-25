import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { useToast } from '@/shared/hooks/useToast';
import type { Message } from '../types/conversation.types';
import { mockGetMessages, mockSendMessage } from '../api/mockConversationApi';

/**
 * 대화 관리 훅
 * - TanStack Query를 사용한 서버 상태 관리
 * - 자동 캐싱, 낙관적 업데이트, 에러 처리
 */
export function useConversation() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const toast = useToast();

  // 메시지 목록 조회 (자동 캐싱, 자동 갱신)
  const {
    data: messages = [],
    isLoading,
  } = useQuery({
    queryKey: ['conversation', 'messages', user?.id],
    queryFn: () => mockGetMessages(user?.id || 0),
    enabled: !!user,
  });

  // 메시지 전송 (낙관적 업데이트)
  const {
    mutateAsync: sendMessage,
    isPending: isSending,
  } = useMutation({
    mutationFn: (content: string) => mockSendMessage(user?.id || 0, content.trim()),

    // 낙관적 업데이트: UI 즉시 반영
    onMutate: async (content) => {
      if (!user) return;

      await queryClient.cancelQueries({
        queryKey: ['conversation', 'messages', user.id],
      });

      const previousMessages = queryClient.getQueryData<Message[]>([
        'conversation',
        'messages',
        user.id,
      ]);

      // 임시 사용자 메시지 추가
      queryClient.setQueryData<Message[]>(
        ['conversation', 'messages', user.id],
        (old = []) => [
          ...old,
          {
            id: Date.now(),
            sender: 'USER' as const,
            content,
            createdAt: new Date().toISOString(),
          },
        ]
      );

      return { previousMessages };
    },

    // 성공 시 AI 응답 추가
    onSuccess: ({ userMessage, aiMessage }) => {
      if (!user) return;

      queryClient.setQueryData<Message[]>(
        ['conversation', 'messages', user.id],
        (old = []) => {
          // 임시 메시지 제거 후 실제 메시지 추가
          const withoutTemp = old.filter((m) => m.id !== userMessage.id);
          return [...withoutTemp, userMessage, aiMessage];
        }
      );
    },

    // 실패 시 롤백
    onError: (_err, _content, context) => {
      if (!user) return;

      queryClient.setQueryData(
        ['conversation', 'messages', user.id],
        context?.previousMessages
      );
      toast.error('메시지 전송에 실패했습니다');
    },
  });

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
  };
}
