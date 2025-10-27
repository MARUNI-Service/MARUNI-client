# MARUNI 리팩토링 계획서

> **작성일**: 2025-10-25
> **대상**: Phase 3-1 ~ 3-7 완료 후 코드 품질 개선
> **목적**: 중복 코드 제거 및 불필요한 복잡성 감소

## 📊 검토 결과 요약

전체 코드베이스 검토 결과, **5개 주요 개선 영역**을 발견했습니다.
본 리팩토링은 **검토자와 완전히 합의한 항목만** 진행합니다.

### ✅ 리팩토링 대상 (합의 항목)

1. **localStorage 중앙화** - 분산된 스토리지 키 관리 통합
2. **상태 관리 패턴 통일** - guardian/conversation을 TanStack Query로 마이그레이션
3. **감정 상태 유틸리티** - 중복 매핑 로직 추출
4. **개발 코드 분리** - 테스트 전용 코드 격리
5. **시간 포맷 함수 통합** - 중복 함수 제거

### ⏸️ 보류 항목 (이견 존재)

- `useAuth` 래퍼 훅 - 제거하지 않고 유지 (향후 강화 예정)
- `useLoginForm` 훅 - 제거하지 않고 유지 (적절한 추상화로 판단)

---

## 🔴 작업 1: localStorage 중앙화

### 문제점
- 5개 이상의 하드코딩된 localStorage 키가 분산됨
- 키: `'auth-storage'`, `'guardian-requests'`, `'conversation-messages-{userId}'`, `'mock-users'` 등
- **위험**: 오타 발생 시 디버깅 어려움, 마이그레이션 복잡

### 영향 범위
| 파일 | 현재 키 사용 |
|------|------------|
| `memberApi.ts` | `'auth-storage'`, `'mock-users'` |
| `mockGuardianApi.ts` | `'guardian-requests'` |
| `mockConversationApi.ts` | `'conversation-messages-{userId}'` |
| `useAuthStore.ts` | `'auth-storage'` (persist) |

### 해결 방법

#### 1.1 스토리지 서비스 생성

**파일**: `src/shared/services/storage.ts` (신규)

**코드**:
```typescript
/**
 * 중앙 집중식 localStorage 관리
 * - 모든 스토리지 키를 한 곳에서 관리
 * - Phase 3-8 API 전환 시 이 파일만 수정
 */

const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  GUARDIAN_REQUESTS: 'guardian-requests',
  CONVERSATION_PREFIX: 'conversation-messages-',
  MOCK_USERS: 'mock-users',
} as const;

export const storage = {
  // Auth 관련
  getAuth: () => localStorage.getItem(STORAGE_KEYS.AUTH),
  setAuth: (data: string) => localStorage.setItem(STORAGE_KEYS.AUTH, data),
  removeAuth: () => localStorage.removeItem(STORAGE_KEYS.AUTH),

  // Guardian 요청
  getGuardianRequests: () => localStorage.getItem(STORAGE_KEYS.GUARDIAN_REQUESTS),
  setGuardianRequests: (data: string) =>
    localStorage.setItem(STORAGE_KEYS.GUARDIAN_REQUESTS, data),

  // 대화 메시지
  getConversationMessages: (userId: number) =>
    localStorage.getItem(`${STORAGE_KEYS.CONVERSATION_PREFIX}${userId}`),
  setConversationMessages: (userId: number, data: string) =>
    localStorage.setItem(`${STORAGE_KEYS.CONVERSATION_PREFIX}${userId}`, data),

  // Mock 사용자
  getMockUsers: () => localStorage.getItem(STORAGE_KEYS.MOCK_USERS),
  setMockUsers: (data: string) => localStorage.setItem(STORAGE_KEYS.MOCK_USERS, data),
};
```

#### 1.2 기존 코드 수정

**수정 파일 목록**:
1. `src/features/member/api/memberApi.ts`
2. `src/features/guardian/api/mockGuardianApi.ts`
3. `src/features/conversation/api/mockConversationApi.ts`

**Before**:
```typescript
const authStorage = localStorage.getItem('auth-storage');
```

**After**:
```typescript
import { storage } from '@/shared/services/storage';

const authStorage = storage.getAuth();
```

### 예상 효과
- ✅ localStorage 직접 접근 0건 (Zustand persist 제외)
- ✅ 오타 위험 제거 (타입 안전성 확보)
- ✅ Phase 3-8 전환 시 1개 파일만 수정

---

## 🔴 작업 2: 상태 관리 패턴 통일

### 문제점
- **일관성 부족**: 동일한 서버 상태를 다른 방식으로 관리
  - ✅ `member`, `notification`: TanStack Query (적절)
  - ❌ `guardian`, `conversation`: useState (부적절)
- **중복 코드**: 로딩/에러 상태 수동 관리
- **기능 부족**: 캐싱, 자동 갱신, 낙관적 업데이트 없음

### 영향 범위
| Feature | 현재 패턴 | 변경 후 |
|---------|----------|---------|
| guardian | useState + 수동 관리 | TanStack Query |
| conversation | useState + 수동 관리 | TanStack Query |

### 해결 방법

#### 2.1 useGuardian 마이그레이션

**파일**: `src/features/guardian/hooks/useGuardian.ts`

**Before** (기존 코드):
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const searchGuardians = async (keyword: string) => {
  setIsLoading(true);
  setError(null);
  try {
    const results = await mockSearchGuardians(keyword);
    return results;
  } catch (err) {
    setError(err.message);
    return [];
  } finally {
    setIsLoading(false);
  }
};
```

**After** (TanStack Query):
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useGuardian() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const toast = useToast();

  // 보호자 검색 (Mutation - 사용자 트리거)
  const {
    mutateAsync: searchGuardians,
    isPending: isSearching
  } = useMutation({
    mutationFn: mockSearchGuardians,
  });

  // 보호자 요청 목록 (Query - 자동 캐싱)
  const {
    data: requests = [],
    isLoading
  } = useQuery({
    queryKey: ['guardian', 'requests', user?.id],
    queryFn: () => mockGetGuardianRequests(user?.id),
    enabled: !!user,
  });

  // 보호자 요청 생성
  const { mutateAsync: requestGuardian } = useMutation({
    mutationFn: mockCreateGuardianRequest,
    onSuccess: () => {
      toast.success('보호자 등록 요청을 보냈습니다!');
    },
  });

  // 보호자 요청 수락
  const { mutateAsync: acceptGuardianRequest } = useMutation({
    mutationFn: (requestId: number) =>
      mockHandleGuardianRequest({ requestId, action: 'ACCEPT' }),
    onSuccess: (request) => {
      // managedMembers 업데이트
      const newMember = {
        id: request.seniorId,
        name: request.seniorName,
        email: request.seniorEmail,
        lastCheckIn: null,
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
  });

  // 보호자 요청 거절
  const { mutateAsync: rejectGuardianRequest } = useMutation({
    mutationFn: (requestId: number) =>
      mockHandleGuardianRequest({ requestId, action: 'REJECT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardian', 'requests'] });
      toast.info('보호자 요청을 거절했습니다');
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
```

**제거되는 코드**:
- `useState<boolean>(false)` - isLoading 제거
- `useState<string | null>(null)` - error 제거
- try-catch-finally 보일러플레이트 제거
- 수동 에러 핸들링 제거

#### 2.2 useConversation 마이그레이션

**파일**: `src/features/conversation/hooks/useConversation.ts`

**Before**:
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isSending, setIsSending] = useState(false);

const loadMessages = async () => {
  setIsLoading(true);
  try {
    const data = await mockGetMessages(user.id);
    setMessages(data);
  } finally {
    setIsLoading(false);
  }
};

const sendMessage = async (content: string) => {
  setIsSending(true);
  try {
    const { userMessage, aiMessage } = await mockSendMessage(user.id, content);
    setMessages(prev => [...prev, userMessage, aiMessage]);
  } finally {
    setIsSending(false);
  }
};
```

**After**:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useConversation() {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  const toast = useToast();

  // 메시지 목록 조회 (자동 캐싱, 자동 갱신)
  const {
    data: messages = [],
    isLoading
  } = useQuery({
    queryKey: ['conversation', 'messages', user?.id],
    queryFn: () => mockGetMessages(user?.id),
    enabled: !!user,
  });

  // 메시지 전송 (낙관적 업데이트)
  const {
    mutateAsync: sendMessage,
    isPending: isSending
  } = useMutation({
    mutationFn: (content: string) => mockSendMessage(user?.id, content),

    // 낙관적 업데이트: UI 즉시 반영
    onMutate: async (content) => {
      await queryClient.cancelQueries({
        queryKey: ['conversation', 'messages', user?.id]
      });

      const previousMessages = queryClient.getQueryData([
        'conversation', 'messages', user?.id
      ]);

      // 임시 사용자 메시지 추가
      queryClient.setQueryData(
        ['conversation', 'messages', user?.id],
        (old: Message[] = []) => [
          ...old,
          {
            id: Date.now(),
            sender: 'USER',
            content,
            createdAt: new Date().toISOString(),
          }
        ]
      );

      return { previousMessages };
    },

    // 성공 시 AI 응답 추가
    onSuccess: ({ userMessage, aiMessage }) => {
      queryClient.setQueryData(
        ['conversation', 'messages', user?.id],
        (old: Message[] = []) => {
          // 임시 메시지 제거 후 실제 메시지 추가
          const withoutTemp = old.filter(m => m.id !== userMessage.id);
          return [...withoutTemp, userMessage, aiMessage];
        }
      );
    },

    // 실패 시 롤백
    onError: (_err, _content, context) => {
      queryClient.setQueryData(
        ['conversation', 'messages', user?.id],
        context?.previousMessages
      );
      toast.error('메시지 전송에 실패했습니다');
    },
  });

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
  };
}
```

**제거되는 코드**:
- `useState<Message[]>([])` 제거
- `useState<boolean>(false)` 2개 제거
- `loadMessages()` 함수 제거 (Query가 자동 로드)
- 수동 상태 업데이트 로직 제거

#### 2.3 페이지 컴포넌트 수정

**수정 파일**:
1. `src/pages/guardians/GuardianSearchPage.tsx`
2. `src/pages/guardians/GuardianRequestsPage.tsx`
3. `src/pages/conversation/ConversationPage.tsx`

**주요 변경점**:
- `loadRequests()`, `loadMessages()` 호출 제거
- Query가 자동으로 데이터 로드 및 갱신
- `isLoading` → Query의 `isPending` 사용

### 예상 효과
- ✅ 코드 라인 수 50% 감소
- ✅ 자동 캐싱으로 성능 향상
- ✅ 낙관적 업데이트로 UX 개선
- ✅ 자동 에러 재시도
- ✅ 백그라운드 자동 갱신

---

## 🟡 작업 3: 감정 상태 유틸리티 추출

### 문제점
- `ManagedMemberCard`에 감정 매핑 함수 인라인 정의 (30줄)
- `mockConversationApi`에도 감정 키워드 중복 정의
- 일관성 부족, 재사용 불가

### 영향 범위
| 파일 | 중복 내용 |
|------|----------|
| `ManagedMemberCard.tsx` | `getEmotionEmoji()`, `getEmotionText()` |
| `mockConversationApi.ts` | `EMOTION_KEYWORDS`, `analyzeEmotion()` |

### 해결 방법

#### 3.1 유틸리티 생성

**파일**: `src/shared/utils/emotion.ts` (신규)

```typescript
/**
 * 감정 상태 관리 유틸리티
 * - 모든 감정 관련 로직 중앙화
 * - 일관된 이모지/텍스트/색상 제공
 */

export type EmotionStatus = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'WARNING';

export const EMOTION_CONFIG = {
  POSITIVE: {
    emoji: '😊',
    text: '좋음',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  NEGATIVE: {
    emoji: '😢',
    text: '안 좋음',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
  WARNING: {
    emoji: '⚠️',
    text: '주의',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  NEUTRAL: {
    emoji: '😐',
    text: '보통',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
} as const;

/**
 * 감정 상태에 따른 설정 반환
 */
export function getEmotionConfig(status: EmotionStatus) {
  return EMOTION_CONFIG[status] || EMOTION_CONFIG.NEUTRAL;
}

/**
 * 감정 분석 키워드
 */
export const EMOTION_KEYWORDS = {
  POSITIVE: ['좋', '행복', '즐거', '기쁘', '건강', '좋아', '재밌', '웃', '감사', '사랑'],
  NEGATIVE: ['슬프', '아프', '힘들', '외롭', '싫', '나빠', '우울', '걱정', '불안', '아파'],
};

/**
 * 텍스트에서 감정 분석 (키워드 기반)
 */
export function analyzeEmotion(content: string): EmotionStatus {
  const lower = content.toLowerCase();

  if (EMOTION_KEYWORDS.POSITIVE.some(keyword => lower.includes(keyword))) {
    return 'POSITIVE';
  }

  if (EMOTION_KEYWORDS.NEGATIVE.some(keyword => lower.includes(keyword))) {
    return 'NEGATIVE';
  }

  return 'NEUTRAL';
}
```

#### 3.2 기존 코드 수정

**1. ManagedMemberCard.tsx**:

**Before** (30줄):
```typescript
const getEmotionEmoji = (status: ManagedMember['emotionStatus']) => {
  switch (status) {
    case 'POSITIVE': return '😊';
    case 'NEGATIVE': return '😢';
    case 'WARNING': return '⚠️';
    default: return '😐';
  }
};

const getEmotionText = (status: ManagedMember['emotionStatus']) => {
  switch (status) {
    case 'POSITIVE': return '좋음';
    case 'NEGATIVE': return '안 좋음';
    case 'WARNING': return '주의';
    default: return '보통';
  }
};

// ... 사용
<div className="text-3xl">{getEmotionEmoji(member.emotionStatus)}</div>
<p className="text-sm">{getEmotionText(member.emotionStatus)}</p>
```

**After** (1줄):
```typescript
import { getEmotionConfig } from '@/shared/utils/emotion';

const { emoji, text, bgColor } = getEmotionConfig(member.emotionStatus);

// ... 사용
<div className={`w-14 h-14 ${bgColor} rounded-full`}>
  <span className="text-2xl">{emoji}</span>
</div>
<p className="text-sm text-gray-600">{text}</p>
```

**2. mockConversationApi.ts**:

**Before**:
```typescript
const EMOTION_KEYWORDS = {
  POSITIVE: ['좋', '행복', ...],
  NEGATIVE: ['슬프', '아프', ...],
};

function analyzeEmotion(content: string): EmotionStatus {
  // 중복 로직
}
```

**After**:
```typescript
import { analyzeEmotion } from '@/shared/utils/emotion';

// EMOTION_KEYWORDS, analyzeEmotion 함수 제거
// import만으로 사용
```

### 예상 효과
- ✅ 감정 관련 로직 1곳 관리
- ✅ 코드 중복 제거 (약 50줄)
- ✅ 일관된 이모지/텍스트/색상
- ✅ 향후 NotificationCard 등에서도 재사용 용이

---

## 🟡 작업 4: 개발 코드 분리

### 문제점
- `mockConversationApi.ts`에 `ENABLE_ERROR_SIMULATION` 플래그 존재
- 프로덕션 빌드 시 수동으로 `false` 변경 필요 → **실수 위험**
- 테스트 전용 로직이 기본 API 파일에 혼재

### 영향 범위
| 파일 | 문제 코드 |
|------|----------|
| `mockConversationApi.ts` | `ENABLE_ERROR_SIMULATION`, `[error]`, `[timeout]` 처리 |

### 해결 방법

#### 4.1 개발 전용 유틸리티 생성

**파일**: `src/__dev__/errorSimulator.ts` (신규)

```typescript
/**
 * 개발 환경 전용 에러 시뮬레이터
 *
 * 사용법:
 * - 메시지에 "[error]" 포함 → 네트워크 에러 발생
 * - 메시지에 "[timeout]" 포함 → 타임아웃 에러 발생
 *
 * 특징:
 * - import.meta.env.DEV 체크로 개발 환경에서만 동작
 * - 프로덕션 빌드 시 트리 쉐이킹으로 자동 제거
 */
export function simulateError(content: string): void {
  // DEV 환경이 아니면 즉시 반환
  if (!import.meta.env.DEV) return;

  const lower = content.toLowerCase();

  // [error] 키워드: 네트워크 에러
  if (lower.includes('[error]')) {
    throw new Error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
  }

  // [timeout] 키워드: 타임아웃 에러
  if (lower.includes('[timeout]')) {
    throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
  }
}
```

#### 4.2 mockConversationApi 수정

**파일**: `src/features/conversation/api/mockConversationApi.ts`

**Before** (25줄):
```typescript
/**
 * 🧪 개발/테스트용 에러 시뮬레이션
 */
const ENABLE_ERROR_SIMULATION = true; // Phase 3-8에서 false로 변경

export async function mockSendMessage(...) {
  // 🧪 에러 시뮬레이션 (개발/테스트용)
  if (ENABLE_ERROR_SIMULATION) {
    const lowerContent = content.toLowerCase();

    // [error] 키워드: 네트워크 에러 발생
    if (lowerContent.includes('[error]')) {
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }

    // [timeout] 키워드: 타임아웃 에러 발생
    if (lowerContent.includes('[timeout]')) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
    }
  }

  // ... 나머지 로직
}
```

**After** (1줄):
```typescript
import { simulateError } from '@/__dev__/errorSimulator';

export async function mockSendMessage(...) {
  simulateError(content); // 자동으로 DEV 환경 체크

  // ... 나머지 로직 (변경 없음)
}
```

### 예상 효과
- ✅ Phase 3-8 전환 시 수동 작업 불필요
- ✅ 프로덕션 번들에 테스트 코드 미포함 (자동 제거)
- ✅ 코드 가독성 향상 (기본 로직과 테스트 로직 분리)
- ✅ import.meta.env.DEV로 자동 제어

---

## 🟢 작업 5: 시간 포맷 함수 통합

### 문제점
- `formatTimeAgo()`, `formatLastCheckTime()` 중복
- 거의 동일한 로직 (분/시간/일 계산)
- 유지보수 포인트 2배

### 영향 범위
| 함수 | 사용 위치 |
|------|----------|
| `formatTimeAgo` | ChatMessage, NotificationCard |
| `formatLastCheckTime` | ManagedMemberCard, GuardianCard |

### 해결 방법

#### 5.1 함수 통합

**파일**: `src/shared/utils/date.ts`

**Before** (2개 함수):
```typescript
export function formatTimeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '방금';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export function formatLastCheckTime(isoDate?: string, fallback = '대화 없음'): string {
  if (!isoDate) return fallback;

  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return '방금 전';
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${Math.floor(diffHours / 24)}일 전`;
}
```

**After** (1개 함수):
```typescript
/**
 * ISO 8601 날짜를 상대 시간으로 변환
 * @param isoDate - ISO 8601 형식의 날짜 문자열
 * @param options - 옵션
 * @param options.fallback - 날짜가 없을 때 표시할 문자열 (기본: '시간 없음')
 * @param options.showMinutes - 분 단위까지 표시 (기본: false)
 * @returns 상대 시간 문자열 (예: "30분 전", "2시간 전", "3일 전")
 */
export function formatTimeAgo(
  isoDate?: string,
  options?: {
    fallback?: string;
    showMinutes?: boolean;
  }
): string {
  if (!isoDate) return options?.fallback || '시간 없음';

  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // 분 단위 표시 (옵션)
  if (options?.showMinutes) {
    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분 전`;
  }

  // 시간/일 단위 (기본)
  if (diffHours < 1) return '방금 전';
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  // 7일 이상은 날짜 표시
  return date.toLocaleDateString('ko-KR');
}
```

#### 5.2 기존 호출 수정

**수정 파일**:
1. `ChatMessage.tsx`
2. `NotificationCard.tsx`
3. `ManagedMemberCard.tsx`
4. `GuardianCard.tsx`

**Before**:
```typescript
// 상세 표시
formatTimeAgo(message.createdAt);

// 간소화
formatLastCheckTime(member.lastCheckTime, '대화 없음');
```

**After**:
```typescript
// 상세 표시 (분 단위 포함)
formatTimeAgo(message.createdAt, { showMinutes: true });

// 간소화 (시간/일만)
formatTimeAgo(member.lastCheckTime, { fallback: '대화 없음' });
```

### 예상 효과
- ✅ 중복 제거 (1개 함수로 통합)
- ✅ 일관된 포맷팅
- ✅ 유지보수 포인트 50% 감소

---

## 📊 작업 요약

| 작업 | 우선순위 | 파일 수정 | 신규 파일 | 예상 시간 |
|------|---------|----------|----------|----------|
| 1. localStorage 중앙화 | 🔴 긴급 | 5개 | 1개 | 1시간 |
| 2. 상태 관리 통일 | 🔴 긴급 | 5개 | 0개 | 2시간 |
| 3. 감정 유틸리티 | 🟡 중요 | 2개 | 1개 | 30분 |
| 4. 개발 코드 분리 | 🟡 중요 | 1개 | 1개 | 20분 |
| 5. 시간 포맷 통합 | 🟢 개선 | 5개 | 0개 | 20분 |
| **합계** | | **18개** | **3개** | **~4시간** |

---

## 🚀 실행 순서

### Phase 1: 긴급 작업 (3시간)
1. **localStorage 중앙화** (1시간)
   - `storage.ts` 생성
   - 5개 파일 수정
   - 테스트: 로그인, 대화, 보호자 기능

2. **상태 관리 통일** (2시간)
   - `useGuardian.ts` 리팩토링
   - `useConversation.ts` 리팩토링
   - 3개 페이지 수정
   - 테스트: 보호자 검색/요청, AI 대화

### Phase 2: 중요 작업 (50분)
3. **감정 유틸리티** (30분)
   - `emotion.ts` 생성
   - 2개 파일 수정
   - 테스트: 감정 표시

4. **개발 코드 분리** (20분)
   - `errorSimulator.ts` 생성
   - `mockConversationApi.ts` 수정
   - 테스트: `[error]`, `[timeout]` 키워드

### Phase 3: 개선 작업 (20분)
5. **시간 포맷 통합** (20분)
   - `date.ts` 수정
   - 5개 파일 수정
   - 테스트: 시간 표시

---

## ✅ 완료 기준

### 코드 품질
- [ ] `src/shared/services/storage.ts` 생성 완료
- [ ] 모든 localStorage 직접 접근이 storage 서비스로 교체됨
- [ ] `useGuardian`, `useConversation`이 TanStack Query 사용
- [ ] useState 기반 로딩/에러 상태 제거됨
- [ ] `src/shared/utils/emotion.ts` 생성 완료
- [ ] 감정 매핑 로직이 1곳으로 통합됨
- [ ] `src/__dev__/errorSimulator.ts` 생성 완료
- [ ] ENABLE_ERROR_SIMULATION 플래그 제거됨
- [ ] 시간 포맷 함수가 1개로 통합됨

### 기능 검증
- [ ] TypeScript 빌드 에러 0건 (`npm run build`)
- [ ] 로그인/회원가입 정상 작동
- [ ] AI 대화 기능 정상 작동
- [ ] 보호자 검색/요청/수락 정상 작동
- [ ] 감정 상태 표시 정상 작동
- [ ] 시간 표시 정상 작동
- [ ] 에러 시뮬레이션 (`[error]`) 정상 작동

### 성능 검증
- [ ] TanStack Query 캐싱 동작 확인
- [ ] 낙관적 업데이트 동작 확인
- [ ] 페이지 전환 시 깜빡임 없음

---

## 🔄 롤백 계획

각 작업마다 Git 커밋을 별도로 생성하여, 문제 발생 시 해당 작업만 롤백 가능하도록 함:

```bash
# 작업 1 완료 후
git add .
git commit -m "refactor: localStorage 중앙화"

# 작업 2 완료 후
git add .
git commit -m "refactor: guardian/conversation TanStack Query 마이그레이션"

# ... 이하 동일
```

---

## 📝 참고 문서

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [MARUNI 기술 아키텍처](./architecture/TECHNICAL_ARCHITECTURE.md)
- [MARUNI 코딩 컨벤션](./development/CODING_CONVENTIONS.md)

---

**작성자**: Claude Code
**검토자**: 프로젝트 리드
**승인일**: 2025-10-25
**다음 단계**: Phase 3-8 (Mock → Real API 전환)
