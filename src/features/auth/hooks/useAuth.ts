import { useAuthStore } from '../store';

/**
 * 인증 관련 훅
 * authStore를 래핑하여 편리한 API 제공
 */
export function useAuth() {
  const {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    logout,
    setUser,
    setTokens,
  } = useAuthStore();

  return {
    // 상태
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    isInitialized,

    // 액션
    login,
    logout,
    setUser,
    setTokens,
  };
}
