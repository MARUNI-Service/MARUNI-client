/**
 * 보호자 관계 관리 관련 타입
 * Phase 3-8: 서버 API 응답 구조에 맞춤
 */
import type { GuardianRelation, RequestStatus } from '@/shared/types/enums';

/**
 * 보호자 요청 생성 요청
 * Phase 3-8: POST /api/guardians/requests
 */
export interface GuardianRequestRequest {
  guardianId: number;
  relation: GuardianRelation;
}

/**
 * 보호자 요청 응답 (서버 응답)
 * Phase 3-8: 서버 API 응답 구조
 */
export interface GuardianRequestResponse {
  id: number;
  requester: {
    id: number;
    name: string;
    email: string;
  };
  guardian: {
    id: number;
    name: string;
    email: string;
  };
  relation: GuardianRelation;
  status: RequestStatus; // PENDING, ACCEPTED, REJECTED
  createdAt: string; // ISO 8601
}
