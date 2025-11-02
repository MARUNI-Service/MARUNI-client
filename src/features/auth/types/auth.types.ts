import type { BaseEntity } from '@/shared/types/common';

/**
 * 사용자 역할
 */
export type UserRole = 'SENIOR' | 'GUARDIAN';

/**
 * 보호자 정보 (최소 필드만)
 */
export interface Guardian {
  id: number;
  name: string;
  relationship: string; // "딸", "아들", "간병인" 등
}

/**
 * 보호 대상 정보 (최소 필드만)
 */
export interface ManagedMember {
  id: number;
  name: string;
  email: string;
  lastCheckIn: string | null; // ISO 8601 문자열 또는 null (아직 체크인 없음)
  lastCheckTime?: string; // 호환성을 위해 유지 (deprecated)
  emotionStatus: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'WARNING';
}

/**
 * 사용자 정보
 */
export interface User extends BaseEntity {
  username: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  email?: string;

  // 🆕 Phase 3-1: 역할별 동적 화면을 위한 추가 필드
  dailyCheckEnabled: boolean;
  guardian: Guardian | null;
  managedMembers: ManagedMember[];
}

/**
 * 로그인 요청
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 회원가입 요청
 */
export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  phoneNumber?: string;
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * 토큰 갱신 응답
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Auth 상태
 */
export interface AuthState {
  // 상태
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<void>;
  logout: () => void;
  // refreshAccessToken 제거 (Phase 3-8: Access Token만 사용)
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
}
