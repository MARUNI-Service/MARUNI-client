# Phase 3-1: 기반 확립 (Foundation) - 세부 구현 계획

**작성일**: 2025-10-12
**예상 소요 시간**: 6-8시간 (1-2일)
**우선순위**: 🔴 긴급 (모든 Phase의 전제조건)
**구현 원칙**: 최소한의 구현 - 요구사항 충족을 위한 필수 기능만
**API 연결**: ❌ 이 Phase에서는 연결 안 함 - 모든 Phase 완료 후 일괄 연결

---

## 📋 목차

1. [Phase 개요](#phase-개요)
2. [API 연결 전략](#api-연결-전략)
3. [최소 구현 원칙](#최소-구현-원칙)
4. [작업 분해](#작업-분해)
5. [Task별 구현 가이드](#task별-구현-가이드)
6. [테스트 계획](#테스트-계획)
7. [완료 체크리스트](#완료-체크리스트)

---

## Phase 개요

### 목표

역할별 동적 화면 구성을 위한 데이터 구조 확립 및 메인 화면(DashboardPage) 완성

### 핵심 요구사항

user-flow.md의 메인 화면 동적 구성 로직을 구현:

```
dailyCheckEnabled = true  → [내 안부 메시지] 섹션 표시
guardian != null          → [내 보호자] 섹션 표시
managedMembers.length > 0 → [내가 돌보는 사람들] 섹션 표시
모두 없음                 → [시작 가이드] 섹션 표시
```

### 범위

**포함**:

- ✅ User 타입에 3개 필드 추가
- ✅ DashboardPage에 조건부 섹션 렌더링
- ✅ 3개 비즈니스 컴포넌트 (MessageCard, GuardianCard, ManagedMemberCard)

**제외**:

- ❌ API 연결 (Phase 3-1~3-7 완료 후 일괄 연결)
- ❌ 복잡한 상태 관리 (Zustand/Context)
- ❌ 컴포넌트 추상화 (BaseCard, SectionWrapper 등)
- ❌ 애니메이션 효과
- ❌ 로딩/에러 상태 세밀한 처리
- ❌ 메모이제이션 최적화

---

## API 연결 전략

### Phase 3-1 ~ 3-7: Mock 데이터로 페이지 구현

**원칙**:

- **모든 페이지는 Mock 데이터로 먼저 완성**
- API 연결은 Phase 3-1 ~ 3-7 완료 후 **맨 마지막에 일괄 진행**
- Mock 데이터는 useAuthStore에 하드코딩

### Phase 3-1에서 할 일

1. **타입 정의만 작성**

   - User, Guardian, ManagedMember 인터페이스
   - 실제 API 호출 코드는 작성 안 함

2. **Mock 데이터로 페이지 구현**

   - useAuthStore에서 4가지 페르소나 Mock 반환
   - 로그인 시 username에 따라 Mock 사용자 선택
   - DashboardPage는 Mock 데이터 기반으로 작동

3. **API 관련 파일은 건드리지 않음**
   - `authApi.ts` 수정 안 함
   - `GET /api/members/me` 호출 안 함
   - API client 수정 안 함

### Phase 3-8 (API 연결) 계획

Phase 3-1 ~ 3-7 완료 후:

1. **Mock 데이터 제거**

   - useAuthStore의 Mock 로직 삭제

2. **API 호출 추가**

   - `GET /api/members/me` 새 필드 반환하도록 서버 확인
   - authApi.ts에 실제 API 호출 코드 추가

3. **일괄 테스트**
   - 모든 페이지가 실제 API 데이터로 작동하는지 확인

**장점**:

- ✅ 페이지 구현과 API 연결을 분리 (병렬 작업 가능)
- ✅ UI/UX 먼저 완성하고 나중에 데이터 연결
- ✅ 서버 API 준비 안 돼도 프론트 개발 가능

---

## 최소 구현 원칙

### 1. 타입 정의는 현재 필요한 것만

```typescript
// ✅ Good: 필요한 필드만
interface Guardian {
  id: number;
  name: string;
  relationship: string;
}

// ❌ Bad: 미래 확장을 위한 과도한 필드
interface Guardian {
  id: number;
  name: string;
  relationship: string;
  phoneNumber?: string;        // 현재 안 씀
  email?: string;              // 현재 안 씀
  notificationSettings?: {...} // 현재 안 씀
  createdAt?: string;          // 현재 안 씀
}
```

### 2. 조건부 렌더링은 단순하게

```tsx
// ✅ Good: if문으로 직접 조건 체크
{
  user?.dailyCheckEnabled && (
    <section>
      <h2>내 안부 메시지</h2>
      <MessageCard />
    </section>
  );
}

// ❌ Bad: 추상화된 Section 컴포넌트
<ConditionalSection
  condition={user?.dailyCheckEnabled}
  title='내 안부 메시지'
  component={MessageCard}
/>;
```

### 3. 컴포넌트는 Props만 받아서 렌더링

```tsx
// ✅ Good: Props 받아서 표시만
function GuardianCard({ guardian }: { guardian: Guardian }) {
  return (
    <Card>
      <p>
        {guardian.name} ({guardian.relationship})
      </p>
    </Card>
  );
}

// ❌ Bad: 컴포넌트 내부에서 데이터 페칭
function GuardianCard({ guardianId }: { guardianId: number }) {
  const { data } = useGuardian(guardianId); // X
  return <Card>...</Card>;
}
```

### 4. Mock 데이터는 간단하게

```typescript
// ✅ Good: useAuthStore에 Mock 직접 하드코딩
const MOCK_USERS = {
  김순자: { id: 1, name: '김순자', dailyCheckEnabled: true, ... },
  김영희: { id: 2, name: '김영희', managedMembers: [...], ... },
};

login: (credentials) => {
  const mockUser = MOCK_USERS[credentials.username];
  if (mockUser) {
    set({ user: mockUser, isAuthenticated: true });
    return;
  }
}

// ❌ Bad: 별도 Mock 서버 구축
const mockServer = setupMockServiceWorker(); // 불필요
```

---

## 작업 분해

### Task 1: User 타입 확장 (30분)

- User 인터페이스에 3개 필드 추가
- Guardian, ManagedMember 타입 정의
- auth.types.ts 파일 수정만 (API 코드 수정 안 함)

### Task 2: Mock 데이터 설정 (30분)

- useAuthStore에 4가지 페르소나 Mock 추가
- login 함수에서 username 기반 Mock 반환 로직

### Task 3: DashboardPage 동적 섹션 구현 (2시간)

- 4가지 조건에 따른 섹션 표시
- 섹션별 제목 및 기본 구조
- 조건부 렌더링 로직

### Task 4: MessageCard 컴포넌트 (1시간)

- 안부 메시지 표시 카드
- "답장하기" 버튼
- 노인 친화적 스타일 적용

### Task 5: GuardianCard 컴포넌트 (1시간)

- 보호자 정보 표시 카드
- 이름 + 관계 표시
- 간단한 아이콘

### Task 6: ManagedMemberCard 컴포넌트 (1시간)

- 보호 대상 정보 표시 카드
- 이름, 상태, 마지막 대화 시간
- "대화보기" 버튼

### Task 7: 통합 테스트 (1시간)

- 4가지 페르소나 시나리오 테스트
- TypeScript 빌드 확인
- 실제 화면 확인

**총 예상 시간**: 7시간

---

## Task별 구현 가이드

### Task 1: User 타입 확장

#### 파일: `src/features/auth/types/auth.types.ts`

**추가할 타입**:

```typescript
/**
 * 보호자 정보 (최소 필드만)
 */
export interface Guardian {
  id: number;
  name: string;
  relationship: string; // "딸", "아들", "간병인" 등
}

/**
 * 보호 대상 정보 (최소 필드만)
 */
export interface ManagedMember {
  id: number;
  name: string;
  lastCheckTime: string; // ISO 8601 문자열
  emotionStatus: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'WARNING';
}

/**
 * 사용자 정보 (확장)
 */
export interface User extends BaseEntity {
  username: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  email?: string;

  // 🆕 추가 필드
  dailyCheckEnabled: boolean;
  guardian: Guardian | null;
  managedMembers: ManagedMember[];
}
```

**수정 사항**:

- 기존 User 인터페이스에 3개 필드만 추가
- Guardian, ManagedMember 타입 추가
- 다른 파일은 수정 불필요 (하위 호환성 유지)

**작업 시간**: 30분

---

### Task 2: Mock 데이터 설정

#### 파일: `src/features/auth/store/useAuthStore.ts`

**추가할 Mock 데이터**:

```typescript
// 🔴 Phase 3-1 ~ 3-7: Mock 데이터로 페이지 구현
// Phase 3-8에서 API 연결 시 이 코드 전체 제거
const MOCK_USERS = {
  김순자: {
    id: 1,
    username: 'soonja',
    name: '김순자',
    role: 'SENIOR' as const,
    phoneNumber: '010-9999-8888',
    email: 'soonja@example.com',
    dailyCheckEnabled: true,
    guardian: { id: 2, name: '김영희', relationship: '딸' },
    managedMembers: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  김영희: {
    id: 2,
    username: 'younghee',
    name: '김영희',
    role: 'GUARDIAN' as const,
    phoneNumber: '010-1234-5678',
    email: 'younghee@example.com',
    dailyCheckEnabled: false,
    guardian: null,
    managedMembers: [
      {
        id: 1,
        name: '김순자',
        lastCheckTime: '2025-10-12T10:00:00Z',
        emotionStatus: 'POSITIVE' as const,
      },
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  박철수: {
    id: 3,
    username: 'cheolsu',
    name: '박철수',
    role: 'SENIOR' as const,
    phoneNumber: '010-5555-6666',
    email: 'cheolsu@example.com',
    dailyCheckEnabled: true,
    guardian: null,
    managedMembers: [
      {
        id: 4,
        name: '박아버지',
        lastCheckTime: '2025-10-12T08:00:00Z',
        emotionStatus: 'POSITIVE' as const,
      },
      {
        id: 5,
        name: '박어머니',
        lastCheckTime: '2025-10-12T09:00:00Z',
        emotionStatus: 'WARNING' as const,
      },
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  신규사용자: {
    id: 6,
    username: 'newuser',
    name: '신규사용자',
    role: 'SENIOR' as const,
    phoneNumber: '010-7777-8888',
    email: 'newuser@example.com',
    dailyCheckEnabled: false,
    guardian: null,
    managedMembers: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
};
```

**login 함수 수정**:

```typescript
login: async (credentials: LoginRequest) => {
  set({ isLoading: true, error: null });

  try {
    // 🔴 Phase 3-1 ~ 3-7: Mock 데이터 반환
    // Phase 3-8에서 API 연결 시 이 if문 제거
    const mockUser = MOCK_USERS[credentials.username as keyof typeof MOCK_USERS];
    if (mockUser) {
      set({
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return;
    }

    // 🔴 Phase 3-8에서 활성화: 실제 API 호출
    // const response = await authApi.login(credentials);
    // set({ user: response.user, ... });

    // Mock 데이터에 없는 username이면 에러
    throw new Error('Mock 사용자를 찾을 수 없습니다');
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: errorMessage,
    });
    throw error;
  }
};
```

**작업 시간**: 30분

---

### Task 3: DashboardPage 동적 섹션 구현

#### 파일: `src/pages/dashboard/DashboardPage.tsx`

**전체 구조**:

```tsx
import { useAuth } from '@/features/auth';
import { Layout, Card } from '@/shared/components';
import { MessageCard } from '@/shared/components/business/MessageCard';
import { GuardianCard } from '@/shared/components/business/GuardianCard';
import { ManagedMemberCard } from '@/shared/components/business/ManagedMemberCard';

export function DashboardPage() {
  const { user } = useAuth();

  // 모든 섹션이 비어있는지 확인
  const hasNoSections =
    !user?.dailyCheckEnabled &&
    !user?.guardian &&
    (!user?.managedMembers || user.managedMembers.length === 0);

  return (
    <Layout title='마루니 홈' showBack={false}>
      <div className='space-y-6'>
        {/* 환영 메시지 */}
        <div className='text-center py-4'>
          <h1 className='text-3xl font-bold text-gray-900'>안녕하세요, {user?.name}님!</h1>
        </div>

        {/* 섹션 1: 내 안부 메시지 */}
        {user?.dailyCheckEnabled && (
          <section>
            <h2 className='text-2xl font-semibold mb-4'>📬 내 안부 메시지</h2>
            <MessageCard />
          </section>
        )}

        {/* 섹션 2: 내 보호자 */}
        {user?.guardian && (
          <section>
            <h2 className='text-2xl font-semibold mb-4'>👨‍👩‍👧 내 보호자</h2>
            <GuardianCard guardian={user.guardian} />
          </section>
        )}

        {/* 섹션 3: 내가 돌보는 사람들 */}
        {user?.managedMembers && user.managedMembers.length > 0 && (
          <section>
            <h2 className='text-2xl font-semibold mb-4'>👨‍👩‍👧 내가 돌보는 사람들</h2>
            <div className='space-y-4'>
              {user.managedMembers.map(member => (
                <ManagedMemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* 섹션 4: 시작 가이드 (모든 섹션이 없을 때) */}
        {hasNoSections && (
          <section>
            <Card padding='large'>
              <h2 className='text-2xl font-semibold mb-4 text-center'>🎯 MARUNI 시작하기</h2>
              <div className='space-y-4 text-lg text-gray-700'>
                <p>안부 메시지를 받으시겠어요?</p>
                <p>돌보는 분이 계신가요?</p>
                <p className='text-base text-gray-500 text-center mt-6'>
                  설정 메뉴에서 시작할 수 있습니다
                </p>
              </div>
            </Card>
          </section>
        )}
      </div>
    </Layout>
  );
}
```

**핵심 로직**:

1. `useAuth()` 훅으로 user 정보 가져오기
2. 각 필드 존재 여부로 조건부 렌더링
3. 모든 섹션이 없으면 시작 가이드 표시

**작업 시간**: 2시간

---

### Task 4: MessageCard 컴포넌트

#### 파일: `src/shared/components/business/MessageCard/MessageCard.tsx`

```tsx
import { Card, Button } from '@/shared/components';

/**
 * 안부 메시지 카드
 * - 노인이 받은 안부 메시지를 표시
 * - "답장하기" 버튼 제공
 */
export function MessageCard() {
  const handleReply = () => {
    // Phase 3-4에서 AI 대화 화면으로 이동
    console.log('답장하기 클릭');
  };

  return (
    <Card padding='large'>
      <div className='space-y-4'>
        {/* 메시지 내용 */}
        <div className='text-xl text-gray-700'>
          <p className='mb-2'>오늘 기분이 어떠세요? 😊</p>
          <p className='text-base text-gray-500'>오늘 오전 9시</p>
        </div>

        {/* 답장 버튼 */}
        <Button variant='primary' size='extra-large' fullWidth onClick={handleReply}>
          답장하기
        </Button>
      </div>
    </Card>
  );
}
```

#### 파일: `src/shared/components/business/MessageCard/index.ts`

```typescript
export { MessageCard } from './MessageCard';
```

**특징**:

- Props 없음 (현재는 고정 메시지)
- Phase 3-4에서 실제 메시지 데이터 연동
- 노인 친화적 큰 버튼 (extra-large)

**작업 시간**: 1시간

---

### Task 5: GuardianCard 컴포넌트

#### 파일: `src/shared/components/business/GuardianCard/GuardianCard.tsx`

```tsx
import type { Guardian } from '@/features/auth/types';
import { Card } from '@/shared/components';

interface GuardianCardProps {
  guardian: Guardian;
}

/**
 * 보호자 정보 카드
 * - 보호자 이름과 관계 표시
 */
export function GuardianCard({ guardian }: GuardianCardProps) {
  return (
    <Card padding='large'>
      <div className='flex items-center gap-4'>
        {/* 아이콘 */}
        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-3xl'>👤</span>
        </div>

        {/* 정보 */}
        <div>
          <p className='text-2xl font-semibold text-gray-900'>{guardian.name}</p>
          <p className='text-lg text-gray-600'>{guardian.relationship}</p>
        </div>
      </div>
    </Card>
  );
}
```

#### 파일: `src/shared/components/business/GuardianCard/index.ts`

```typescript
export { GuardianCard } from './GuardianCard';
export type { GuardianCardProps } from './GuardianCard';
```

**특징**:

- Guardian 타입을 Props로 받음
- 단순 정보 표시만
- 노인 친화적 큰 폰트 (2xl)

**작업 시간**: 1시간

---

### Task 6: ManagedMemberCard 컴포넌트

#### 파일: `src/shared/components/business/ManagedMemberCard/ManagedMemberCard.tsx`

```tsx
import type { ManagedMember } from '@/features/auth/types';
import { Card, Button } from '@/shared/components';

interface ManagedMemberCardProps {
  member: ManagedMember;
}

/**
 * 보호 대상 정보 카드
 * - 이름, 상태, 마지막 대화 시간 표시
 * - "대화보기" 버튼 제공
 */
export function ManagedMemberCard({ member }: ManagedMemberCardProps) {
  const getEmotionEmoji = (status: ManagedMember['emotionStatus']) => {
    switch (status) {
      case 'POSITIVE':
        return '😊';
      case 'NEGATIVE':
        return '😢';
      case 'WARNING':
        return '⚠️';
      default:
        return '😐';
    }
  };

  const getEmotionText = (status: ManagedMember['emotionStatus']) => {
    switch (status) {
      case 'POSITIVE':
        return '좋음';
      case 'NEGATIVE':
        return '안 좋음';
      case 'WARNING':
        return '주의';
      default:
        return '보통';
    }
  };

  const formatLastCheckTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return '방금 전';
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${Math.floor(diffHours / 24)}일 전`;
  };

  const handleViewConversation = () => {
    // Phase 3-4에서 대화 이력 화면으로 이동
    console.log('대화보기 클릭:', member.id);
  };

  return (
    <Card padding='large'>
      <div className='space-y-4'>
        {/* 정보 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {/* 아이콘 */}
            <div className='w-14 h-14 bg-green-100 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>👵</span>
            </div>

            {/* 이름 */}
            <div>
              <p className='text-xl font-semibold text-gray-900'>{member.name}</p>
              <p className='text-base text-gray-500'>{formatLastCheckTime(member.lastCheckTime)}</p>
            </div>
          </div>

          {/* 상태 */}
          <div className='text-center'>
            <div className='text-3xl mb-1'>{getEmotionEmoji(member.emotionStatus)}</div>
            <p className='text-sm text-gray-600'>{getEmotionText(member.emotionStatus)}</p>
          </div>
        </div>

        {/* 대화보기 버튼 */}
        <Button variant='secondary' size='large' fullWidth onClick={handleViewConversation}>
          대화보기
        </Button>
      </div>
    </Card>
  );
}
```

#### 파일: `src/shared/components/business/ManagedMemberCard/index.ts`

```typescript
export { ManagedMemberCard } from './ManagedMemberCard';
export type { ManagedMemberCardProps } from './ManagedMemberCard';
```

**특징**:

- ManagedMember 타입을 Props로 받음
- 감정 상태를 이모지로 표시
- 마지막 대화 시간을 상대 시간으로 표시
- 보호자 친화적 정보 밀도

**작업 시간**: 1시간

---

### Task 7: 통합 테스트

#### 테스트 시나리오

**시나리오 1: 김순자 (노인 전용)**

- Mock 데이터 설정:
  ```typescript
  dailyCheckEnabled: true
  guardian: { id: 2, name: "김영희", relationship: "딸" }
  managedMembers: []
  ```
- 예상 화면: "내 안부 메시지" + "내 보호자" 섹션 표시

**시나리오 2: 김영희 (보호자 전용)**

- Mock 데이터 설정:
  ```typescript
  dailyCheckEnabled: false;
  guardian: null;
  managedMembers: [
    { id: 1, name: '김순자', lastCheckTime: '2025-10-12T10:00:00Z', emotionStatus: 'POSITIVE' },
  ];
  ```
- 예상 화면: "내가 돌보는 사람들" 섹션만 표시

**시나리오 3: 박철수 (이중 역할)**

- Mock 데이터 설정:
  ```typescript
  dailyCheckEnabled: true
  guardian: null
  managedMembers: [
    { id: 3, name: "박아버지", ... },
    { id: 4, name: "박어머니", ... }
  ]
  ```
- 예상 화면: "내 안부 메시지" + "내가 돌보는 사람들" 섹션 표시

**시나리오 4: 신규 사용자 (모두 없음)**

- Mock 데이터 설정:
  ```typescript
  dailyCheckEnabled: false;
  guardian: null;
  managedMembers: [];
  ```
- 예상 화면: "시작 가이드" 섹션만 표시

#### 테스트 방법

1. **TypeScript 빌드 확인**:

   ```bash
   npm run build
   ```

   → 타입 에러 0건 확인

2. **실제 화면 확인**:

   - `useAuthStore`에서 Mock 데이터 직접 설정
   - 4가지 시나리오별로 화면 확인
   - 섹션 표시/숨김 정확히 동작하는지 확인

3. **노인 친화적 체크**:
   - 터치 영역 60px 이상
   - 폰트 크기 20px 이상 (제목 24px 이상)
   - 색상 대비 충분한지 확인

**작업 시간**: 1시간

---

## 테스트 계획

### 테스트 실행

1. **로그인 화면에서 username 입력**:

   - "김순자" → 시나리오 1
   - "김영희" → 시나리오 2
   - "박철수" → 시나리오 3
   - "신규사용자" → 시나리오 4

2. **대시보드 화면 확인**:

   - 섹션이 예상대로 표시되는지
   - 데이터가 올바르게 표시되는지
   - 버튼 클릭 시 콘솔 로그 출력 확인

3. **반응형 테스트**:
   - 브라우저 크기 조절
   - 모바일 뷰(480px)에서 정상 작동 확인

---

## 완료 체크리스트

### 타입 정의

- [ ] `Guardian` 타입 정의 완료
- [ ] `ManagedMember` 타입 정의 완료
- [ ] `User` 인터페이스에 3개 필드 추가
- [ ] TypeScript 빌드 에러 0건

### DashboardPage

- [ ] useAuth 훅으로 user 정보 가져오기
- [ ] dailyCheckEnabled 조건부 렌더링 작동
- [ ] guardian 조건부 렌더링 작동
- [ ] managedMembers 조건부 렌더링 작동
- [ ] 모든 섹션 없을 때 시작 가이드 표시
- [ ] 환영 메시지에 사용자 이름 표시

### MessageCard

- [ ] Card 컴포넌트 사용
- [ ] 메시지 내용 표시
- [ ] "답장하기" 버튼 작동 (콘솔 로그)
- [ ] 노인 친화적 스타일 (폰트 20px+, 버튼 72px)

### GuardianCard

- [ ] Guardian Props 받아서 표시
- [ ] 이름과 관계 표시
- [ ] 아이콘 표시
- [ ] 노인 친화적 스타일 (폰트 24px+)

### ManagedMemberCard

- [ ] ManagedMember Props 받아서 표시
- [ ] 이름, 상태, 마지막 대화 시간 표시
- [ ] 감정 상태 이모지 표시
- [ ] "대화보기" 버튼 작동 (콘솔 로그)
- [ ] 보호자 친화적 스타일 (정보 밀도)

### 통합 테스트

- [ ] 김순자 시나리오 (2개 섹션) 작동
- [ ] 김영희 시나리오 (1개 섹션) 작동
- [ ] 박철수 시나리오 (2개 섹션, 여러 카드) 작동
- [ ] 신규 사용자 시나리오 (시작 가이드) 작동
- [ ] 모든 시나리오에서 TypeScript 에러 없음

### 코드 품질

- [ ] ESLint 경고 0건
- [ ] Prettier 포맷팅 적용
- [ ] 불필요한 console.log 제거 (의도한 것 제외)
- [ ] 주석 작성 (컴포넌트 설명 JSDoc)

### 접근성

- [ ] 터치 영역 60px 이상 (버튼, 카드)
- [ ] 폰트 크기 20px 이상 (본문), 24px 이상 (제목)
- [ ] 색상 대비 4.5:1 이상
- [ ] aria-label 적절히 설정 (필요한 경우)

---

## 다음 단계

Phase 3-1 완료 후:

1. **Mock 데이터 제거**:

   - 서버 API가 새 필드를 반환하면 Mock 로직 제거
   - 실제 API 응답으로 전환

2. **Phase 3-2 시작**:

   - 회원가입 + 온보딩 플로우 구현
   - 신규 사용자가 dailyCheckEnabled를 설정할 수 있도록

3. **Phase 3-3 준비**:
   - 보호자 관계 성립 후 guardian, managedMembers 실제 데이터로 채워짐

---

**📅 문서 작성일**: 2025-10-12
**✏️ 작성자**: Claude Code
**🎯 원칙**: 최소한의 구현 - 요구사항 충족을 위한 필수 기능만
**📍 다음 작업**: Task 1부터 순차 구현 시작
