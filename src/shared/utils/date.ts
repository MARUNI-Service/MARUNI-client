/**
 * 날짜 및 시간 포맷 유틸리티
 * - 상대 시간 표시 (N분 전, N시간 전, N일 전)
 */

/**
 * ISO 8601 날짜를 상대 시간으로 변환
 * @param isoDate - ISO 8601 형식의 날짜 문자열
 * @param options - 옵션
 * @param options.fallback - 날짜가 없을 때 표시할 문자열 (기본: '시간 없음')
 * @param options.showMinutes - 분 단위까지 표시 (기본: false)
 * @returns 상대 시간 문자열 (예: "30분 전", "2시간 전", "3일 전")
 * @example
 * // 분 단위 표시 (메시지용)
 * formatTimeAgo("2025-01-06T09:00:00Z", { showMinutes: true }) // "30분 전"
 *
 * // 시간/일 단위만 (대시보드용)
 * formatTimeAgo("2025-01-06T09:00:00Z") // "2시간 전"
 *
 * // 날짜 없을 때
 * formatTimeAgo(undefined, { fallback: '대화 없음' }) // "대화 없음"
 */
export function formatTimeAgo(
  isoDate?: string,
  options?: {
    fallback?: string;
    showMinutes?: boolean;
  }
): string {
  if (!isoDate) return options?.fallback || '시간 없음';

  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // 분 단위 표시 (옵션)
  if (options?.showMinutes) {
    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분 전`;
  }

  // 시간/일 단위 (기본)
  if (diffHours < 1) return '방금 전';
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  // 7일 이상은 날짜 표시
  return date.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
}

/**
 * @deprecated formatTimeAgo 사용을 권장합니다
 * @see formatTimeAgo
 */
export function formatLastCheckTime(isoDate?: string, fallback = '대화 없음'): string {
  return formatTimeAgo(isoDate, { fallback });
}

/**
 * ISO 8601 날짜를 날짜 구분선 포맷으로 변환
 * @param isoDate - ISO 8601 형식의 날짜 문자열
 * @returns 날짜 구분선 문자열 (예: "2025년 1월 18일 토요일")
 * @example
 * formatDateDivider("2025-01-18T09:00:00Z") // "2025년 1월 18일 토요일"
 */
export function formatDateDivider(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Seoul',
  });
}

/**
 * ISO 8601 날짜를 YYYY-MM-DD 포맷으로 변환
 * @param isoDate - ISO 8601 형식의 날짜 문자열
 * @returns YYYY-MM-DD 형식의 날짜 문자열
 * @example
 * formatDateKey("2025-01-18T09:00:00Z") // "2025-01-18"
 */
export function formatDateKey(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 메시지를 날짜별로 그룹화
 * @param messages - 메시지 배열
 * @returns 날짜별로 그룹화된 메시지 배열 [{ date, messages }]
 * @example
 * const grouped = groupMessagesByDate(messages);
 * // [
 * //   { date: "2025-01-18", messages: [...] },
 * //   { date: "2025-01-17", messages: [...] },
 * // ]
 */
export function groupMessagesByDate<T extends { createdAt: string }>(
  messages: T[]
): Array<{ date: string; messages: T[] }> {
  const grouped = new Map<string, T[]>();

  messages.forEach((message) => {
    const dateKey = formatDateKey(message.createdAt);
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(message);
  });

  // Map을 배열로 변환 (날짜 순서 유지)
  return Array.from(grouped.entries()).map(([date, messages]) => ({
    date,
    messages,
  }));
}
