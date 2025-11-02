import type { GuardianRelation } from '@/shared/types/enums';

/**
 * 회원 정보 수정 요청
 */
export interface UpdateMemberRequest {
  memberEmail: string;
  memberName: string;
  memberPassword: string;
}

/**
 * 내가 돌보는 사람 정보 (응답)
 */
export interface ManagedMemberResponse {
  memberId: number;
  memberName: string;
  memberEmail: string;
  relation: GuardianRelation;
  dailyCheckEnabled: boolean;
  lastDailyCheckAt: string | null;
}
