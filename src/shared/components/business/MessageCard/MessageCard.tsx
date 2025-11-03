import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants/routes';
import { getLatestMessage } from '@/features/conversation/api';
import { useAuthStore } from '@/features/auth';

/**
 * 안부 메시지 카드
 * - 노인이 받은 안부 메시지를 표시
 * - "답장하기" 버튼 제공
 * - Phase 3-8: 실제 API 연결 - 최근 메시지 표시
 */
export function MessageCard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  // 최근 메시지 조회
  const { data: latestMessage, isLoading } = useQuery({
    queryKey: ['conversation', 'latest'],
    queryFn: getLatestMessage,
    enabled: !!user,
  });

  const handleReply = () => {
    navigate(ROUTES.CONVERSATION);
  };

  // 시간 포맷팅 (예: "오늘 오전 9시", "어제 오후 3시")
  const formatMessageTime = (dateString: string) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');

    if (diffDays === 0) {
      return `오늘 ${ampm} ${displayHours}:${displayMinutes}`;
    } else if (diffDays === 1) {
      return `어제 ${ampm} ${displayHours}:${displayMinutes}`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return `${messageDate.getMonth() + 1}월 ${messageDate.getDate()}일`;
    }
  };

  if (isLoading) {
    return (
      <Card padding='large'>
        <div className='text-center text-gray-500'>대화 불러오는 중...</div>
      </Card>
    );
  }

  // 메시지가 없을 때
  if (!latestMessage) {
    return (
      <Card padding='large'>
        <div className='space-y-4'>
          <div className='text-xl text-gray-700'>
            <p className='mb-2'>오늘 기분이 어떠세요? 😊</p>
            <p className='text-base text-gray-500'>첫 대화를 시작해보세요</p>
          </div>
          <Button variant='primary' size='extra-large' fullWidth onClick={handleReply}>
            대화 시작하기
          </Button>
        </div>
      </Card>
    );
  }

  // 최근 메시지 표시
  return (
    <Card padding='large'>
      <div className='space-y-4'>
        {/* 메시지 내용 */}
        <div className='text-xl text-gray-700'>
          <p className='mb-2 line-clamp-2'>
            {latestMessage.type === 'AI_RESPONSE' ? '🤖 ' : ''}
            {latestMessage.content}
          </p>
          <p className='text-base text-gray-500'>{formatMessageTime(latestMessage.createdAt)}</p>
        </div>

        {/* 답장 버튼 */}
        <Button variant='primary' size='extra-large' fullWidth onClick={handleReply}>
          답장하기
        </Button>
      </div>
    </Card>
  );
}
