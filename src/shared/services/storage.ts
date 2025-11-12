/**
 * 중앙 집중식 localStorage 관리
 * - 모든 스토리지 키를 한 곳에서 관리
 * - Phase 3-8 API 전환 시 이 파일만 수정
 */

const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  GUARDIAN_REQUESTS: 'guardian-requests',
  CONVERSATION_PREFIX: 'conversation-messages-',
} as const;

export const storage = {
  // Auth 관련
  getAuth: () => localStorage.getItem(STORAGE_KEYS.AUTH),
  setAuth: (data: string) => localStorage.setItem(STORAGE_KEYS.AUTH, data),

  // Guardian 요청
  getGuardianRequests: () => localStorage.getItem(STORAGE_KEYS.GUARDIAN_REQUESTS),
  setGuardianRequests: (data: string) =>
    localStorage.setItem(STORAGE_KEYS.GUARDIAN_REQUESTS, data),

  // 대화 메시지
  getConversationMessages: (userId: number) =>
    localStorage.getItem(`${STORAGE_KEYS.CONVERSATION_PREFIX}${userId}`),
  setConversationMessages: (userId: number, data: string) =>
    localStorage.setItem(`${STORAGE_KEYS.CONVERSATION_PREFIX}${userId}`, data),
};
