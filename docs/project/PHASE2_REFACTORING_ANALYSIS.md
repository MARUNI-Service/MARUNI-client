# Phase 2 리팩토링 분석 보고서

> **작성일**: 2025-10-04
> **검토 범위**: Phase 2에서 구현된 인증 시스템 및 서버 연동 코드
> **목적**: 체계적 구조 개선, 오버엔지니어링 제거, 유지보수성 향상

---

## 📋 목차

1. [전반적 평가](#전반적-평가)
2. [주요 리팩토링 대상](#주요-리팩토링-대상)
3. [상세 분석](#상세-분석)
4. [우선순위별 액션 아이템](#우선순위별-액션-아이템)
5. [리팩토링 후 기대효과](#리팩토링-후-기대효과)

---

## 전반적 평가

### ✅ 잘 구현된 부분

- **TypeScript 타입 안전성**: 모든 타입이 명확하게 정의됨
- **기능적 완성도**: 로그인 → 대시보드 플로우가 완벽히 작동
- **컴포넌트 재사용**: Phase 1 컴포넌트를 효과적으로 활용
- **라우팅 구조**: React Router v7 설정이 명확하고 간결함
- **에러 핸들링 기본**: 사용자에게 에러 메시지 전달

### ⚠️ 개선이 필요한 부분

1. **Auth Store의 이중 저장 구조** (오버엔지니어링)
2. **API 인터셉터의 책임 과다**
3. **401 에러 처리 중복**
4. **토큰 갱신 자동화 부재**
5. **초기화 로직의 불필요한 복잡성**

---

## 주요 리팩토링 대상

### 🔴 Critical (즉시 수정 권장)

#### 1. Auth Store - 이중 저장 구조 제거

**현재 문제:**
```typescript
// useAuthStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ❌ 문제 1: persist를 사용하면서도 수동으로 localStorage 관리
      login: async (credentials) => {
        const response = await authApi.login(credentials);

        // ❌ 문제 2: 토큰을 두 곳에 저장 (state + localStorage)
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
      },

      // ❌ 문제 3: initialize가 persist 복원 후 다시 localStorage를 읽음
      initialize: () => {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        // persist가 이미 복원했는데 또 읽음...
      },
    }),
    {
      // ❌ 문제 4: partialize에서 isAuthenticated만 저장
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),

      // ❌ 문제 5: 복원 후 다시 초기화 실행
      onRehydrateStorage: () => (state) => {
        state?.initialize();
      },
    }
  )
);
```

**오버엔지니어링 판정:**
- ✅ **오버엔지니어링 확정**
- persist 미들웨어의 목적을 제대로 활용하지 못함
- 상태를 두 곳에서 관리 → 동기화 버그 가능성
- 불필요한 initialize 메서드

**제안:**
```typescript
// 개선안: persist를 제대로 활용
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);

          // ✅ 상태만 업데이트 (persist가 자동으로 localStorage에 저장)
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: getApiErrorMessage(error),
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        // ✅ 상태만 초기화 (persist가 자동으로 localStorage에서 제거)
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        authApi.logout().catch(console.error);
      },
    }),
    {
      name: 'auth-storage',
      // ✅ 필요한 모든 상태 저장
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

**개선 효과:**
- 코드 라인 수 40% 감소
- initialize 메서드 제거
- 별도 localStorage 관리 제거
- 동기화 버그 가능성 제거
- isInitialized 플래그 불필요 (persist가 자동 처리)

---

#### 2. API Client - 책임 분리 및 401 처리 개선

**현재 문제:**
```typescript
// client.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ❌ 문제 1: 인터셉터에서 직접 localStorage 조작
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

      // ❌ 문제 2: window.location.href로 리다이렉트 (React Router 외부)
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    // ❌ 문제 3: 토큰 갱신 자동 재시도 없음
    // store에 refreshAccessToken이 있지만 여기서 사용 안 함

    return Promise.reject(error);
  }
);
```

**오버엔지니어링 판정:**
- ⚠️ **부분적 오버엔지니어링**
- 인터셉터가 너무 많은 책임 (로깅, 스토리지 조작, 리다이렉트)
- 401 처리가 인터셉터와 store에 중복

**순환 의존성 우려:**
- `client.ts` → `useAuthStore` (logout 호출) → `authApi` → `client.ts`
- 현재는 문제 없지만, 향후 복잡해질 가능성

**제안:**
```typescript
// client.ts - 인터셉터 간소화
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ✅ 401 에러 - 토큰 갱신 자동 재시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;

          // 새 토큰 저장 및 재요청
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 갱신 실패 시 커스텀 이벤트 발생 (store가 처리)
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

```typescript
// useAuthStore.ts - 로그아웃 이벤트 리스너
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... 기존 코드

      // ✅ 앱 시작 시 이벤트 리스너 등록
      _initEventListeners: () => {
        window.addEventListener('auth:logout', () => {
          get().logout();
        });
      },
    }),
    { name: 'auth-storage' }
  )
);
```

**개선 효과:**
- 토큰 갱신 자동화 (사용자 경험 향상)
- 인터셉터의 책임 최소화
- 401 처리 일원화
- 순환 의존성 제거

---

### 🟡 Medium (Phase 3 전에 수정 권장)

#### 3. ProtectedRoute - isInitialized 플래그 제거

**현재 구조:**
```typescript
// ProtectedRoute.tsx
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized } = useAuth();

  // ❌ persist 복원 대기를 위한 로딩 표시
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
```

**문제점:**
- Auth Store 리팩토링 후 isInitialized 불필요
- persist는 동기적으로 복원됨 (추가 플래그 불필요)

**제안:**
```typescript
// 개선안: isInitialized 제거
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
```

---

#### 4. Login Form Hook - 책임 범위 명확화

**현재 구조:**
```typescript
// useLoginForm.ts
export function useLoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // ...유효성 검사

    try {
      await login(formData);

      // ⚠️ 논쟁의 여지: navigate가 훅에 있는 게 맞나?
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect') || ROUTES.DASHBOARD;
      navigate(redirectPath);
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return { formData, handleChange, handleSubmit };
}
```

**오버엔지니어링 판정:**
- ⚠️ **논쟁의 여지 있음**
- navigate를 훅에서 할지, 페이지에서 할지는 설계 철학 차이
- 현재 구조도 나쁘지 않음

**선택지 1: 현재 유지 (간결함 우선)**
```typescript
// 현재 방식 - 훅이 모든 것을 처리
const { handleSubmit } = useLoginForm();
<Button onClick={handleSubmit}>로그인</Button>
```

**선택지 2: 페이지로 이동 (명확성 우선)**
```typescript
// 개선안 - 훅은 로그인만, 페이지가 navigate
export function useLoginForm() {
  const handleSubmit = async () => {
    await login(formData);
    // navigate 제거 - 성공 여부만 반환
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSuccess: !error && !isLoading // 성공 상태 추가
  };
}

// LoginPage.tsx
function LoginPage() {
  const navigate = useNavigate();
  const { handleSubmit, isSuccess } = useLoginForm();

  useEffect(() => {
    if (isSuccess) {
      const redirect = new URLSearchParams(location.search).get('redirect');
      navigate(redirect || ROUTES.DASHBOARD);
    }
  }, [isSuccess]);
}
```

**권장사항:**
- **Phase 3 진행 후 결정**
- 현재 구조로도 충분히 작동하며, 큰 문제 없음
- 다른 폼 훅들과 일관성을 맞출 때 재검토

---

#### 5. 유효성 검사 - 규칙 추출

**현재 구조:**
```typescript
// useLoginForm.ts
const validateForm = (): boolean => {
  const errors: { username?: string; password?: string } = {};

  // ❌ 하드코딩된 유효성 검사 규칙
  if (!formData.username.trim()) {
    errors.username = '사용자 이름을 입력해주세요';
  }

  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요';
  } else if (formData.password.length < 4) {
    errors.password = '비밀번호는 4자 이상이어야 합니다';
  }

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

**제안:**
```typescript
// shared/constants/validation.ts
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 20,
  },
  USERNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
  },
} as const;

export const VALIDATION_MESSAGES = {
  USERNAME: {
    REQUIRED: '사용자 이름을 입력해주세요',
    TOO_SHORT: `사용자 이름은 ${VALIDATION_RULES.USERNAME.MIN_LENGTH}자 이상이어야 합니다`,
  },
  PASSWORD: {
    REQUIRED: '비밀번호를 입력해주세요',
    TOO_SHORT: `비밀번호는 ${VALIDATION_RULES.PASSWORD.MIN_LENGTH}자 이상이어야 합니다`,
  },
} as const;

// useLoginForm.ts
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '@/shared/constants/validation';

const validateForm = (): boolean => {
  const errors: { username?: string; password?: string } = {};

  if (!formData.username.trim()) {
    errors.username = VALIDATION_MESSAGES.USERNAME.REQUIRED;
  }

  if (!formData.password) {
    errors.password = VALIDATION_MESSAGES.PASSWORD.REQUIRED;
  } else if (formData.password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    errors.password = VALIDATION_MESSAGES.PASSWORD.TOO_SHORT;
  }

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

---

### 🟢 Low (선택적 개선)

#### 6. API Error Handling - 일관성 개선

**현재 구조:**
```typescript
// client.ts
if (error.response?.status === 403) {
  console.error('접근 권한이 없습니다:', error.response.data);
}

if (error.response?.status === 500) {
  console.error('서버 오류가 발생했습니다:', error.response.data);
}
```

**제안:**
```typescript
// shared/utils/errorHandler.ts
export function handleApiError(error: AxiosError<ApiError>) {
  const status = error.response?.status;

  switch (status) {
    case 403:
      // 권한 없음 처리 (Toast 알림 등)
      break;
    case 500:
      // 서버 에러 처리
      break;
    default:
      // 기본 에러 처리
  }
}
```

---

#### 7. Error Boundary - 에러 로깅 개선

**현재 구조:**
```typescript
// AppProviders.tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Global error caught:', error, errorInfo);
    // 향후: 에러 트래킹 서비스에 전송 (Sentry 등)
  }}
>
```

**제안:**
```typescript
// shared/utils/errorTracking.ts
export function logError(error: Error, errorInfo?: React.ErrorInfo) {
  // 개발 모드: 콘솔 출력
  if (import.meta.env.DEV) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  // 프로덕션: 에러 트래킹 서비스
  // if (import.meta.env.PROD) {
  //   Sentry.captureException(error, { extra: errorInfo });
  // }
}

// AppProviders.tsx
<ErrorBoundary onError={logError}>
```

---

## 우선순위별 액션 아이템

### 🔴 Critical - Phase 3 시작 전 필수

| 순위 | 항목 | 예상 시간 | 위험도 |
|------|------|-----------|--------|
| 1 | Auth Store 이중 저장 제거 | 2-3시간 | 중 |
| 2 | API 인터셉터 토큰 갱신 자동화 | 2-3시간 | 중 |
| 3 | ProtectedRoute isInitialized 제거 | 30분 | 하 |

**총 예상 시간: 5-7시간**

### 🟡 Medium - Phase 3 진행 중 병행

| 순위 | 항목 | 예상 시간 | 위험도 |
|------|------|-----------|--------|
| 4 | 유효성 검사 규칙 상수화 | 1시간 | 하 |
| 5 | Login Form Hook 책임 재검토 | 1-2시간 | 하 |

**총 예상 시간: 2-3시간**

### 🟢 Low - Phase 4 이후 또는 필요시

| 순위 | 항목 | 예상 시간 | 위험도 |
|------|------|-----------|--------|
| 6 | API Error Handler 통합 | 1시간 | 하 |
| 7 | Error Boundary 로깅 개선 | 30분 | 하 |

**총 예상 시간: 1.5시간**

---

## 리팩토링 후 기대효과

### 코드 품질

- **코드 라인 수**: 약 20% 감소 (중복 제거)
- **복잡도**: 이중 저장 로직 제거로 Cyclomatic Complexity 감소
- **가독성**: 책임 분리로 코드 의도 명확화

### 개발 생산성

- **디버깅 시간**: 단일 저장소 → 버그 추적 용이
- **신규 기능 추가**: Auth 로직이 단순해져 확장 쉬움
- **테스트 작성**: 의존성 감소로 단위 테스트 용이

### 사용자 경험

- **토큰 갱신 자동화**: 세션 만료로 인한 로그아웃 감소
- **에러 처리 개선**: 일관된 에러 메시지
- **성능**: 불필요한 localStorage 읽기/쓰기 제거

### 유지보수성

- **버그 감소**: 동기화 이슈 원천 차단
- **코드 이해도**: 새 개발자 온보딩 시간 단축
- **확장성**: Phase 3 기능 추가 시 충돌 최소화

---

## 리팩토링 전략

### 1단계: Critical 항목 (Phase 3 시작 전)

```bash
# 1. 새 브랜치 생성
git checkout -b refactor/phase2-critical

# 2. Auth Store 리팩토링
- useAuthStore.ts 수정
- 테스트 (수동): 로그인/로그아웃/새로고침

# 3. API Client 토큰 갱신 추가
- client.ts 수정
- 테스트: 401 에러 시나리오

# 4. ProtectedRoute 단순화
- ProtectedRoute.tsx 수정
- auth.types.ts에서 isInitialized 제거

# 5. 통합 테스트
npm run build
npm run lint
# 로그인 → 대시보드 → 새로고침 → 토큰 만료 시나리오 테스트

# 6. PR 생성 및 병합
git commit -m "refactor: Phase 2 critical improvements"
git push origin refactor/phase2-critical
```

### 2단계: Medium 항목 (Phase 3 병행)

```bash
# Phase 3 개발 중 필요시 적용
git checkout -b refactor/phase2-medium

# 유효성 검사 규칙 분리
# Login Form Hook 재구조화 (필요시)
```

### 3단계: Low 항목 (Phase 4 이후)

```bash
# 안정화 단계에서 적용
```

---

## 결론

### 전반적 평가

Phase 2 구현은 **기능적으로는 완벽**하지만, **일부 오버엔지니어링**과 **책임 분리 미흡**이 발견되었습니다.

### 오버엔지니어링 항목

1. ✅ **Auth Store 이중 저장** - 명확한 오버엔지니어링
2. ⚠️ **Login Form의 navigate** - 논쟁의 여지

### 리팩토링 필요성

- **필수**: Auth Store, API 인터셉터 (Phase 3 전 완료)
- **권장**: 유효성 검사 상수화 (Phase 3 중 병행)
- **선택**: 나머지 항목들 (Phase 4 이후)

### 다음 액션

1. **Critical 항목 리팩토링** (5-7시간)
2. **Phase 3 시작**
3. **Medium 항목은 Phase 3 개발 중 병행**

---

**📅 최종 업데이트**: 2025-10-04
**👤 작성자**: Claude Code
**🎯 다음 단계**: [PHASE2_REFACTORING_IMPLEMENTATION.md](./PHASE2_REFACTORING_IMPLEMENTATION.md) (리팩토링 구현 가이드)
