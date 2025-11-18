import { formatDateDivider } from '@/shared/utils/date';
import type { DateDividerProps } from './DateDivider.types';

/**
 * 날짜 구분선 컴포넌트
 * - 카카오톡 스타일의 날짜 구분선
 * - 메시지 사이에 날짜가 바뀔 때 표시
 *
 * @example
 * <DateDivider date="2025-01-18T09:00:00Z" />
 * // "2025년 1월 18일 토요일"
 */
export function DateDivider({ date }: DateDividerProps) {
  const formattedDate = formatDateDivider(date);

  return (
    <div className="flex items-center justify-center my-6">
      <div className="bg-gray-100 px-5 py-2 rounded-full">
        <p className="text-base text-gray-600 font-medium text-center">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}
