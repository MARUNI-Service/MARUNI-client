# Phase 3-2: 회원 온보딩 (Onboarding) - 세부 구현 계획

**작성일**: 2025-10-14
**예상 소요 시간**: 6-8시간 (1-2일)
**우선순위**: 🟠 높음
**구현 원칙**: 최소한의 구현 - 요구사항 충족을 위한 필수 기능만
**API 연결**: ❌ 이 Phase에서는 연결 안 함 - Phase 3-8에서 일괄 연결
**참조 문서**: [user-flow.md Journey 1](../flows/user-flow.md#journey-1-첫-시작-김순자-할머니-관점)

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

새로운 사용자가 앱을 처음 실행하고 회원가입 및 온보딩을 완료하여 메인 화면에 진입할 수 있는 완전한 플로우 구현

### 핵심 요구사항

user-flow.md Journey 1 (첫 시작)을 완벽히 재현:

```
[첫 화면] → [회원가입] → [온보딩 1/3] → [온보딩 2/3] → [온보딩 3/3] → [메인 화면]
```

**Journey 1의 4단계 구현**:
1. ✅ Phase 1: 발견 및 설치 (첫 화면) - 이미 로그인 화면으로 구현됨
2. ✅ Phase 2: 회원가입 폼 구현
3. ✅ Phase 3: 온보딩 3단계 구현
4. ✅ Phase 4: 메인 화면 진입 (Phase 3-1에서 완료)

### 범위

**포함**:

- ✅ 회원가입 페이지 (/register)
  - 이메일, 이름, 비밀번호, 전화번호 입력
  - 폼 검증 (필수 입력, 이메일 형식, 비밀번호 길이)
  - Mock 회원가입 처리
- ✅ 온보딩 페이지 (/onboarding)
  - 3단계 스텝 구조
  - Step 1: 서비스 소개
  - Step 2: AI 대화 설명
  - Step 3: 보호자 등록 안내
  - [나중에 하기] / [보호자 등록] 선택
- ✅ 라우팅 확장
  - /register 라우트 추가
  - /onboarding 라우트 추가
  - 회원가입 후 자동으로 온보딩 페이지 이동
  - 온보딩 완료 후 대시보드 이동

**제외**:

- ❌ API 연결 (Phase 3-8에서 일괄 연결)
- ❌ 이메일 중복 확인 (API 필요)
- ❌ 이메일 인증 (Phase 4)
- ❌ 소셜 로그인 (Phase 4)
- ❌ 비밀번호 찾기 (Phase 3-5)
- ❌ 복잡한 애니메이션 효과
- ❌ 온보딩 스킵 기능 (무조건 3단계 진행)
- ❌ 온보딩 진행 상태 저장 (로그아웃 시 초기화)

---

## API 연결 전략

### Phase 3-2: Mock 데이터로 회원가입 구현

**원칙**:

- **회원가입 폼만 구현, 실제 API는 호출 안 함**
- 회원가입 시 Mock 사용자를 useAuthStore에 추가
- 온보딩은 순수 클라이언트 로직 (상태 저장 안 함)

### Phase 3-2에서 할 일

1. **회원가입 폼 구현**

   - 입력값 검증만 클라이언트에서 처리
   - 제출 시 useAuthStore에 Mock 사용자 추가
   - `POST /api/auth/signup` 호출 안 함

2. **온보딩 플로우 구현**

   - 3단계 스텝 진행만 구현
   - 보호자 등록 선택 시 라우팅만 처리
   - 실제 보호자 등록은 Phase 3-3에서 구현

3. **라우팅 설정**
   - React Router에 /register, /onboarding 추가
   - 회원가입 후 자동 이동 로직

### Phase 3-8 (API 연결) 계획

Phase 3-1 ~ 3-7 완료 후:

1. **회원가입 API 연동**

   - `POST /api/auth/signup` 실제 호출
   - 서버 응답으로 JWT 토큰 저장
   - 이메일 중복 확인 로직 추가

2. **에러 처리 강화**
   - 서버 에러 메시지 표시
   - 네트워크 오류 처리

**장점**:

- ✅ UI/UX 먼저 완성하고 나중에 API 연결
- ✅ 서버 API 준비 안 돼도 프론트 개발 가능
- ✅ 폼 검증 로직 먼저 완성

---

## 최소 구현 원칙

### 1. 폼 검증은 기본적인 것만

```typescript
// ✅ Good: 필수 검증만
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};

// ❌ Bad: 과도한 검증
const validatePassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  // 너무 복잡함
};
```

### 2. 온보딩 스텝은 순수 클라이언트 로직

```tsx
// ✅ Good: useState로 현재 스텝만 관리
const [currentStep, setCurrentStep] = useState(1);

const handleNext = () => {
  if (currentStep < 3) {
    setCurrentStep(currentStep + 1);
  }
};

// ❌ Bad: 복잡한 상태 관리
const { step, setStep, saveProgress } = useOnboardingStore(); // 불필요
```

### 3. 페이지 이동은 React Router만 사용

```tsx
// ✅ Good: useNavigate로 직접 이동
const navigate = useNavigate();

const handleComplete = () => {
  navigate('/dashboard');
};

// ❌ Bad: 추상화된 라우팅 헬퍼
const { navigateToDashboard } = useRouterHelper(); // 불필요
```

### 4. Mock 회원가입은 단순하게

```typescript
// ✅ Good: useAuthStore에 직접 추가
signup: async (credentials: SignupRequest) => {
  // Mock 사용자 생성
  const newUser = {
    id: Date.now(),
    username: credentials.email,
    name: credentials.name,
    role: 'SENIOR' as const,
    dailyCheckEnabled: false,
    guardian: null,
    managedMembers: [],
    ...
  };

  set({
    user: newUser,
    accessToken: 'mock-token',
    isAuthenticated: true,
  });
};

// ❌ Bad: 복잡한 Mock 서버
mockServer.post('/api/auth/signup', (req, res) => { ... }); // 불필요
```

---

## 작업 분해

### Task 1: 회원가입 페이지 구현 (3시간)

- RegisterPage 컴포넌트 생성
- 폼 입력 필드 (이메일, 이름, 비밀번호, 전화번호)
- 클라이언트 폼 검증
- useAuthStore에 signup 함수 추가

### Task 2: 온보딩 페이지 구현 (2시간)

- OnboardingPage 컴포넌트 생성
- 3단계 스텝 구조
- 각 스텝별 콘텐츠 표시
- 다음/이전 버튼

### Task 3: 라우팅 확장 (1시간)

- router.tsx에 /register, /onboarding 추가
- 보호된 라우트 설정
- 회원가입 후 온보딩으로 자동 이동

### Task 4: 통합 테스트 (1시간)

- 전체 플로우 테스트 (첫 화면 → 회원가입 → 온보딩 → 대시보드)
- 폼 검증 테스트
- TypeScript 빌드 확인

**총 예상 시간**: 7시간

---

## Task별 구현 가이드

### Task 1: 회원가입 페이지 구현

#### 파일: `src/pages/auth/RegisterPage.tsx`

```tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Input, Button } from '@/shared/components';
import { useAuth } from '@/features/auth';

/**
 * 회원가입 페이지
 * - Journey 1 Phase 2: 회원가입 구현
 * - Mock 데이터로 회원가입 처리 (Phase 3-8에서 API 연결)
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 🔴 Phase 3-2: Mock 회원가입
      // Phase 3-8에서 실제 API 호출로 변경
      await signup({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });

      // 회원가입 성공 → 온보딩 페이지로 이동
      navigate('/onboarding');
    } catch (error) {
      setErrors({ submit: '회원가입에 실패했습니다' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Layout title="회원가입" showBack={true}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto py-8 px-4">
        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="block text-xl font-semibold mb-2 text-gray-700">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@email.com"
            size="large"
            error={!!errors.email}
          />
          {errors.email && <p className="text-red-600 text-base mt-2">{errors.email}</p>}
        </div>

        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-xl font-semibold mb-2 text-gray-700">
            이름
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="홍길동"
            size="large"
            error={!!errors.name}
          />
          {errors.name && <p className="text-red-600 text-base mt-2">{errors.name}</p>}
        </div>

        {/* 비밀번호 */}
        <div>
          <label htmlFor="password" className="block text-xl font-semibold mb-2 text-gray-700">
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="8자 이상"
            size="large"
            error={!!errors.password}
          />
          {errors.password && <p className="text-red-600 text-base mt-2">{errors.password}</p>}
        </div>

        {/* 전화번호 (선택) */}
        <div>
          <label htmlFor="phoneNumber" className="block text-xl font-semibold mb-2 text-gray-700">
            전화번호 <span className="text-gray-500 text-base">(선택)</span>
          </label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="010-1234-5678"
            size="large"
          />
        </div>

        {/* 제출 에러 */}
        {errors.submit && <p className="text-red-600 text-base text-center">{errors.submit}</p>}

        {/* 가입 버튼 */}
        <Button type="submit" variant="primary" size="extra-large" fullWidth disabled={isLoading}>
          {isLoading ? '가입 중...' : '가입하기'}
        </Button>

        {/* 로그인 링크 */}
        <p className="text-center text-lg text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </form>
    </Layout>
  );
}
```

#### 파일: `src/pages/auth/index.ts`

```typescript
export { LoginPage } from './LoginPage';
export { RegisterPage } from './RegisterPage';
```

#### 파일: `src/features/auth/store/useAuthStore.ts` (signup 함수 추가)

```typescript
// 기존 코드에 추가

interface SignupRequest {
  email: string;
  name: string;
  password: string;
  phoneNumber?: string;
}

interface AuthStore {
  // ... 기존 필드
  signup: (credentials: SignupRequest) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ... 기존 필드

      signup: async (credentials: SignupRequest) => {
        set({ isLoading: true, error: null });

        try {
          // 🔴 Phase 3-2: Mock 회원가입
          // Phase 3-8에서 실제 API 호출로 변경
          const newUser: User = {
            id: Date.now(),
            username: credentials.email.split('@')[0], // 이메일의 @ 앞부분을 username으로
            name: credentials.name,
            role: 'SENIOR', // 기본값: 노인
            phoneNumber: credentials.phoneNumber,
            email: credentials.email,
            dailyCheckEnabled: false, // 기본값: 비활성
            guardian: null,
            managedMembers: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            user: newUser,
            accessToken: `mock-token-${Date.now()}`,
            refreshToken: `mock-refresh-${Date.now()}`,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // 🔴 Phase 3-8에서 활성화: 실제 API 호출
          // const response = await authApi.signup(credentials);
          // set({ user: response.user, ... });
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
      },

      // ... 기존 함수들
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

#### 파일: `src/features/auth/hooks/useAuth.ts` (signup 추가)

```typescript
export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, logout, signup } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    signup, // 🆕 추가
  };
}
```

**작업 시간**: 3시간

---

### Task 2: 온보딩 페이지 구현

#### 파일: `src/pages/onboarding/OnboardingPage.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Card } from '@/shared/components';

/**
 * 온보딩 페이지 (3단계)
 * - Journey 1 Phase 3: 온보딩 구현
 * - Step 1: 서비스 소개
 * - Step 2: AI 대화 설명
 * - Step 3: 보호자 등록 안내
 */
export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    // "나중에 하기" 선택 → 메인 화면으로 이동
    navigate('/dashboard');
  };

  const handleRegisterGuardian = () => {
    // "보호자 등록" 선택 → Phase 3-3에서 구현할 보호자 찾기 페이지로 이동
    // 현재는 메인 화면으로 이동
    navigate('/dashboard');
    // TODO Phase 3-3: navigate('/guardians/search');
  };

  return (
    <Layout title="MARUNI 소개" showBack={currentStep > 1}>
      <div className="flex flex-col h-full px-4 py-8">
        {/* 진행 표시 */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 w-16 rounded-full ${
                step === currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* 스텝별 콘텐츠 */}
        <div className="flex-1 flex items-center justify-center">
          {currentStep === 1 && (
            <Card padding="large" className="text-center max-w-lg">
              <div className="space-y-6">
                <div className="text-6xl mb-4">👋</div>
                <h1 className="text-3xl font-bold text-gray-900">
                  MARUNI에 오신 걸<br />
                  환영합니다!
                </h1>
                <p className="text-xl text-gray-700">
                  매일 아침 9시<br />
                  따뜻한 안부 메시지를<br />
                  보내드려요
                </p>
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <Card padding="large" className="text-center max-w-lg">
              <div className="space-y-6">
                <div className="text-6xl mb-4">🤖</div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI가 대화를<br />
                  기억해요
                </h1>
                <p className="text-xl text-gray-700">
                  자연스럽게 이야기하듯<br />
                  편하게 대답해주세요
                </p>
              </div>
            </Card>
          )}

          {currentStep === 3 && (
            <Card padding="large" className="text-center max-w-lg">
              <div className="space-y-6">
                <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                <h1 className="text-3xl font-bold text-gray-900">
                  보호자를<br />
                  등록하시겠어요?
                </h1>
                <p className="text-xl text-gray-700">
                  보호자가 등록되면<br />
                  이상 징후 발생 시<br />
                  알림을 보내드려요
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="space-y-4">
          {currentStep < 3 ? (
            <Button variant="primary" size="extra-large" fullWidth onClick={handleNext}>
              다음
            </Button>
          ) : (
            <>
              <Button variant="primary" size="extra-large" fullWidth onClick={handleRegisterGuardian}>
                보호자 등록
              </Button>
              <Button variant="secondary" size="extra-large" fullWidth onClick={handleSkip}>
                나중에 하기
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
```

#### 파일: `src/pages/onboarding/index.ts`

```typescript
export { OnboardingPage } from './OnboardingPage';
```

**작업 시간**: 2시간

---

### Task 3: 라우팅 확장

#### 파일: `src/app/router.tsx`

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { OnboardingPage } from '@/pages/onboarding';
import { DashboardPage } from '@/pages/dashboard';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />, // 🆕 회원가입 페이지
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingPage /> {/* 🆕 온보딩 페이지 */}
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

#### 파일: `src/pages/auth/LoginPage.tsx` (회원가입 링크 추가)

기존 LoginPage에 회원가입 링크 추가:

```tsx
// ... 기존 코드

return (
  <Layout title="로그인" showBack={false}>
    {/* ... 기존 폼 */}

    {/* 🆕 회원가입 링크 추가 */}
    <p className="text-center text-lg text-gray-600">
      계정이 없으신가요?{' '}
      <Link to="/register" className="text-blue-600 font-semibold hover:underline">
        회원가입
      </Link>
    </p>
  </Layout>
);
```

**작업 시간**: 1시간

---

### Task 4: 통합 테스트

#### 테스트 시나리오

**시나리오 1: 전체 플로우 (새 사용자)**

1. 브라우저에서 `http://localhost:5173` 접속
2. 로그인 화면에서 "회원가입" 링크 클릭
3. 회원가입 폼 작성:
   - 이메일: `test@example.com`
   - 이름: `테스트`
   - 비밀번호: `test1234`
   - 전화번호: `010-1234-5678`
4. "가입하기" 버튼 클릭
5. 온보딩 1/3 화면 확인 → "다음" 클릭
6. 온보딩 2/3 화면 확인 → "다음" 클릭
7. 온보딩 3/3 화면 확인 → "나중에 하기" 클릭
8. 메인 화면(DashboardPage) 진입 확인
9. "시작 가이드" 섹션이 표시되는지 확인 (dailyCheckEnabled=false, guardian=null, managedMembers=[])

**시나리오 2: 폼 검증 테스트**

1. 회원가입 페이지 접근
2. 필수 필드 비우고 "가입하기" 클릭 → 에러 메시지 확인
3. 잘못된 이메일 형식 입력 → "올바른 이메일 형식이 아닙니다" 확인
4. 비밀번호 7자 입력 → "비밀번호는 8자 이상이어야 합니다" 확인
5. 올바른 값 입력 후 제출 → 성공

**시나리오 3: 온보딩 진행 테스트**

1. 온보딩 1/3에서 진행 표시 확인 (파란색 첫 번째)
2. "다음" 클릭 → 진행 표시 2번째로 이동
3. "다음" 클릭 → 진행 표시 3번째로 이동
4. "보호자 등록" / "나중에 하기" 버튼 확인
5. "나중에 하기" → 대시보드 이동 확인

#### 테스트 방법

1. **TypeScript 빌드 확인**:

   ```bash
   npm run build
   ```

   → 타입 에러 0건 확인

2. **개발 서버 실행**:

   ```bash
   npm run dev
   ```

   → 브라우저에서 테스트

3. **노인 친화적 체크**:
   - 터치 영역 60px 이상 (버튼)
   - 폰트 크기 20px 이상 (본문), 24px 이상 (제목)
   - 입력 필드 높이 충분한지 (72px)
   - 색상 대비 충분한지 확인

**작업 시간**: 1시간

---

## 테스트 계획

### 기능 테스트

- [ ] 회원가입 폼 모든 필드 입력 및 제출 성공
- [ ] 회원가입 후 자동으로 온보딩 페이지 이동
- [ ] 온보딩 3단계 모두 정상 작동
- [ ] 온보딩 완료 후 대시보드 이동
- [ ] 대시보드에서 "시작 가이드" 섹션 표시

### 폼 검증 테스트

- [ ] 필수 필드 누락 시 에러 표시
- [ ] 잘못된 이메일 형식 에러 표시
- [ ] 비밀번호 8자 미만 에러 표시
- [ ] 입력 시 해당 필드 에러 제거
- [ ] 전화번호는 선택 사항으로 처리

### 라우팅 테스트

- [ ] /register 접근 가능
- [ ] /onboarding은 인증 필요 (ProtectedRoute)
- [ ] 로그인 페이지에서 회원가입 링크 작동
- [ ] 회원가입 페이지에서 로그인 링크 작동

### 접근성 테스트

- [ ] 터치 영역 60px 이상
- [ ] 폰트 크기 노인 친화적
- [ ] 입력 필드 label 연결 (htmlFor)
- [ ] 에러 메시지 명확하게 표시

---

## 완료 체크리스트

### 회원가입 페이지

- [ ] RegisterPage 컴포넌트 생성
- [ ] 이메일, 이름, 비밀번호, 전화번호 입력 필드
- [ ] 폼 검증 로직 구현 (이메일, 비밀번호)
- [ ] 에러 메시지 표시
- [ ] 로그인 페이지로 돌아가는 링크
- [ ] 노인 친화적 스타일 (폰트 20px+, 버튼 72px)

### 온보딩 페이지

- [ ] OnboardingPage 컴포넌트 생성
- [ ] 3단계 스텝 구조
- [ ] 진행 표시 (1/3, 2/3, 3/3)
- [ ] Step 1: 서비스 소개 콘텐츠
- [ ] Step 2: AI 대화 설명 콘텐츠
- [ ] Step 3: 보호자 등록 안내 콘텐츠
- [ ] "다음" 버튼 (Step 1-2)
- [ ] "보호자 등록" / "나중에 하기" 버튼 (Step 3)
- [ ] 노인 친화적 스타일 (큰 이모지, 큰 폰트)

### useAuthStore 수정

- [ ] signup 함수 추가
- [ ] SignupRequest 타입 정의
- [ ] Mock 사용자 생성 로직
- [ ] 에러 처리
- [ ] useAuth 훅에 signup 추가

### 라우팅

- [ ] /register 라우트 추가
- [ ] /onboarding 라우트 추가 (ProtectedRoute)
- [ ] LoginPage에 회원가입 링크 추가
- [ ] RegisterPage에 로그인 링크 추가

### 통합 테스트

- [ ] 전체 플로우 테스트 (로그인 → 회원가입 → 온보딩 → 대시보드)
- [ ] 폼 검증 테스트
- [ ] 온보딩 3단계 진행 테스트
- [ ] TypeScript 빌드 에러 0건

### 코드 품질

- [ ] ESLint 경고 0건
- [ ] Prettier 포맷팅 적용
- [ ] 불필요한 console.log 제거
- [ ] 주석 작성 (컴포넌트 설명 JSDoc)

### 접근성

- [ ] 터치 영역 60px 이상
- [ ] 폰트 크기 20px 이상 (본문), 24px 이상 (제목)
- [ ] 색상 대비 4.5:1 이상
- [ ] label과 input 연결 (htmlFor, id)

---

## 다음 단계

Phase 3-2 완료 후:

1. **Phase 3-3 시작**:

   - 보호자 관리 기능 구현
   - 보호자 찾기 (/guardians/search)
   - 보호자 등록 요청 및 수락

2. **온보딩 Step 3 연결**:

   - "보호자 등록" 버튼 클릭 시 `/guardians/search`로 이동
   - Phase 3-3에서 보호자 등록 완료 후 대시보드 이동

3. **API 연결 준비** (Phase 3-8):
   - signup API 엔드포인트 확인
   - Mock 로직 제거 및 실제 API 호출로 대체

---

**📅 문서 작성일**: 2025-10-14
**✏️ 작성자**: Claude Code
**🎯 원칙**: 최소한의 구현 - 요구사항 충족을 위한 필수 기능만
**📍 다음 작업**: Task 1부터 순차 구현 시작
