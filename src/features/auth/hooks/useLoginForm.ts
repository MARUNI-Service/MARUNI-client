import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '../store';
import type { LoginRequest } from '../types';

/**
 * 로그인 폼 상태 관리 훅 (MVP 단순화 버전)
 * - Phase 3-1 ~ 3-7: Mock 로그인이므로 복잡한 validation 불필요
 * - Phase 3-8: API 연결 시 필요한 validation 추가
 */
export function useLoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  /**
   * 입력 필드 변경 핸들러
   */
  const handleChange = (field: keyof LoginRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // API 에러 제거
    if (error) {
      clearError();
    }
  };

  /**
   * 로그인 제출 핸들러
   */
  const handleSubmit = async () => {
    // 🔴 MVP 단순화: validation 최소화 (빈 값만 체크)
    if (!formData.username.trim()) {
      return;
    }

    try {
      await login(formData);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // 에러는 store에서 처리됨
      console.error('로그인 실패:', error);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
}
