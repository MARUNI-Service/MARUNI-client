import { useMutation, useQuery } from '@tanstack/react-query';
import { getMyInfo, updateMyInfo, updateDailyCheckSetting } from '../api/memberApi';
import { useAuth } from '@/features/auth';
import { useToast } from '@/shared/hooks/useToast';

/**
 * Member 관련 훅
 * Phase 3-8: 실제 API 호출로 변경
 * - 내 정보 조회
 * - 내 정보 수정 (이름, 이메일, 비밀번호)
 * - 안부 메시지 설정 변경
 */
export function useMember() {
  const { setUser } = useAuth();
  const toast = useToast();

  // 내 정보 조회
  const { data: profile, isLoading } = useQuery({
    queryKey: ['member', 'me'],
    queryFn: getMyInfo,
  });

  // 내 정보 수정
  const { mutateAsync: updateProfileMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: (updatedUser) => {
      setUser(updatedUser); // AuthStore 업데이트로 즉시 반영
      toast.success('저장되었습니다!');
    },
    onError: () => {
      toast.error('저장에 실패했습니다');
    },
  });

  // 안부 메시지 설정 변경
  const { mutateAsync: updateDailyCheckMutation, isPending: isUpdatingDailyCheck } = useMutation({
    mutationFn: updateDailyCheckSetting,
    onSuccess: (updatedUser) => {
      setUser(updatedUser); // AuthStore 업데이트로 즉시 반영
      toast.success(
        updatedUser.dailyCheckEnabled
          ? '안부 메시지를 받습니다'
          : '안부 메시지를 받지 않습니다'
      );
    },
    onError: () => {
      toast.error('설정 변경에 실패했습니다');
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation,
    isUpdating,
    updateDailyCheck: updateDailyCheckMutation,
    isUpdatingDailyCheck,
  };
}
