/**
 * 클래스명 조합 유틸리티
 * - 여러 클래스명을 조합하고 중복 제거
 */

type ClassValue = string | number | boolean | undefined | null;

/**
 * 클래스명 조합 함수
 * @param classes - 조합할 클래스명들
 * @returns 조합된 클래스명 문자열
 * @example
 * cn('text-base', isActive && 'text-blue-600', 'font-bold') // "text-base text-blue-600 font-bold"
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
