import type { BaseEntity } from '@/shared/types/common';

/**
 * 사용자 역할
 */
export type UserRole = 'SENIOR' | 'GUARDIAN';

/**
 * 사용자 정보
 */
export interface User extends BaseEntity {
  username: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  email?: string;
}

/**
 * 로그인 요청
 */
export interface LoginRequest {
  username: string;
  password: string;
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
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}
