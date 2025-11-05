import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 비밀번호 변경 페이지
 * Phase 3-8: 비밀번호 변경은 프로필 수정 페이지에서 통합 처리
 * 이 페이지는 프로필 수정 페이지로 리다이렉트
 */
export function PasswordPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 프로필 수정 페이지로 리다이렉트
    navigate(ROUTES.SETTINGS_PROFILE, { replace: true });
  }, [navigate]);

  return null;
}
