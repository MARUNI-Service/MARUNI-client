import { useState } from 'react';
import { useAuthStore } from '@/features/auth';
import {
  mockSearchGuardians,
  mockCreateGuardianRequest,
  mockGetGuardianRequests,
  mockHandleGuardianRequest,
} from '../api/mockGuardianApi';
import type {
  GuardianSearchResult,
  CreateGuardianRequestInput,
  GuardianRequest,
} from '../types';

/**
 * 보호자 관계 관리 훅
 */
export function useGuardian() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 보호자 검색
   */
  const searchGuardians = async (keyword: string): Promise<GuardianSearchResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await mockSearchGuardians(keyword);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '검색에 실패했습니다';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 보호자 등록 요청
   */
  const requestGuardian = async (input: CreateGuardianRequestInput): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await mockCreateGuardianRequest(input);
      // 요청 성공 (푸시 알림은 Phase 3-6에서 구현)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '요청에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 받은 보호자 요청 목록 조회
   */
  const getGuardianRequests = async (): Promise<GuardianRequest[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      const requests = await mockGetGuardianRequests(user.id);
      return requests.filter((req) => req.status === 'PENDING');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '조회에 실패했습니다';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 보호자 요청 수락
   */
  const acceptGuardianRequest = async (requestId: number): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const request = await mockHandleGuardianRequest({ requestId, action: 'ACCEPT' });

      // 수락 시 양쪽 사용자 업데이트
      // 1. 현재 사용자(보호자)의 managedMembers에 추가
      const newManagedMember = {
        id: request.seniorId,
        name: request.seniorName,
        email: request.seniorEmail,
        lastCheckIn: null,
        lastCheckTime: undefined,
        emotionStatus: 'NEUTRAL' as const,
      };

      setUser({
        ...user,
        managedMembers: [...(user.managedMembers || []), newManagedMember],
      });

      // 2. 노인 사용자의 guardian 필드 업데이트 (실제로는 서버에서 처리)
      // Mock에서는 현재 사용자만 업데이트
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '수락에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 보호자 요청 거절
   */
  const rejectGuardianRequest = async (requestId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await mockHandleGuardianRequest({ requestId, action: 'REJECT' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '거절에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentGuardian: user?.guardian || null,
    managedMembers: user?.managedMembers || [],
    isLoading,
    error,
    searchGuardians,
    requestGuardian,
    getGuardianRequests,
    acceptGuardianRequest,
    rejectGuardianRequest,
  };
}
