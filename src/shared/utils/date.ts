/**
 * 날짜 및 시간 포맷 유틸리티
 * - 상대 시간 표시 (N분 전, N시간 전, N일 전)
 */

/**
 * ISO 8601 날짜를 "N분 전", "N시간 전" 형식으로 변환
 * @param isoDate - ISO 8601 형식의 날짜 문자열
 * @returns 상대 시간 문자열 (예: "30분 전", "2시간 전", "3일 전")
 * @example
 * formatTimeAgo("2025-01-06T09:00:00Z") // "2시간 전"
 */
export function formatTimeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '방금';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  // 7일 이상은 날짜 표시
  return date.toLocaleDateString('ko-KR');
}

/**
 * ISO 8601 날짜를 "N시간 전", "N일 전" 형식으로 변환 (간소화 버전)
 * @param isoDate - ISO 8601 형식의 날짜 문자열 (선택)
 * @param fallback - 날짜가 없을 때 표시할 문자열 (기본값: '대화 없음')
 * @returns 상대 시간 문자열
 * @example
 * formatLastCheckTime("2025-01-06T09:00:00Z") // "2시간 전"
 * formatLastCheckTime(undefined) // "대화 없음"
 */
export function formatLastCheckTime(isoDate?: string, fallback = '대화 없음'): string {
  if (!isoDate) return fallback;

  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return '방금 전';
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${Math.floor(diffHours / 24)}일 전`;
}
