/**
 * 보호자 관계 관리 관련 타입
 */
import type { GuardianRelation } from '@/shared/types/enums';

/**
 * 보호자 등록 요청
 */
export interface GuardianRequest {
  id: number;
  seniorId: number; // 요청을 보낸 노인 ID
  seniorName: string;
  seniorEmail: string;
  guardianId: number; // 요청을 받은 보호자 ID
  relation: GuardianRelation; // 보호자 관계 (FAMILY, FRIEND 등)
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

/**
 * 보호자 검색 결과
 */
export interface GuardianSearchResult {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
}

/**
 * 보호자 등록 요청 생성
 */
export interface CreateGuardianRequestInput {
  guardianId: number;
}

/**
 * 보호자 요청 수락/거절
 */
export interface GuardianRequestAction {
  requestId: number;
  action: 'ACCEPT' | 'REJECT';
}
