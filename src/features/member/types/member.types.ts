/**
 * 프로필 수정 요청
 */
export interface ProfileUpdateRequest {
  name: string;
  phoneNumber?: string;
}

/**
 * 비밀번호 변경 요청
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 회원 설정
 */
export interface MemberSettings {
  dailyCheckEnabled: boolean;
  pushNotificationEnabled: boolean;
}
