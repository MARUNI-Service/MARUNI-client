import { useAuthStore } from '@/features/auth';
import { useToast } from '@/shared/hooks/useToast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getHistory, sendMessage as sendMessageApi } from '../api';
import type { MessageDto, SendMessageRequest } from '../types';

/**
 * 대화 관리 훅
 * Phase 3-8: 실제 API 호출로 변경
 * - TanStack Query를 사용한 서버 상태 관리
 * - 자동 캐싱, 낙관적 업데이트, 에러 처리
 */
export function useConversation() {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  const toast = useToast();

  // 메시지 목록 조회 (자동 캐싱, 자동 갱신)
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['conversation', 'history'],
    queryFn: () => getHistory(7), // 7일간의 대화 내역
    enabled: !!user,
  });

  // 메시지 전송 (낙관적 업데이트)
  const { mutateAsync: sendMessage, isPending: isSending } = useMutation({
    mutationFn: (content: string) => {
      const request: SendMessageRequest = { content: content.trim() };
      return sendMessageApi(request);
    },

    // 낙관적 업데이트: UI 즉시 반영
    onMutate: async content => {
      await queryClient.cancelQueries({
        queryKey: ['conversation', 'history'],
      });

      const previousMessages = queryClient.getQueryData<MessageDto[]>(['conversation', 'history']);

      // 임시 사용자 메시지 추가 (음수 ID로 임시 표시)
      queryClient.setQueryData<MessageDto[]>(['conversation', 'history'], (old = []) => [
        ...old,
        {
          id: -Date.now(), // 음수로 임시 메시지 표시
          type: 'USER_MESSAGE' as const,
          content,
          emotion: null,
          createdAt: new Date().toISOString(),
        },
      ]);

      return { previousMessages };
    },

    // 성공 시 전체 히스토리 다시 불러오기
    onSuccess: () => {
      // 서버에서 최신 대화 내역 전체를 다시 가져옴
      queryClient.invalidateQueries({ queryKey: ['conversation', 'history'] });
    },

    // 실패 시 롤백
    onError: (_err, _content, context) => {
      queryClient.setQueryData(['conversation', 'history'], context?.previousMessages);
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
