import { useMutation, useQuery } from '@tanstack/react-query';
import { getProfile, updateProfile, changePassword } from '../api/memberApi';
import { useAuth } from '@/features/auth';
import { useToast } from '@/shared/hooks/useToast';
import type { ProfileUpdateRequest, PasswordChangeRequest } from '../types';

/**
 * Member 관련 훅
 * - 프로필 조회, 수정
 * - 비밀번호 변경
 */
export function useMember() {
  const { setUser } = useAuth();
  const toast = useToast();

  // 프로필 조회
  const { data: profile, isLoading } = useQuery({
    queryKey: ['member', 'profile'],
    queryFn: getProfile,
  });

  // 프로필 수정
  const { mutateAsync: updateProfileMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser); // AuthStore 업데이트로 즉시 반영
      toast.success('저장되었습니다!');
    },
    onError: () => {
      toast.error('저장에 실패했습니다');
    },
  });

  // 비밀번호 변경
  const { mutateAsync: changePasswordMutation, isPending: isChangingPassword } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation,
    isUpdating,
    changePassword: changePasswordMutation,
    isChangingPassword,
  };
}
