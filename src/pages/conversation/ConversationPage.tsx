import { useConversation } from '@/features/conversation';
import { Layout } from '@/shared/components';
import { ChatMessage } from '@/shared/components/business/ChatMessage';
import { MessageInput } from '@/shared/components/business/MessageInput';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AI 대화 페이지
 * - Journey 2: 첫 안부 메시지 받기
 * - Mock 데이터로 AI 대화 구현 (Phase 3-8에서 API 연결)
 */
export function ConversationPage() {
  const navigate = useNavigate();
  const { messages, isLoading, isSending, sendMessage } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    try {
      await sendMessage(content);
    } catch {
      // 에러는 hook에서 toast로 처리됨
    }
  };

  return (
    <Layout title='마루니' showBack={true} onBack={() => navigate(-1)}>
      <div className='flex flex-col h-[calc(100vh-80px)]'>
        {/* 메시지 목록 */}
        <div className='flex-1 overflow-y-auto px-4 py-6'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <p className='text-xl text-gray-500'>대화 불러오는 중...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className='flex items-center justify-center h-full'>
              <div className='text-center'>
                <div className='text-6xl mb-4'>💬</div>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>첫 대화를 시작해보세요</h2>
                <p className='text-lg text-gray-600'>오늘 하루 어떠셨는지 이야기해주세요</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* 메시지 입력창 */}
        <div className='border-t border-gray-200 bg-white px-4 py-4'>
          <MessageInput
            onSend={handleSend}
            disabled={isSending}
            placeholder={isSending ? 'AI가 응답 중...' : '메시지를 입력하세요'}
          />
        </div>
      </div>
    </Layout>
  );
}
