# Phase 3-3: 보호자 관계 관리 - 세부 구현 계획

**작성일**: 2025-10-17
**최종 업데이트**: 2025-10-17 (v1.1.0 - 리뷰 반영)
**예상 소요 시간**: 2-3일 (10-12시간)
**상태**: 📋 준비 완료 (리뷰 반영 완료)
**우선순위**: 🟠 높음
**구현 원칙**: Mock 데이터 기반 구현 - 보호자 관계 플로우 완성
**API 연결**: ❌ 이 Phase에서는 연결 안 함 - Phase 3-8에서 일괄 연결
**의존성**: Phase 3-1 (기반 확립), Phase 3-2 (회원가입) 완료 필요

---

## 📋 목차

1. [Phase 개요](#phase-개요)
2. [API 연결 전략](#api-연결-전략)
3. [최소 구현 원칙](#최소-구현-원칙)
4. [기술 부채 관리](#기술-부채-관리)
5. [작업 분해](#작업-분해)
6. [Task별 구현 가이드](#task별-구현-가이드)
7. [테스트 계획](#테스트-계획)
8. [완료 체크리스트](#완료-체크리스트)

---

## Phase 개요

### 목표

노인과 보호자 간 관계 성립 및 관리 기능을 완성하여, 보호자가 돌보는 사람의 상태를 확인하고 이상 징후 알림을 받을 수 있도록 한다.

### 핵심 요구사항

**user-flow.md Journey 3-4 (보호자 등록 및 알림) 재현**:

```
[김순자] 설정 → 보호자 관리 → 보호자 찾기 → 검색 → 등록 요청
                                                       ↓
[김영희] 푸시 알림 수신 → 요청 확인 → 수락 → 메인 화면 업데이트
```

**Journey 3의 6단계 구현**:
1. ✅ Phase 1: 설정 메뉴 접근 (Phase 3-5에서 구현)
2. 🎯 Phase 2: 보호자 관리 화면 구현
3. 🎯 Phase 3: 보호자 검색 기능
4. 🎯 Phase 4: 등록 요청 발송
5. 🎯 Phase 5: 보호자의 요청 수락
6. 🎯 Phase 6: 메인 화면 자동 업데이트

### 범위

**포함**:

- ✅ features/guardian 모듈 생성
  - Guardian 관련 타입 정의 (GuardianRequest, GuardianRelation)
  - Mock 보호자 검색 API
  - Mock 보호자 등록 요청 API
  - Mock 보호자 수락/거절 API
  - useGuardian, useManagedMembers 훅
- ✅ 보호자 관리 화면 3개
  - /guardians - 보호자 목록 및 관리
  - /guardians/search - 보호자 검색
  - /guardians/requests - 보호자 요청 목록
- ✅ 보호자 관계 플로우
  - 노인: 보호자 검색 → 등록 요청
  - 보호자: 요청 수신 → 수락/거절
  - 관계 성립 시 메인 화면 자동 업데이트
- ✅ Mock 사용자 데이터 확장
  - 김순자, 김영희, 박철수 페르소나 Mock 데이터
  - 보호자 검색 시 다른 사용자 조회 가능

**제외**:

- ❌ API 연결 (Phase 3-8에서 일괄 연결)
- ❌ 푸시 알림 (Phase 3-6에서 구현)
- ❌ 보호자 관계 해제 기능 (Phase 3-5에서 설정 메뉴와 함께 구현)
- ❌ 여러 보호자 등록 (1:1 관계만)
- ❌ 보호자 초대 링크 생성 (Phase 4)

---

## API 연결 전략

### Phase 3-3: Mock 데이터로 보호자 관계 구현

**원칙**:

- **보호자 관계 플로우만 구현, 실제 API는 호출 안 함**
- 보호자 검색 시 Mock 사용자 목록에서 검색
- 보호자 등록 요청 시 localStorage에 요청 목록 저장
- 보호자 수락 시 양쪽 사용자의 guardian/managedMembers 업데이트

### Phase 3-3에서 할 일

1. **보호자 검색 구현**

   - Mock 사용자 목록 생성 (김순자, 김영희, 박철수)
   - 이메일/이름으로 검색 필터링
   - `GET /api/members/search?keyword=` 호출 안 함

2. **보호자 등록 요청**

   - localStorage에 요청 목록 저장 (`guardian-requests`)
   - `POST /api/members/me/guardian-request` 호출 안 함

3. **보호자 수락/거절**

   - 요청 수락 시 양쪽 사용자 업데이트:
     - 노인: `guardian` 필드 업데이트
     - 보호자: `managedMembers` 배열에 추가
   - `POST /api/guardians/accept` 호출 안 함

4. **메인 화면 자동 업데이트**
   - useAuthStore의 user 객체 업데이트
   - 메인 화면이 guardian/managedMembers 기반으로 재렌더링

### Phase 3-8 (API 연결) 계획

Phase 3-1 ~ 3-7 완료 후:

1. **보호자 검색 API 연동**

   - `GET /api/members/search?keyword=` 실제 호출
   - 서버에서 사용자 검색 결과 반환

2. **보호자 등록 요청 API 연동**

   - `POST /api/members/me/guardian-request` 실제 호출
   - 서버에서 요청 생성 및 푸시 알림 발송

3. **보호자 수락/거절 API 연동**

   - `POST /api/guardians/accept` 실제 호출
   - `POST /api/guardians/reject` 실제 호출

4. **보호자 관계 조회 API 연동**
   - `GET /api/members/me/guardian` (내 보호자 조회)
   - `GET /api/guardians/managed-members` (내가 돌보는 사람들)

**장점**:

- ✅ 보호자 관계 플로우를 먼저 완성하고 나중에 API 연결
- ✅ 서버 API 준비 안 돼도 프론트 개발 가능
- ✅ 메인 화면 동적 업데이트 로직 먼저 완성

---

## 최소 구현 원칙

### 1. Mock 사용자 데이터는 간단하게

```typescript
// ✅ Good: 최소한의 Mock 데이터
const MOCK_USERS = [
  {
    id: 1,
    email: 'soonja@example.com',
    name: '김순자',
    role: 'SENIOR' as const,
    phoneNumber: '010-9999-8888',
  },
  {
    id: 2,
    email: 'younghee@example.com',
    name: '김영희',
    role: 'SENIOR' as const,
    phoneNumber: '010-8888-7777',
  },
  {
    id: 3,
    email: 'cheolsu@example.com',
    name: '박철수',
    role: 'SENIOR' as const,
    phoneNumber: '010-7777-6666',
  },
];

// ❌ Bad: 과도하게 많은 Mock 데이터
const MOCK_USERS = [...100개의 사용자]; // 불필요
```

### 2. 보호자 검색은 클라이언트 필터링

```typescript
// ✅ Good: Array.filter로 간단하게
const searchUsers = (keyword: string) => {
  return MOCK_USERS.filter(
    (user) =>
      user.email.includes(keyword) || user.name.includes(keyword)
  );
};

// ❌ Bad: 복잡한 검색 로직
const searchUsers = (keyword: string) => {
  // Fuzzy search, 정규식, 점수 계산 등 불필요
};
```

### 3. 보호자 요청은 localStorage로 간단하게

```typescript
// ✅ Good: localStorage 직접 사용
const saveGuardianRequest = (request: GuardianRequest) => {
  const requests = JSON.parse(localStorage.getItem('guardian-requests') || '[]');
  requests.push(request);
  localStorage.setItem('guardian-requests', JSON.stringify(requests));
};

// ❌ Bad: 복잡한 상태 관리
const { saveRequest } = useGuardianRequestStore(); // 불필요
```

### 4. 메인 화면 업데이트는 useAuthStore만 사용

```typescript
// ✅ Good: useAuthStore의 user 객체 직접 업데이트
const acceptGuardian = (guardianId: number) => {
  const { user, setUser } = useAuthStore.getState();
  if (user) {
    setUser({
      ...user,
      guardian: { id: guardianId, name: '김영희', ... },
    });
  }
};

// ❌ Bad: 별도 Guardian 스토어 생성
const { setGuardian } = useGuardianStore(); // 불필요
```

---

## 기술 부채 관리

### Technical Debt Tracking

Phase 3-7에서 공통 컴포넌트로 리팩토링 예정인 임시 구현들에 **TODO 주석 추가**:

#### Modal 대체 필요

- `GuardianSearchPage.tsx`: 등록 확인 다이얼로그
  ```typescript
  // TODO: Phase 3-7에서 공통 Modal 컴포넌트로 교체 예정
  {showConfirmDialog && ...}
  ```

#### Toast 대체 필요

- `GuardianSearchPage.tsx`: alert() 사용 (2군데)
- `GuardianRequestsPage.tsx`: alert() 사용 (4군데)
  ```typescript
  // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
  alert('보호자 등록 요청을 보냈습니다!');
  ```

### 주석 규칙

```typescript
// TODO (Phase 3-7): 설명 - 향후 개선 사항
// FIXME: 버그 설명 - 당장 수정 필요
// HACK: 임시 방편 설명 - 더 나은 방법 필요
```

### ESLint 룰 추가 (선택사항)

```javascript
// .eslintrc.js
rules: {
  'no-warning-comments': ['warn', {
    terms: ['TODO', 'FIXME', 'HACK'],
    location: 'start'
  }]
}
```

**장점**:
- ✅ 기술 부채를 명시적으로 추적
- ✅ Phase 3-7 시작 시 `grep -r "TODO: Phase 3-7"` 로 한 번에 찾기
- ✅ 코드 리뷰 시 임시 구현임을 명확히 인지

---

## 작업 분해

### Task 1: features/guardian 모듈 생성 (3-4시간)

- Guardian 관련 타입 정의
- Mock 사용자 데이터 생성
- Mock 보호자 검색/요청/수락 함수
- useGuardian, useManagedMembers 훅

### Task 2: 보호자 관리 페이지 (/guardians) (2-3시간)

- GuardiansPage 컴포넌트 생성
- 현재 보호자 표시 (guardian 있을 때)
- 보호자 없을 때 안내 메시지
- "보호자 찾기" 버튼

### Task 3: 보호자 검색 페이지 (/guardians/search) (2-3시간)

- GuardianSearchPage 컴포넌트 생성
- 검색 입력 필드 (이메일/이름)
- 검색 결과 목록 표시
- 검색 결과 선택 → 등록 확인 다이얼로그

### Task 4: 보호자 요청 목록 페이지 (/guardians/requests) (2시간)

- GuardianRequestsPage 컴포넌트 생성
- 받은 요청 목록 표시
- 수락/거절 버튼
- 요청 없을 때 안내 메시지

### Task 5: 라우팅 및 통합 테스트 (1-2시간)

- router.tsx에 3개 페이지 라우트 추가
- ROUTES 상수 추가
- 전체 플로우 테스트
- TypeScript 빌드 확인

**총 예상 시간**: 10-14시간 (2-3일)

---

## Task별 구현 가이드

### Task 1: features/guardian 모듈 생성

#### 파일: `src/features/guardian/types/guardian.types.ts`

```typescript
/**
 * 보호자 관계 관리 관련 타입
 */

/**
 * 보호자 등록 요청
 */
export interface GuardianRequest {
  id: number;
  seniorId: number; // 요청을 보낸 노인 ID
  seniorName: string;
  seniorEmail: string;
  guardianId: number; // 요청을 받은 보호자 ID
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
```

#### 파일: `src/features/guardian/types/index.ts`

```typescript
export type {
  GuardianRequest,
  GuardianSearchResult,
  CreateGuardianRequestInput,
  GuardianRequestAction,
} from './guardian.types';
```

#### 파일: `src/features/guardian/api/mockGuardianApi.ts`

```typescript
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
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.name.includes(keyword)
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
```

#### 파일: `src/features/guardian/hooks/useGuardian.ts`

```typescript
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
  GuardianRequestAction,
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
```

#### 파일: `src/features/guardian/hooks/index.ts`

```typescript
export { useGuardian } from './useGuardian';
```

#### 파일: `src/features/guardian/index.ts`

```typescript
export { useGuardian } from './hooks';
export type {
  GuardianRequest,
  GuardianSearchResult,
  CreateGuardianRequestInput,
  GuardianRequestAction,
} from './types';
```

---

### Task 2: 보호자 관리 페이지 (/guardians)

#### 파일: `src/pages/guardians/GuardiansPage.tsx`

```tsx
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Card } from '@/shared/components';
import { GuardianCard } from '@/shared/components/business/GuardianCard';
import { useGuardian } from '@/features/guardian';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 보호자 관리 페이지
 * - Journey 3 Phase 2: 보호자 관리 화면
 * - 현재 보호자 표시 (있을 경우)
 * - 보호자 찾기 버튼
 */
export function GuardiansPage() {
  const navigate = useNavigate();
  const { currentGuardian } = useGuardian();

  const handleSearchGuardian = () => {
    navigate(ROUTES.GUARDIANS_SEARCH);
  };

  return (
    <Layout title="보호자 관리" showBack={true}>
      <div className="space-y-6 p-4">
        {/* 현재 보호자 */}
        {currentGuardian ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">현재 보호자</h2>
            <GuardianCard
              name={currentGuardian.name}
              phoneNumber={currentGuardian.phoneNumber}
              email={currentGuardian.email}
              relation={currentGuardian.relation}
              onCall={() => {
                /* Phase 3-7에서 구현 */
              }}
            />
          </div>
        ) : (
          <Card padding="large" className="text-center">
            <div className="space-y-4">
              <div className="text-5xl">👨‍👩‍👧‍👦</div>
              <h2 className="text-2xl font-bold text-gray-900">등록된 보호자가 없습니다</h2>
              <p className="text-lg text-gray-600">
                보호자를 등록하면
                <br />
                이상 징후 발생 시<br />
                알림을 받을 수 있어요
              </p>
            </div>
          </Card>
        )}

        {/* 보호자 찾기 버튼 */}
        {!currentGuardian && (
          <Button
            variant="primary"
            size="extra-large"
            fullWidth
            onClick={handleSearchGuardian}
          >
            보호자 찾기
          </Button>
        )}

        {/* 보호자 변경/제거 (Phase 3-5에서 구현) */}
        {currentGuardian && (
          <div className="space-y-3">
            <Button
              variant="secondary"
              size="extra-large"
              fullWidth
              onClick={handleSearchGuardian}
            >
              보호자 변경
            </Button>
            <Button
              variant="danger"
              size="large"
              fullWidth
              onClick={() => {
                /* Phase 3-5에서 구현 */
              }}
            >
              보호자 제거
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
```

#### 파일: `src/pages/guardians/index.ts`

```typescript
export { GuardiansPage } from './GuardiansPage';
export { GuardianSearchPage } from './GuardianSearchPage';
export { GuardianRequestsPage } from './GuardianRequestsPage';
```

---

### Task 3: 보호자 검색 페이지 (/guardians/search)

#### 파일: `src/pages/guardians/GuardianSearchPage.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Input, Button, Card } from '@/shared/components';
import { useGuardian } from '@/features/guardian';
import type { GuardianSearchResult } from '@/features/guardian';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 보호자 검색 페이지
 * - Journey 3 Phase 3: 보호자 검색
 * - 이메일/이름으로 검색
 * - 검색 결과 목록 표시
 */
export function GuardianSearchPage() {
  const navigate = useNavigate();
  const { searchGuardians, requestGuardian, isLoading } = useGuardian();

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<GuardianSearchResult[]>([]);
  const [selectedGuardian, setSelectedGuardian] = useState<GuardianSearchResult | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    const searchResults = await searchGuardians(keyword);
    setResults(searchResults);
  };

  const handleSelectGuardian = (guardian: GuardianSearchResult) => {
    setSelectedGuardian(guardian);
    setShowConfirmDialog(true);
  };

  const handleConfirmRequest = async () => {
    if (!selectedGuardian) return;

    try {
      await requestGuardian({ guardianId: selectedGuardian.id });
      setShowConfirmDialog(false);

      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('보호자 등록 요청을 보냈습니다!');
      navigate(ROUTES.GUARDIANS);
    } catch (error) {
      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('요청에 실패했습니다');
    }
  };

  return (
    <Layout title="보호자 찾기" showBack={true}>
      <div className="space-y-6 p-4">
        {/* 안내 메시지 */}
        <Card padding="medium" className="bg-blue-50">
          <p className="text-lg text-gray-700">
            이메일 또는 이름으로
            <br />
            보호자를 검색하세요
          </p>
        </Card>

        {/* 검색 입력 */}
        <div className="space-y-3">
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: younghee@example.com"
            size="large"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <Button
            variant="primary"
            size="extra-large"
            fullWidth
            onClick={handleSearch}
            disabled={isLoading || !keyword.trim()}
          >
            {isLoading ? '검색 중...' : '검색'}
          </Button>
        </div>

        {/* 검색 결과 */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">검색 결과</h2>
            {results.map((guardian) => (
              <Card key={guardian.id} padding="medium" className="space-y-3">
                <div>
                  <div className="text-xl font-bold text-gray-900">{guardian.name}</div>
                  <div className="text-base text-gray-600">{guardian.email}</div>
                  {guardian.phoneNumber && (
                    <div className="text-base text-gray-600">{guardian.phoneNumber}</div>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  onClick={() => handleSelectGuardian(guardian)}
                >
                  선택
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* 검색 결과 없음 */}
        {keyword && results.length === 0 && !isLoading && (
          <Card padding="large" className="text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg text-gray-600">검색 결과가 없습니다</p>
          </Card>
        )}

        {/* 확인 다이얼로그 (Modal) */}
        {/* TODO: Phase 3-7에서 공통 Modal 컴포넌트로 교체 예정 */}
        {showConfirmDialog && selectedGuardian && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card padding="large" className="max-w-md w-full space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">보호자 등록</h2>
              <div className="space-y-2">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">{selectedGuardian.name}</span>님을
                  <br />
                  보호자로 등록할까요?
                </p>
                <div className="text-base text-gray-600 space-y-1">
                  <p>• 이상 징후 발생 시 알림</p>
                  <p>• 대화 내역 공유</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="large"
                  fullWidth
                  onClick={() => setShowConfirmDialog(false)}
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  onClick={handleConfirmRequest}
                  disabled={isLoading}
                >
                  {isLoading ? '요청 중...' : '등록하기'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
```

---

### Task 4: 보호자 요청 목록 페이지 (/guardians/requests)

#### 파일: `src/pages/guardians/GuardianRequestsPage.tsx`

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Card } from '@/shared/components';
import { useGuardian } from '@/features/guardian';
import type { GuardianRequest } from '@/features/guardian';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 보호자 요청 목록 페이지
 * - Journey 4 Phase 4: 보호자 요청 수락/거절
 * - 받은 요청 목록 표시
 * - 수락/거절 버튼
 * - 모든 요청 처리 후 대시보드 자동 이동
 */
export function GuardianRequestsPage() {
  const navigate = useNavigate();
  const { getGuardianRequests, acceptGuardianRequest, rejectGuardianRequest, isLoading } =
    useGuardian();

  const [requests, setRequests] = useState<GuardianRequest[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const data = await getGuardianRequests();
    setRequests(data);
  };

  const handleAccept = async (requestId: number) => {
    try {
      await acceptGuardianRequest(requestId);

      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('보호자 요청을 수락했습니다!');

      await loadRequests(); // 목록 새로고침

      // 더 이상 요청이 없으면 자동으로 대시보드 이동
      // (여러 요청 연속 처리 가능, 모두 처리하면 자동 이동으로 UX 개선)
      const remainingRequests = await getGuardianRequests();
      if (remainingRequests.length === 0) {
        // 모든 요청 처리 완료 → 대시보드로 이동하여 변경된 메인 화면 확인
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 1500); // Toast 확인 시간 제공 (Phase 3-7에서 Toast duration으로 대체)
      }
    } catch (error) {
      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('수락에 실패했습니다');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await rejectGuardianRequest(requestId);

      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('보호자 요청을 거절했습니다');

      await loadRequests(); // 목록 새로고침

      // 거절 시에도 동일한 로직 적용
      const remainingRequests = await getGuardianRequests();
      if (remainingRequests.length === 0) {
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 1500);
      }
    } catch (error) {
      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('거절에 실패했습니다');
    }
  };

  return (
    <Layout title="보호자 요청" showBack={true}>
      <div className="space-y-6 p-4">
        {/* 요청 목록 */}
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} padding="medium" className="space-y-4">
                <div>
                  <div className="text-xl font-bold text-gray-900">{request.seniorName}</div>
                  <div className="text-base text-gray-600">{request.seniorEmail}</div>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-lg text-gray-700">
                    {request.seniorName}님이 회원님을
                    <br />
                    보호자로 등록하길 원합니다
                  </p>
                  <p className="text-base text-gray-600">수락하시겠어요?</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="large"
                    fullWidth
                    onClick={() => handleReject(request.id)}
                    disabled={isLoading}
                  >
                    거절
                  </Button>
                  <Button
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={() => handleAccept(request.id)}
                    disabled={isLoading}
                  >
                    수락
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="large" className="text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              받은 요청이 없습니다
            </h2>
            <p className="text-lg text-gray-600">
              보호자 요청을 받으면
              <br />
              여기에 표시됩니다
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
```

---

### Task 5: 라우팅 및 통합 테스트

#### 파일: `src/shared/constants/routes.ts` (라우트 상수 추가)

```typescript
export const ROUTES = {
  // 공개 라우트
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // 보호된 라우트
  DASHBOARD: '/dashboard',
  CONVERSATION: '/conversation',

  // 보호자 관리 (Phase 3-3에서 추가)
  GUARDIANS: '/guardians',
  GUARDIANS_SEARCH: '/guardians/search',
  GUARDIANS_REQUESTS: '/guardians/requests',

  // 설정
  SETTINGS: '/settings',
} as const;
```

#### 파일: `src/app/router.tsx` (라우트 추가)

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { DashboardPage } from '@/pages/dashboard';
import { GuardiansPage, GuardianSearchPage, GuardianRequestsPage } from '@/pages/guardians';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/features/auth';
import { ROUTES } from '@/shared/constants/routes';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.LOGIN} replace />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      // 🆕 Phase 3-3: 보호자 관리 라우트
      {
        path: ROUTES.GUARDIANS,
        element: (
          <ProtectedRoute>
            <GuardiansPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.GUARDIANS_SEARCH,
        element: (
          <ProtectedRoute>
            <GuardianSearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.GUARDIANS_REQUESTS,
        element: (
          <ProtectedRoute>
            <GuardianRequestsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
```

---

## 테스트 계획

### 기능 테스트

**시나리오 1: 김순자가 김영희를 보호자로 등록 (Journey 3)**

1. 김순자로 로그인
2. 설정 → 보호자 관리 (/guardians)
3. "보호자 찾기" 클릭
4. 검색창에 "younghee@example.com" 입력 → 검색
5. 김영희 선택 → 등록 확인 다이얼로그
6. "등록하기" 클릭 → 요청 성공 메시지
7. /guardians로 돌아옴

**시나리오 2: 김영희가 보호자 요청 수락 (Journey 4)**

1. 김영희로 로그인
2. 보호자 요청 목록 (/guardians/requests) 접근
3. 김순자의 요청 확인
4. "수락" 클릭
5. "보호자 요청을 수락했습니다!" 메시지 확인
6. 1.5초 후 자동으로 대시보드로 이동
7. "내가 돌보는 사람들" 섹션에 김순자 카드 표시 확인

**시나리오 2-2: 여러 요청 연속 처리 (박철수)**

1. 박철수로 로그인
2. 보호자 요청 목록 (/guardians/requests) 접근
3. 아버지 요청 수락 → 목록 새로고침 (페이지 유지)
4. 어머니 요청 수락 → 1.5초 후 대시보드로 자동 이동
5. "내가 돌보는 사람들" 섹션에 2명 표시 확인

**시나리오 3: 검색 결과 없음**

1. /guardians/search 접근
2. 존재하지 않는 이메일 검색 (예: "notfound@example.com")
3. "검색 결과가 없습니다" 메시지 확인

### 상태 업데이트 테스트

**Test 1: 보호자 수락 시 양쪽 사용자 업데이트**

- 김영희가 요청 수락 → `managedMembers`에 김순자 추가
- 김순자의 `guardian` 필드에 김영희 추가 (Mock에서는 클라이언트에서 업데이트)
- 메인 화면 자동 재렌더링 확인

**Test 2: localStorage 동기화**

- 보호자 요청이 localStorage에 저장되는지 확인
- 요청 수락/거절 시 localStorage에서 상태 업데이트되는지 확인

### 라우팅 테스트

- [ ] /guardians 접근 가능 (ProtectedRoute)
- [ ] /guardians/search 접근 가능 (ProtectedRoute)
- [ ] /guardians/requests 접근 가능 (ProtectedRoute)
- [ ] 비로그인 시 /login으로 리다이렉트

### 접근성 테스트

- [ ] 모든 버튼 터치 영역 60px 이상
- [ ] 폰트 크기 노인 친화적 (20px+)
- [ ] 입력 필드 label 연결 (htmlFor)
- [ ] 에러 메시지 명확하게 표시

---

## 완료 체크리스트

### features/guardian 모듈

- [ ] guardian.types.ts 타입 정의
- [ ] mockGuardianApi.ts Mock API 구현
- [ ] useGuardian.ts 훅 구현
- [ ] index.ts export 설정

### 보호자 관리 페이지 (/guardians)

- [ ] GuardiansPage 컴포넌트 생성
- [ ] 현재 보호자 표시 (GuardianCard 사용)
- [ ] 보호자 없을 때 안내 메시지
- [ ] "보호자 찾기" 버튼
- [ ] 노인 친화적 스타일

### 보호자 검색 페이지 (/guardians/search)

- [ ] GuardianSearchPage 컴포넌트 생성
- [ ] 검색 입력 필드
- [ ] 검색 버튼 및 로딩 상태
- [ ] 검색 결과 목록 표시
- [ ] 검색 결과 선택 → 등록 확인 다이얼로그
- [ ] 등록 요청 처리
- [ ] 노인 친화적 스타일

### 보호자 요청 목록 페이지 (/guardians/requests)

- [ ] GuardianRequestsPage 컴포넌트 생성
- [ ] 받은 요청 목록 표시
- [ ] 수락/거절 버튼
- [ ] 요청 없을 때 안내 메시지
- [ ] 로딩 상태 처리
- [ ] 노인 친화적 스타일

### 라우팅

- [ ] ROUTES 상수에 3개 라우트 추가
- [ ] router.tsx에 3개 페이지 추가 (ProtectedRoute)
- [ ] 페이지 간 네비게이션 작동 확인

### Mock 데이터

- [ ] MOCK_USERS 생성 (김순자, 김영희, 박철수)
- [ ] mockSearchGuardians 구현
- [ ] mockCreateGuardianRequest 구현
- [ ] mockGetGuardianRequests 구현
- [ ] mockHandleGuardianRequest 구현
- [ ] localStorage 저장/조회 로직

### 통합 테스트

- [ ] Journey 3 전체 플로우 테스트
- [ ] Journey 4 전체 플로우 테스트
- [ ] 검색 결과 없음 테스트
- [ ] 메인 화면 동적 업데이트 테스트
- [ ] TypeScript 빌드 에러 0건

### 코드 품질

- [ ] ESLint 경고 0건
- [ ] Prettier 포맷팅 적용
- [ ] 불필요한 console.log 제거
- [ ] 주석 작성 (컴포넌트 설명 JSDoc)

### 기술 부채 추적

- [ ] GuardianSearchPage: Modal TODO 주석 추가
- [ ] GuardianSearchPage: Toast TODO 주석 2곳 추가
- [ ] GuardianRequestsPage: Toast TODO 주석 4곳 추가
- [ ] 조건부 네비게이션 로직 구현 (모든 요청 처리 후 자동 이동)

### 접근성

- [ ] 터치 영역 60px 이상
- [ ] 폰트 크기 20px 이상
- [ ] 색상 대비 4.5:1 이상
- [ ] label과 input 연결

---

## 다음 단계

Phase 3-3 완료 후:

1. **Phase 3-4: AI 대화 기능 구현**

   - /conversation 페이지
   - AI 대화 API 연동 (Mock)
   - 대화 이력 조회

2. **Phase 3-5: 설정 관리 구현**

   - /settings 페이지
   - 내 정보 수정
   - 안부 메시지 ON/OFF
   - 보호자 관계 해제

3. **API 연결 준비 (Phase 3-8)**
   - 보호자 검색 API 확인
   - 보호자 등록 요청 API 확인
   - Mock 로직 제거 및 실제 API 호출로 대체

---

## 문서 변경 이력

### v1.1.0 (2025-10-17) - 리뷰 반영 업데이트

**변경 사항**:
1. ✅ **기술 부채 관리 섹션 추가**
   - TODO 주석 가이드라인 명시
   - Phase 3-7 리팩토링 계획 명확화
   - ESLint 룰 제안 추가

2. ✅ **조건부 네비게이션 로직 개선**
   - GuardianRequestsPage: 모든 요청 처리 후 자동 대시보드 이동
   - 여러 요청 연속 처리 지원 (박철수 시나리오)
   - 1.5초 딜레이로 Toast 확인 시간 제공

3. ✅ **테스트 시나리오 보강**
   - 시나리오 2-2 추가: 여러 요청 연속 처리
   - 조건부 네비게이션 테스트 추가

4. ❌ **localStorage Mock DB 제안 거부**
   - 근거: ROI 낮음, 과도한 엔지니어링, 실제 API와 동작 다름
   - 대안: 페르소나별 시나리오 Mock 데이터 사용 (간단한 방식)

**리뷰어 의견 반영률**: 2/3 (66%)
- ✅ 기술 부채 추적 (전적으로 수용)
- ⚠️ 조건부 네비게이션 (수정하여 수용)
- ❌ localStorage Mock DB (근거 기반 거부)

---

**📅 문서 작성일**: 2025-10-17 (v1.0.0)
**📅 최종 업데이트**: 2025-10-17 (v1.1.0)
**✏️ 작성자**: Claude Code
**📍 상태**: Phase 3-3 세부 계획 완료 (리뷰 반영)
**⏱️ 예상 소요 시간**: 10-14시간 (2-3일)
**🎯 목표**: user-flow.md Journey 3-4 완벽 재현
