import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApiErrorMessage } from '@/shared/api/client';
import * as authApi from '../api';
import type { AuthState, LoginRequest, SignupRequest, User } from '../types';

/**
 * Auth Store (Zustand with persist)
 * Phase 3-8: Mock 데이터 제거, 실제 API 호출로 변경
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      accessToken: null,
      refreshToken: null, // 호환성을 위해 유지 (사용하지 않음)
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * 로그인
       * Phase 3-8: 실제 API 호출
       * 1. POST /api/auth/login → 헤더에서 토큰 추출
       * 2. GET /api/members/me → 사용자 정보 조회
       */
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          // 실제 API 호출
          const { accessToken, user } = await authApi.login(credentials);

          set({
            user,
            accessToken,
            refreshToken: null, // Refresh Token 사용 안 함
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = getApiErrorMessage(error);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      /**
       * 회원가입
       * Phase 3-8: 실제 API 호출
       * 회원가입만 하고 자동 로그인은 하지 않음
       */
      signup: async (credentials: SignupRequest) => {
        set({ isLoading: true, error: null });

        try {
          // 실제 API 호출 (Phase 2-3에서 구현)
          // await authApi.signup(credentials);

          // 임시로 성공 처리 (Phase 2-3에서 구현 예정)
          console.log('Signup credentials:', credentials);

          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = getApiErrorMessage(error);
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      /**
       * 로그아웃
       */
      logout: () => {
        // 상태 초기화 (persist가 자동으로 localStorage에서 제거)
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        // 서버에 로그아웃 요청 (선택 사항)
        authApi.logout().catch(error => {
          console.error('로그아웃 API 호출 실패:', error);
        });
      },

      // Phase 3-8: refreshAccessToken 제거 (Access Token만 사용)

      /**
       * 사용자 정보 설정
       */
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      /**
       * 토큰 설정
       * Phase 3-8: setTokens → setToken으로 변경
       */
      setToken: (accessToken: string) => {
        set({
          accessToken,
          isAuthenticated: true,
        });
      },

      /**
       * 에러 메시지 초기화
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키
      // persist가 모든 상태를 자동으로 저장/복원
    }
  )
);
