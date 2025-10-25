import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApiErrorMessage } from '@/shared/api/client';
import * as authApi from '../api';
import type { AuthState, LoginRequest, SignupRequest, User } from '../types';

// 🔴 Phase 3-1 ~ 3-7: Mock 데이터로 페이지 구현
// Phase 3-8에서 API 연결 시 이 코드 전체 제거
const MOCK_USERS: Record<string, User> = {
  soonja: {
    id: 1,
    username: 'soonja',
    name: '김순자',
    role: 'SENIOR',
    phoneNumber: '010-9999-8888',
    email: 'soonja@example.com',
    dailyCheckEnabled: true,
    guardian: { id: 2, name: '김영희', relationship: '딸' },
    managedMembers: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  younghee: {
    id: 2,
    username: 'younghee',
    name: '김영희',
    role: 'GUARDIAN',
    phoneNumber: '010-1234-5678',
    email: 'younghee@example.com',
    dailyCheckEnabled: false,
    guardian: null,
    managedMembers: [
      {
        id: 1,
        name: '김순자',
        email: 'soonja@example.com',
        lastCheckIn: '2025-10-12T10:00:00Z',
        lastCheckTime: '2025-10-12T10:00:00Z',
        emotionStatus: 'POSITIVE',
      },
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  cheolsu: {
    id: 3,
    username: 'cheolsu',
    name: '박철수',
    role: 'SENIOR',
    phoneNumber: '010-5555-6666',
    email: 'cheolsu@example.com',
    dailyCheckEnabled: true,
    guardian: null,
    managedMembers: [
      {
        id: 4,
        name: '박아버지',
        email: 'father@example.com',
        lastCheckIn: '2025-10-12T08:00:00Z',
        lastCheckTime: '2025-10-12T08:00:00Z',
        emotionStatus: 'POSITIVE',
      },
      {
        id: 5,
        name: '박어머니',
        email: 'mother@example.com',
        lastCheckIn: '2025-10-12T09:00:00Z',
        lastCheckTime: '2025-10-12T09:00:00Z',
        emotionStatus: 'WARNING',
      },
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  newuser: {
    id: 6,
    username: 'newuser',
    name: '신규사용자',
    role: 'SENIOR',
    phoneNumber: '010-7777-8888',
    email: 'newuser@example.com',
    dailyCheckEnabled: false,
    guardian: null,
    managedMembers: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
};

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
          // 🔴 Phase 3-1 ~ 3-7: Mock 데이터 반환
          // Phase 3-8에서 API 연결 시 이 if문 제거
          const mockUser = MOCK_USERS[credentials.username];
          if (mockUser) {
            // Mock 로그인 성공 (비밀번호 체크 안 함)
            set({
              user: mockUser,
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token',
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }

          // 🔴 Phase 3-8에서 활성화: 실제 API 호출
          // const response = await authApi.login(credentials);
          // set({
          //   user: response.user,
          //   accessToken: response.accessToken,
          //   refreshToken: response.refreshToken,
          //   isAuthenticated: true,
          //   isLoading: false,
          //   error: null,
          // });

          // Mock 데이터에 없는 username이면 에러
          throw new Error(
            '사용자를 찾을 수 없습니다. (soonja, younghee, cheolsu, newuser 중 하나를 입력하세요)'
          );
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
       */
      signup: async (credentials: SignupRequest) => {
        set({ isLoading: true, error: null });

        try {
          // 🔴 Phase 3-2: Mock 회원가입
          // Phase 3-8에서 실제 API 호출로 변경
          const newUser: User = {
            id: Date.now(),
            username: credentials.email.split('@')[0], // 이메일의 @ 앞부분을 username으로
            name: credentials.name,
            role: 'SENIOR', // 기본값: 노인
            phoneNumber: credentials.phoneNumber,
            email: credentials.email,
            dailyCheckEnabled: false, // 기본값: 비활성
            guardian: null,
            managedMembers: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            user: newUser,
            accessToken: `mock-token-${Date.now()}`,
            refreshToken: `mock-refresh-${Date.now()}`,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // 🔴 Phase 3-8에서 활성화: 실제 API 호출
          // const response = await authApi.signup(credentials);
          // set({ user: response.user, ... });
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
        authApi.logout().catch(error => {
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
