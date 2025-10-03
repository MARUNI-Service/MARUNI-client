import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import { getApiErrorMessage } from '@/shared/api/client';
import * as authApi from '../api';
import type { AuthState, LoginRequest, User } from '../types';

/**
 * Auth Store (Zustand with persist)
 * - 인증 상태 관리
 * - 로그인/로그아웃 처리
 * - 토큰 갱신 처리
 * - 초기화 상태 관리 (persist 복원 대기)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true, // 초기값 true (초기화 전까지 로딩)
      isInitialized: false,
      error: null,

      /**
       * 초기화 (persist 복원 후 실행)
       */
      initialize: () => {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userJson = localStorage.getItem(STORAGE_KEYS.USER_INFO);
        const user = userJson ? (JSON.parse(userJson) as User) : null;

        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: !!(accessToken && refreshToken && user),
          isLoading: false,
          isInitialized: true,
        });
      },

      /**
       * 로그인
       */
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login(credentials);

          // 토큰 저장
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
          localStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            response.refreshToken
          );
          localStorage.setItem(
            STORAGE_KEYS.USER_INFO,
            JSON.stringify(response.user)
          );

          // 상태 업데이트
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
        // 토큰 및 사용자 정보 제거
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);

        // 상태 초기화
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
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          get().logout();
          throw new Error('리프레시 토큰이 없습니다');
        }

        try {
          const response = await authApi.refreshAccessToken(refreshToken);

          // 새 토큰 저장
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
          localStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            response.refreshToken
          );

          // 상태 업데이트
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
        if (user) {
          localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        }
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      /**
       * 토큰 설정
       */
      setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
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
      partialize: (state) => ({
        // persist에서는 플래그만 저장 (실제 토큰은 별도 관리)
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // persist 복원 완료 후 초기화 실행
        state?.initialize();
      },
    }
  )
);
