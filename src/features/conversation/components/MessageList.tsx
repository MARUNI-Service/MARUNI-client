import { useQueryClient } from '@tanstack/react-query';
import type { Message } from '../types';

const MessageBubble = ({ message, isAI }: { message: Message; isAI: boolean }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-6 py-4 text-lg
          ${isAI ? 'bg-blue-50 text-gray-900' : 'bg-blue-600 text-white'}
        `}
      >
        <p className="leading-relaxed">{message.content}</p>
        <div className="mt-2 text-sm opacity-70">{formatTime(message.createdAt)}</div>
      </div>
    </div>
  );
};

export const MessageList = () => {
  const queryClient = useQueryClient();
  const messages = queryClient.getQueryData<Message[]>(['conversation', 'messages']) || [];

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p className="text-xl">대화를 시작해보세요!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isAI={message.type === 'AI_RESPONSE'}
        />
      ))}
    </div>
  );
};
