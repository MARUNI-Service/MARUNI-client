import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 안부 메시지 카드
 * - 노인이 받은 안부 메시지를 표시
 * - "답장하기" 버튼 제공
 * - Phase 3-4: AI 대화 화면으로 이동
 */
export function MessageCard() {
  const navigate = useNavigate();

  const handleReply = () => {
    navigate(ROUTES.CONVERSATION);
  };

  return (
    <Card padding="large">
      <div className="space-y-4">
        {/* 메시지 내용 */}
        <div className="text-xl text-gray-700">
          <p className="mb-2">오늘 기분이 어떠세요? 😊</p>
          <p className="text-base text-gray-500">오늘 오전 9시</p>
        </div>

        {/* 답장 버튼 */}
        <Button variant="primary" size="extra-large" fullWidth onClick={handleReply}>
          답장하기
        </Button>
      </div>
    </Card>
  );
}
