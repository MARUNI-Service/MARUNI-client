import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '../store';
import type { LoginRequest } from '../types';

/**
 * 로그인 폼 상태 관리 훅
 * Phase 3-8: API 연결 - memberEmail, memberPassword 사용
 */
export function useLoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState<LoginRequest>({
    memberEmail: '',
    memberPassword: '',
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
    // 빈 값 체크
    if (!formData.memberEmail.trim() || !formData.memberPassword.trim()) {
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
