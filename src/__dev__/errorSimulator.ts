/**
 * 개발 환경 전용 에러 시뮬레이터
 *
 * 사용법:
 * - 메시지에 "[error]" 포함 → 네트워크 에러 발생
 * - 메시지에 "[timeout]" 포함 → 타임아웃 에러 발생
 *
 * 특징:
 * - import.meta.env.DEV 체크로 개발 환경에서만 동작
 * - 프로덕션 빌드 시 트리 쉐이킹으로 자동 제거
 */
export function simulateError(content: string): void {
  // DEV 환경이 아니면 즉시 반환
  if (!import.meta.env.DEV) return;

  const lower = content.toLowerCase();

  // [error] 키워드: 네트워크 에러
  if (lower.includes('[error]')) {
    throw new Error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
  }

  // [timeout] 키워드: 타임아웃 에러
  if (lower.includes('[timeout]')) {
    throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
  }
}
