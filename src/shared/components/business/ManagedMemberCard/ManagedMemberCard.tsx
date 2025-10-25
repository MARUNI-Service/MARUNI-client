import type { ManagedMember } from '@/features/auth/types';
import { Card, Button } from '@/shared/components';
import { formatLastCheckTime } from '@/shared/utils/date';

interface ManagedMemberCardProps {
  member: ManagedMember;
}

/**
 * 보호 대상 정보 카드
 * - 이름, 상태, 마지막 대화 시간 표시
 * - "대화보기" 버튼 제공
 */
export function ManagedMemberCard({ member }: ManagedMemberCardProps) {
  const getEmotionEmoji = (status: ManagedMember['emotionStatus']) => {
    switch (status) {
      case 'POSITIVE':
        return '😊';
      case 'NEGATIVE':
        return '😢';
      case 'WARNING':
        return '⚠️';
      default:
        return '😐';
    }
  };

  const getEmotionText = (status: ManagedMember['emotionStatus']) => {
    switch (status) {
      case 'POSITIVE':
        return '좋음';
      case 'NEGATIVE':
        return '안 좋음';
      case 'WARNING':
        return '주의';
      default:
        return '보통';
    }
  };

  const handleViewConversation = () => {
    // Phase 3-4에서 대화 이력 화면으로 이동
    console.log('대화보기 클릭:', member.id);
  };

  return (
    <Card padding="large">
      <div className="space-y-4">
        {/* 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 아이콘 */}
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👵</span>
            </div>

            {/* 이름 */}
            <div>
              <p className="text-xl font-semibold text-gray-900">{member.name}</p>
              <p className="text-base text-gray-500">{formatLastCheckTime(member.lastCheckTime)}</p>
            </div>
          </div>

          {/* 상태 */}
          <div className="text-center">
            <div className="text-3xl mb-1">{getEmotionEmoji(member.emotionStatus)}</div>
            <p className="text-sm text-gray-600">{getEmotionText(member.emotionStatus)}</p>
          </div>
        </div>

        {/* 대화보기 버튼 */}
        <Button variant="secondary" size="large" fullWidth onClick={handleViewConversation}>
          대화보기
        </Button>
      </div>
    </Card>
  );
}
