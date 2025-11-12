import { useAuthStore } from '@/features/auth';
import type { ManagedMember, User } from '@/features/auth/types';
import { searchMember } from '@/features/member/api';
import { useToast } from '@/shared/hooks/useToast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptGuardianRequest as acceptGuardianRequestApi,
  createGuardianRequest,
  getGuardianRequests,
  rejectGuardianRequest as rejectGuardianRequestApi,
} from '../api';

/**
 * 보호자 관계 관리 훅
 * Phase 3-8: 실제 API 호출로 변경
 * - TanStack Query를 사용한 서버 상태 관리
 * - 자동 캐싱, 낙관적 업데이트, 에러 처리
 */
export function useGuardian() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const toast = useToast();

  // 보호자 요청 목록 조회 (Query - 자동 캐싱)
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['guardian', 'requests'],
    queryFn: async () => {
      const allRequests = await getGuardianRequests();
      return allRequests.filter(req => req.status === 'PENDING');
    },
    enabled: !!user,
  });

  // 보호자 검색 (Mutation - 사용자 트리거)
  const { mutateAsync: searchGuardians, isPending: isSearching } = useMutation<User, Error, string>(
    {
      mutationFn: searchMember, // Member API의 searchMember 사용
    }
  );

  // 보호자 요청 생성
  const { mutateAsync: requestGuardian } = useMutation({
    mutationFn: createGuardianRequest,
    onSuccess: () => {
      toast.success('보호자 등록 요청을 보냈습니다!');
    },
  });

  // 보호자 요청 수락
  const { mutateAsync: acceptGuardianRequest } = useMutation({
    mutationFn: acceptGuardianRequestApi,
    onSuccess: (_, requestId) => {
      // 요청 목록에서 수락한 요청 찾기
      const request = requests.find(req => req.id === requestId);
      if (!user || !request) return;

      const newMember: ManagedMember = {
        memberId: request.requester.id,
        memberName: request.requester.name,
        memberEmail: request.requester.email,
        relation: request.relation,
        dailyCheckEnabled: true,
        lastDailyCheckAt: null,
      };

      setUser({
        ...user,
        managedMembers: [...(user?.managedMembers || []), newMember],
      });

      // 요청 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['guardian', 'requests'] });
      toast.success('보호자 요청을 수락했습니다!');
    },
    onError: () => {
      toast.error('보호자 요청 수락에 실패했습니다');
    },
  });

  // 보호자 요청 거절
  const { mutateAsync: rejectGuardianRequest } = useMutation({
    mutationFn: rejectGuardianRequestApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardian', 'requests'] });
      toast.info('보호자 요청을 거절했습니다');
    },
    onError: () => {
      toast.error('보호자 요청 거절에 실패했습니다');
    },
  });

  return {
    currentGuardian: user?.guardian || null,
    managedMembers: user?.managedMembers || [],
    isLoading,
    isSearching,
    requests,
    searchGuardians,
    requestGuardian,
    acceptGuardianRequest,
    rejectGuardianRequest,
  };
}
