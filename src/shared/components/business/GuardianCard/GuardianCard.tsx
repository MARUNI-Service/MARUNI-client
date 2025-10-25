import type { Guardian } from '@/features/auth/types';
import { Card } from '@/shared/components';

interface GuardianCardProps {
  guardian: Guardian;
}

/**
 * 보호자 정보 카드
 * - 보호자 이름과 관계 표시
 */
export function GuardianCard({ guardian }: GuardianCardProps) {
  return (
    <Card padding="large">
      <div className="flex items-center gap-4">
        {/* 아이콘 */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">👤</span>
        </div>

        {/* 정보 */}
        <div>
          <p className="text-2xl font-semibold text-gray-900">{guardian.name}</p>
          <p className="text-lg text-gray-600">{guardian.relationship}</p>
        </div>
      </div>
    </Card>
  );
}
