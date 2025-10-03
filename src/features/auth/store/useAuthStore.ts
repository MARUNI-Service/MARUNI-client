import { create } from 'zustand';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import { getApiErrorMessage } from '@/shared/api/client';
import * as authApi from '../api';
import type { AuthState, LoginRequest, User } from '../types';

/**
 * Auth Store (Zustand)
 * - 인증 상태 관리
 * - 로그인/로그아웃 처리
 * - 토큰 갱신 처리
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 상태
  user: null,
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

      // 토큰 저장
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

      // 사용자 정보 저장
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({
        user: null,
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
    // 토큰 제거
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    // 상태 초기화
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // 서버에 로그아웃 요청
    authApi.logout().catch((error) => {
      console.error('로그아웃 API 호출 실패:', error);
    });
  },

  /**
   * 토큰 갱신
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      get().logout();
      throw new Error('리프레시 토큰이 없습니다');
    }

    try {
      const response = await authApi.refreshAccessToken(refreshToken);

      // 새 토큰 저장
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
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
   * 에러 메시지 초기화
   */
  clearError: () => {
    set({ error: null });
  },
}));
