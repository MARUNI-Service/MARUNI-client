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
