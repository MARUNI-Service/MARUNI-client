import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import {
  mockSearchGuardians,
  mockCreateGuardianRequest,
  mockGetGuardianRequests,
  mockHandleGuardianRequest,
} from '../api/mockGuardianApi';
import { useToast } from '@/shared/hooks/useToast';
import type { GuardianSearchResult } from '../types';

/**
 * 보호자 관계 관리 훅
 * - TanStack Query를 사용한 서버 상태 관리
 * - 자동 캐싱, 낙관적 업데이트, 에러 처리
 */
export function useGuardian() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const toast = useToast();

  // 보호자 요청 목록 조회 (Query - 자동 캐싱)
  const {
    data: requests = [],
    isLoading,
  } = useQuery({
    queryKey: ['guardian', 'requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const allRequests = await mockGetGuardianRequests(user.id);
      return allRequests.filter((req) => req.status === 'PENDING');
    },
    enabled: !!user,
  });

  // 보호자 검색 (Mutation - 사용자 트리거)
  const {
    mutateAsync: searchGuardians,
    isPending: isSearching,
  } = useMutation<GuardianSearchResult[], Error, string>({
    mutationFn: mockSearchGuardians,
  });

  // 보호자 요청 생성
  const { mutateAsync: requestGuardian } = useMutation({
    mutationFn: mockCreateGuardianRequest,
    onSuccess: () => {
      toast.success('보호자 등록 요청을 보냈습니다!');
    },
    onError: () => {
      toast.error('보호자 요청에 실패했습니다');
    },
  });

  // 보호자 요청 수락
  const { mutateAsync: acceptGuardianRequest } = useMutation({
    mutationFn: (requestId: number) =>
      mockHandleGuardianRequest({ requestId, action: 'ACCEPT' }),
    onSuccess: (request) => {
      // managedMembers 업데이트
      if (!user) return;

      const newMember = {
        id: request.seniorId,
        name: request.seniorName,
        email: request.seniorEmail,
        lastCheckIn: null,
        lastCheckTime: undefined,
        emotionStatus: 'NEUTRAL' as const,
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
    mutationFn: (requestId: number) =>
      mockHandleGuardianRequest({ requestId, action: 'REJECT' }),
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
