import { useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationApi } from '../api';
import type { Message } from '../types';

/**
 * 메시지 전송 훅
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => conversationApi.sendMessage({ content }),
    onSuccess: (data) => {
      // 메시지 추가 (간단한 방식)
      queryClient.setQueryData<Message[]>(['conversation', 'messages'], (old = []) => [
        ...old,
        data.userMessage,
        data.aiMessage,
      ]);
    },
  });
};
