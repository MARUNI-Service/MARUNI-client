import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { useToast } from '@/shared/hooks/useToast';
import {
  createAlertRule as createAlertRuleApi,
  getAlertRules,
  getAlertRuleDetail,
  updateAlertRule as updateAlertRuleApi,
  deleteAlertRule as deleteAlertRuleApi,
  toggleAlertRule as toggleAlertRuleApi,
  getAlertHistory,
  getAlertHistoryDetail,
} from '../api';
import type {
  AlertRuleCreateRequest,
  AlertRuleUpdateRequest,
  AlertRuleResponseDto,
  AlertHistoryResponseDto,
} from '../types';

/**
 * 알림 규칙 관리 훅
 * Phase 3-8: 실제 API 호출
 * - TanStack Query를 사용한 서버 상태 관리
 * - 자동 캐싱, 낙관적 업데이트, 에러 처리
 */
export function useAlertRule() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const toast = useToast();

  // 알림 규칙 목록 조회 (Query - 자동 캐싱)
  const {
    data: alertRules = [],
    isLoading: isLoadingRules,
  } = useQuery({
    queryKey: ['alert', 'rules'],
    queryFn: getAlertRules,
    enabled: !!user,
  });

  // 알림 이력 조회 (Query - 자동 캐싱)
  const {
    data: alertHistory = [],
    isLoading: isLoadingHistory,
  } = useQuery({
    queryKey: ['alert', 'history'],
    queryFn: () => getAlertHistory(30), // 최근 30일
    enabled: !!user,
  });

  // 알림 규칙 생성
  const { mutateAsync: createAlertRule, isPending: isCreating } = useMutation({
    mutationFn: (request: AlertRuleCreateRequest) => createAlertRuleApi(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert', 'rules'] });
      toast.success('알림 규칙이 생성되었습니다');
    },
    onError: (error: Error) => {
      toast.error(error.message || '알림 규칙 생성에 실패했습니다');
    },
  });

  // 알림 규칙 수정
  const { mutateAsync: updateAlertRule, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, request }: { id: number; request: AlertRuleUpdateRequest }) =>
      updateAlertRuleApi(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert', 'rules'] });
      toast.success('알림 규칙이 수정되었습니다');
    },
    onError: (error: Error) => {
      toast.error(error.message || '알림 규칙 수정에 실패했습니다');
    },
  });

  // 알림 규칙 삭제
  const { mutateAsync: deleteAlertRule, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteAlertRuleApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert', 'rules'] });
      toast.success('알림 규칙이 삭제되었습니다');
    },
    onError: (error: Error) => {
      toast.error(error.message || '알림 규칙 삭제에 실패했습니다');
    },
  });

  // 알림 규칙 활성화/비활성화
  const { mutateAsync: toggleAlertRule, isPending: isToggling } = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      toggleAlertRuleApi(id, active),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['alert', 'rules'] });
      toast.success(data.active ? '알림 규칙이 활성화되었습니다' : '알림 규칙이 비활성화되었습니다');
    },
    onError: (error: Error) => {
      toast.error(error.message || '알림 규칙 토글에 실패했습니다');
    },
  });

  // 알림 규칙 상세 조회 함수
  const fetchAlertRuleDetail = async (id: number): Promise<AlertRuleResponseDto> => {
    return getAlertRuleDetail(id);
  };

  // 알림 이력 상세 조회 함수
  const fetchAlertHistoryDetail = async (id: number): Promise<AlertHistoryResponseDto> => {
    return getAlertHistoryDetail(id);
  };

  return {
    // Data
    alertRules,
    alertHistory,

    // Loading States
    isLoadingRules,
    isLoadingHistory,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,

    // Mutations
    createAlertRule,
    updateAlertRule,
    deleteAlertRule,
    toggleAlertRule,

    // Query Functions
    fetchAlertRuleDetail,
    fetchAlertHistoryDetail,
  };
}
