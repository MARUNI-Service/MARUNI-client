import type { BaseEntity } from '@/shared/types/common';
import type { GuardianRelation } from '@/shared/types/enums';

/**
 * 사용자 역할
 */
export type UserRole = 'SENIOR' | 'GUARDIAN';

/**
 * 보호자 정보 (서버 응답 구조)
 * Phase 3-8: 서버 API 응답 구조에 맞춰 수정
 */
export interface Guardian {
  memberId: number;
  memberName: string;
  memberEmail: string;
  relation: GuardianRelation;
}

/**
 * 보호 대상 정보 (서버 응답 구조)
 * Phase 3-8: 서버 API 응답 구조에 맞춰 수정
 */
export interface ManagedMember {
  memberId: number;
  memberName: string;
  memberEmail: string;
  relation: GuardianRelation;
  dailyCheckEnabled: boolean;
  lastDailyCheckAt: string | null; // ISO 8601
}

/**
 * 사용자 정보 (서버 응답 구조)
 * Phase 3-8: 서버 API 응답 구조에 맞춰 수정
 */
export interface User extends BaseEntity {
  memberName: string;
  memberEmail: string;
  dailyCheckEnabled: boolean;
  hasPushToken: boolean;

  // Guardian 구조
  guardian: Guardian | null;

  // ManagedMembers 구조
  managedMembers: ManagedMember[];
}

/**
 * 로그인 요청 (서버 API 구조)
 * Phase 3-8: memberEmail, memberPassword로 변경
 */
export interface LoginRequest {
  memberEmail: string;
  memberPassword: string;
}

/**
 * 회원가입 요청
 */
export interface SignupRequest {
  memberEmail: string;
  memberName: string;
  memberPassword: string;
  dailyCheckEnabled?: boolean; // 기본값 true
}

// Phase 3-8: LoginResponse, RefreshTokenResponse 제거 (사용하지 않음)

/**
 * Auth 상태
 * Phase 3-8: refreshToken은 호환성을 위해 유지하지만 사용하지 않음
 */
export interface AuthState {
  // 상태
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null; // 호환성을 위해 유지 (deprecated)
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<void>;
  logout: () => void;
  // refreshAccessToken 제거 (Phase 3-8: Access Token만 사용)
  setUser: (user: User | null) => void;
  setToken: (accessToken: string) => void; // setTokens → setToken
  clearError: () => void;
}
