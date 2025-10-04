/**
 * 로그인 폼 유효성 검사 규칙
 */
export const LOGIN_VALIDATION = {
  PASSWORD_MIN_LENGTH: 4,
} as const;

/**
 * 로그인 폼 유효성 검사 에러 메시지
 */
export const LOGIN_VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: '사용자 이름을 입력해주세요',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요',
  PASSWORD_MIN_LENGTH: `비밀번호는 ${LOGIN_VALIDATION.PASSWORD_MIN_LENGTH}자 이상이어야 합니다`,
} as const;
