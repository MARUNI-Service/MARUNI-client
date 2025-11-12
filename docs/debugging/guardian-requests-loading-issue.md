# 보호자 요청 페이지 로딩 지연 문제 분석 보고서

**작성일**: 2025-11-12
**버전**: Phase 3-8 (API 연동 완료)
**심각도**: Medium (사용자 경험 저하)

---

## 1. 문제 요약

### 현상
- 알림에서 보호자 요청을 클릭하여 `/guardians/requests` 페이지로 이동
- 페이지가 로드되지만 보호자 요청 목록이 표시되지 않음
- 2-3번 페이지 새로고침(F5)을 해야 보호자 요청 목록이 표시됨

### 영향도
- 사용자: 혼란스러운 UX, 추가 액션(새로고침) 필요
- 비즈니스: 보호자 요청 수락률 감소 가능성
- 빈도: 알림을 통한 페이지 진입 시 100% 재현

---

## 2. 재현 시나리오

```
1. [사용자 A] 보호자 요청 발송
   → POST /api/guardians/requests

2. [사용자 B] 로그인
   → 알림 목록에서 "보호자 요청" 알림 확인

3. [사용자 B] 알림 클릭
   → navigate(ROUTES.GUARDIANS_REQUESTS) 실행
   → /guardians/requests 페이지 이동

4. [문제 발생] 페이지는 렌더링되나 요청 목록 없음
   → "받은 요청이 없습니다" EmptyState 표시

5. [사용자 B] F5 새로고침 2-3회
   → 요청 목록이 정상 표시됨
```

---

## 3. 기술적 원인 분석

### 3.1 근본 원인: TanStack Query의 조건부 실행

**파일**: `src/features/guardian/hooks/useGuardian.ts:28-35`

```typescript
const { data: requests = [], isLoading } = useQuery({
  queryKey: ['guardian', 'requests'],
  queryFn: async () => {
    const allRequests = await getGuardianRequests();
    return allRequests.filter((req) => req.status === 'PENDING');
  },
  enabled: !!user,  // ⚠️ 문제의 핵심
});
```

#### 문제점
1. **enabled 조건의 불안정성**
   - `enabled: !!user`는 user가 존재할 때만 쿼리 실행
   - React Router 페이지 전환 시점에 user 상태가 일시적으로 불안정
   - 컴포넌트 마운트 순간 user가 undefined/null일 수 있음

2. **Zustand Persist의 비동기 복원**
   - useAuthStore는 zustand persist 사용
   - localStorage에서 상태 복원이 비동기로 발생
   - 페이지 전환 → 컴포넌트 마운트 → persist 복원 순서 불일치

3. **TanStack Query의 캐싱 메커니즘**
   - enabled가 false일 때 쿼리 실행 안 됨 → 캐시에 빈 배열 저장
   - 이후 enabled가 true로 변경되어도 캐시된 빈 배열 사용
   - staleTime/cacheTime 기본값으로 인해 오래된 데이터 유지

### 3.2 실행 흐름 분석

```
[정상 케이스: 직접 URL 입력 또는 새로고침]
1. 페이지 로드
2. localStorage에서 auth-storage 복원 (즉시)
3. useAuthStore → user 존재
4. useQuery enabled: true → API 호출
5. ✅ 요청 목록 표시

[문제 케이스: React Router navigate]
1. 알림 페이지에서 navigate() 호출
2. GuardianRequestsPage 컴포넌트 마운트
3. useGuardian 훅 실행
4. user 상태 확인 → undefined (persist 복원 전)
5. useQuery enabled: false → API 호출 안 됨
6. ❌ 빈 배열 표시 ("받은 요청이 없습니다")
7. (나중에) persist 복원 완료 → user 존재
8. 하지만 useQuery는 이미 캐시된 빈 배열 사용
9. 새로고침 → enabled: true → API 재호출 → ✅ 정상 표시
```

### 3.3 왜 새로고침을 2-3번 해야 하는가?

1. **첫 번째 새로고침**
   - 캐시가 여전히 유효할 수 있음 (staleTime 내)
   - `refetchOnMount: true`가 아니면 캐시된 데이터 사용

2. **두 번째 새로고침**
   - 캐시가 만료(stale)되었을 가능성
   - 하지만 네트워크 요청이 느리거나 타이밍 이슈

3. **세 번째 새로고침**
   - 완전히 새로운 마운트 + enabled: true
   - 캐시 무효화 + API 재호출 → 정상 표시

---

## 4. 코드 레벨 분석

### 4.1 관련 파일

#### `src/features/guardian/hooks/useGuardian.ts`
```typescript
// 문제가 되는 부분
export function useGuardian() {
  const { user, setUser } = useAuthStore();  // Zustand persist store
  const queryClient = useQueryClient();
  const toast = useToast();

  // 보호자 요청 목록 조회
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['guardian', 'requests'],
    queryFn: async () => {
      const allRequests = await getGuardianRequests();
      return allRequests.filter((req) => req.status === 'PENDING');
    },
    enabled: !!user,  // ⚠️ 타이밍 이슈의 원인
  });

  return {
    requests,
    isLoading,
    // ...
  };
}
```

#### `src/features/auth/store/useAuthStore.ts`
```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      // ...
    }),
    {
      name: 'auth-storage',  // localStorage 키
      // persist가 모든 상태를 자동으로 저장/복원
    }
  )
);
```

#### `src/pages/guardians/GuardianRequestsPage.tsx`
```typescript
export function GuardianRequestsPage() {
  const navigate = useNavigate();
  const { requests, acceptGuardianRequest, rejectGuardianRequest, isLoading } = useGuardian();

  // requests가 빈 배열이면 EmptyState 표시
  return (
    <Layout title="보호자 요청" showBack={true} onBack={() => navigate(-1)}>
      <div className="space-y-6 p-4">
        {requests.length > 0 ? (
          // 요청 목록
        ) : (
          <Card padding="large" className="text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">받은 요청이 없습니다</h2>
          </Card>
        )}
      </div>
    </Layout>
  );
}
```

#### `src/pages/notifications/NotificationDetailPage.tsx`
```typescript
// 알림 클릭 시 페이지 이동
{notification.type === 'GUARDIAN_REQUEST' && (
  <Card padding="medium">
    <Button
      variant="primary"
      size="large"
      fullWidth
      onClick={() => navigate(ROUTES.GUARDIANS_REQUESTS)}  // 문제 발생 지점
    >
      보호자 요청 확인하기
    </Button>
  </Card>
)}
```

### 4.2 인증 흐름

```typescript
// API 클라이언트에서 자동으로 토큰 추가
// src/shared/api/client.ts
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**중요**: API 요청은 이미 토큰을 자동으로 포함하므로, `enabled: !!user` 조건은 불필요합니다.

---

## 5. 해결 방안

### 방안 1: enabled 조건 제거 (권장 ⭐)

**장점**:
- 가장 간단하고 근본적인 해결
- API 인증은 이미 인터셉터에서 처리됨
- user 상태와 무관하게 쿼리 실행

**단점**:
- 로그아웃 상태에서도 쿼리가 실행될 수 있음 (하지만 401 에러로 처리됨)

**구현**:
```typescript
const { data: requests = [], isLoading } = useQuery({
  queryKey: ['guardian', 'requests'],
  queryFn: async () => {
    const allRequests = await getGuardianRequests();
    return allRequests.filter((req) => req.status === 'PENDING');
  },
  // enabled 제거
});
```

### 방안 2: refetchOnMount 추가

**장점**:
- enabled 조건 유지 (명시적인 인증 체크)
- 마운트 시 항상 최신 데이터 fetch

**단점**:
- 여전히 첫 마운트 시 user가 없으면 실행 안 됨
- 불필요한 리페치 발생 가능

**구현**:
```typescript
const { data: requests = [], isLoading } = useQuery({
  queryKey: ['guardian', 'requests'],
  queryFn: async () => {
    const allRequests = await getGuardianRequests();
    return allRequests.filter((req) => req.status === 'PENDING');
  },
  enabled: !!user,
  refetchOnMount: 'always',  // 추가
});
```

### 방안 3: ProtectedRoute에서 user 보장

**장점**:
- 라우트 레벨에서 인증 보장
- enabled 조건이 의미 있음

**단점**:
- persist 복원 타이밍 이슈는 여전히 존재 가능
- 추가 코드 복잡도

**구현**:
```typescript
// src/shared/components/ProtectedRoute.tsx
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  // user가 없으면 리다이렉트 전 대기
  if (!user && isAuthenticated) {
    return <LoadingSpinner />;
  }

  // ...
}
```

---

## 6. 권장 해결 방법

**방안 1 (enabled 조건 제거)**를 권장합니다.

### 이유
1. API 인증은 이미 axios interceptor에서 처리됨
2. ProtectedRoute가 이미 인증되지 않은 접근을 막음
3. user 상태는 UI 표시용으로만 사용되어야 함
4. TanStack Query의 캐싱 이점을 최대한 활용

### 추가 권장 사항
- `staleTime` 설정으로 불필요한 리페치 방지
- 에러 바운더리 추가로 401 에러 처리

```typescript
const { data: requests = [], isLoading } = useQuery({
  queryKey: ['guardian', 'requests'],
  queryFn: async () => {
    const allRequests = await getGuardianRequests();
    return allRequests.filter((req) => req.status === 'PENDING');
  },
  staleTime: 30000, // 30초 동안 fresh 상태 유지
});
```

---

## 7. 테스트 계획

### 수정 후 테스트 시나리오

1. **알림에서 진입**
   - [ ] 알림 클릭 → 보호자 요청 페이지 즉시 로드
   - [ ] 요청 목록 정상 표시 (새로고침 없이)

2. **직접 URL 진입**
   - [ ] `/guardians/requests` 직접 접근 → 정상 로드

3. **네트워크 상태**
   - [ ] 느린 네트워크에서도 로딩 스피너 표시
   - [ ] 실패 시 에러 메시지 표시

4. **캐싱 동작**
   - [ ] 30초 내 재진입 시 캐시된 데이터 사용
   - [ ] 30초 후 재진입 시 자동 리페치

---

## 8. 결론

이 문제는 **TanStack Query의 조건부 실행과 Zustand persist의 비동기 복원 타이밍 불일치**로 인해 발생합니다. `enabled: !!user` 조건을 제거하면 근본적으로 해결할 수 있으며, 이는 이미 구현된 인증 메커니즘(axios interceptor, ProtectedRoute)과 충돌하지 않습니다.

### 다음 단계
1. `src/features/guardian/hooks/useGuardian.ts` 수정
2. 빌드 및 린트 검증
3. 실제 시나리오 테스트
4. 필요 시 다른 useQuery 호출부도 검토
