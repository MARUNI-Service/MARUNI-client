import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApiErrorMessage } from '@/shared/api/client';
import * as authApi from '../api';
import type { AuthState, LoginRequest, User } from '../types';

/**
 * Auth Store (Zustand with persist)
 * - 인증 상태 관리 (persist middleware로 자동 복원)
 * - 로그인/로그아웃 처리
 * - 토큰 갱신 처리
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * 로그인
       */
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login(credentials);

          // 상태 업데이트 (persist가 자동으로 localStorage에 저장)
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
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
        authApi.logout().catch((error) => {
          console.error('로그아웃 API 호출 실패:', error);
        });
      },

      /**
       * 토큰 갱신
       */
      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          get().logout();
          throw new Error('리프레시 토큰이 없습니다');
        }

        try {
          const response = await authApi.refreshAccessToken(refreshToken);

          // 상태 업데이트 (persist가 자동으로 localStorage에 저장)
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch (error) {
          // 토큰 갱신 실패 시 로그아웃
          get().logout();
          throw error;
        }
      },

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
       */
      setTokens: (accessToken: string, refreshToken: string) => {
        set({
          accessToken,
          refreshToken,
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
      // persist가 모든 상태를 자동으로 저장/복원 (partialize 제거)
    }
  )
);
