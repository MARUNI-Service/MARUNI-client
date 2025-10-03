import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '../store';
import type { LoginRequest } from '../types';

/**
 * 로그인 폼 상태 관리 훅
 */
export function useLoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  /**
   * 입력 필드 변경 핸들러
   */
  const handleChange = (field: keyof LoginRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 입력 시작하면 해당 필드의 유효성 검사 에러 제거
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // API 에러 제거
    if (error) {
      clearError();
    }
  };

  /**
   * 폼 유효성 검사
   */
  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {};

    if (!formData.username.trim()) {
      errors.username = '사용자 이름을 입력해주세요';
    }

    if (!formData.password) {
      errors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 4) {
      errors.password = '비밀번호는 4자 이상이어야 합니다';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * 로그인 제출 핸들러
   */
  const handleSubmit = async () => {
    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);

      // 로그인 성공 시 리다이렉트
      // URL에 redirect 파라미터가 있으면 해당 경로로, 없으면 대시보드로
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect') || ROUTES.DASHBOARD;
      navigate(redirectPath);
    } catch (error) {
      // 에러는 store에서 처리됨
      console.error('로그인 실패:', error);
    }
  };

  return {
    formData,
    validationErrors,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
}
