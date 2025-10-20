import type { EmptyStateProps } from './EmptyState.types';

/**
 * 빈 상태 UI 컴포넌트
 * - 노인 친화적 큰 이모지 + 텍스트
 * - 선택적 액션 버튼
 */
export function EmptyState({ emoji, title, description, actionButton }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* 이모지 */}
      <div className="text-6xl mb-4">{emoji}</div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

      {/* 설명 */}
      {description && <p className="text-lg text-gray-600 mb-6">{description}</p>}

      {/* 액션 버튼 */}
      {actionButton}
    </div>
  );
}
