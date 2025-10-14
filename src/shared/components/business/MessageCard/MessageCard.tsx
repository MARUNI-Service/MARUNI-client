import { Card, Button } from '@/shared/components';

/**
 * 안부 메시지 카드
 * - 노인이 받은 안부 메시지를 표시
 * - "답장하기" 버튼 제공
 */
export function MessageCard() {
  const handleReply = () => {
    // Phase 3-4에서 AI 대화 화면으로 이동
    console.log('답장하기 클릭');
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
