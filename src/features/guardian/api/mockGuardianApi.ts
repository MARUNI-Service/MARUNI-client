import type {
  GuardianRequest,
  GuardianSearchResult,
  CreateGuardianRequestInput,
  GuardianRequestAction,
} from '../types';

/**
 * Mock 사용자 데이터
 * 실제 데이터는 Phase 3-8에서 서버 API로 대체
 */
const MOCK_USERS: GuardianSearchResult[] = [
  {
    id: 1,
    email: 'soonja@example.com',
    name: '김순자',
    phoneNumber: '010-9999-8888',
  },
  {
    id: 2,
    email: 'younghee@example.com',
    name: '김영희',
    phoneNumber: '010-8888-7777',
  },
  {
    id: 3,
    email: 'cheolsu@example.com',
    name: '박철수',
    phoneNumber: '010-7777-6666',
  },
];

/**
 * Mock 보호자 검색
 * Phase 3-8에서 GET /api/members/search?keyword= 로 대체
 */
export const mockSearchGuardians = (keyword: string): Promise<GuardianSearchResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_USERS.filter(
        (user) =>
          user.email.toLowerCase().includes(keyword.toLowerCase()) || user.name.includes(keyword)
      );
      resolve(results);
    }, 500); // 네트워크 지연 시뮬레이션
  });
};

/**
 * Mock 보호자 등록 요청 생성
 * Phase 3-8에서 POST /api/members/me/guardian-request 로 대체
 */
export const mockCreateGuardianRequest = (
  input: CreateGuardianRequestInput
): Promise<GuardianRequest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const request: GuardianRequest = {
        id: Date.now(),
        seniorId: 1, // Mock: 현재 사용자 ID
        seniorName: '김순자',
        seniorEmail: 'soonja@example.com',
        guardianId: input.guardianId,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      // localStorage에 저장
      const requests = JSON.parse(localStorage.getItem('guardian-requests') || '[]');
      requests.push(request);
      localStorage.setItem('guardian-requests', JSON.stringify(requests));

      resolve(request);
    }, 500);
  });
};

/**
 * Mock 보호자 요청 목록 조회
 * Phase 3-8에서 GET /api/guardians/requests 로 대체
 */
export const mockGetGuardianRequests = (userId: number): Promise<GuardianRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const requests = JSON.parse(localStorage.getItem('guardian-requests') || '[]');
      const filtered = requests.filter((req: GuardianRequest) => req.guardianId === userId);
      resolve(filtered);
    }, 300);
  });
};

/**
 * Mock 보호자 요청 수락/거절
 * Phase 3-8에서 POST /api/guardians/accept or /reject 로 대체
 */
export const mockHandleGuardianRequest = (
  action: GuardianRequestAction
): Promise<GuardianRequest> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const requests: GuardianRequest[] = JSON.parse(
        localStorage.getItem('guardian-requests') || '[]'
      );
      const index = requests.findIndex((req) => req.id === action.requestId);

      if (index === -1) {
        reject(new Error('요청을 찾을 수 없습니다'));
        return;
      }

      requests[index].status = action.action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
      localStorage.setItem('guardian-requests', JSON.stringify(requests));

      resolve(requests[index]);
    }, 500);
  });
};
