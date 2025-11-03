import { useConversation } from '@/features/conversation';
import { Button } from '@/shared/components/ui/Button';
import { ChatMessage } from '@/shared/components/business/ChatMessage';
import { MessageInput } from '@/shared/components/business/MessageInput';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AI 대화 페이지
 * - Journey 2: 첫 안부 메시지 받기
 * - 전체 화면 레이아웃 (헤더 고정, 메시지 스크롤, 입력창 고정)
 * - Phase 3-8: 실제 API 연결
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
    <div className='flex flex-col h-screen bg-white'>
      {/* Header - 고정 */}
      <header className='bg-blue-50 border-b border-blue-100 px-4 py-6 shadow-sm shrink-0'>
        <div className='flex items-center justify-between max-w-md mx-auto'>
          <Button
            variant='secondary'
            size='large'
            onClick={() => navigate(-1)}
            aria-label='뒤로 가기'
          >
            ← 뒤로
          </Button>
          <h1 className='text-2xl font-bold text-gray-900 text-center flex-1'>마루니</h1>
          <div className='w-[120px]' />
        </div>
      </header>

      {/* 메시지 목록 - 스크롤 영역 */}
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
          <div className='max-w-md mx-auto'>
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 메시지 입력창 - 고정 */}
      <div className='border-t border-gray-200 bg-white px-4 py-4 shrink-0'>
        <div className='max-w-md mx-auto'>
          <MessageInput
            onSend={handleSend}
            disabled={isSending}
            placeholder={isSending ? 'AI가 응답 중...' : '메시지를 입력하세요'}
          />
        </div>
      </div>
    </div>
  );
}
