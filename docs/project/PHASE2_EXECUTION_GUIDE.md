# Phase 2 실행 가이드: 서버 연동 및 인증 시스템

> **MARUNI 클라이언트 Phase 2 상세 실행 계획서**
> **목표**: React Router 설정, API 클라이언트, JWT 인증 시스템 구축 (1주 완료)
> **진행률**: 40% → 60%

## ⚠️ 중요 개선 사항 (2025-10-03 업데이트)

이 가이드는 다음 중요한 개선사항을 반영하여 업데이트되었습니다:

### 1. ✅ AccessToken/RefreshToken 분리 저장
- **문제**: 기존 계획은 토큰을 구분 없이 저장하여 갱신 불가능
- **해결**: `getAccessToken()`, `getRefreshToken()` 별도 함수로 분리 관리
- **영향**: `storage.ts`, `api.ts`, `authStore.ts` 전체 수정

### 2. ✅ 토큰 갱신 중복 방지
- **문제**: 동시 요청 시 토큰 갱신 API가 여러 번 호출됨
- **해결**: Promise 큐잉 패턴 적용 (`isRefreshing` 플래그 + `refreshSubscribers` 큐)
- **영향**: `api.ts` 응답 인터셉터 로직 개선

### 3. ✅ 초기 로딩 상태 관리
- **문제**: persist 복원 중 ProtectedRoute가 잘못된 판단으로 깜빡임 발생
- **해결**: `isInitialized` 상태 추가 및 `initialize()` 함수 구현
- **영향**: `authStore.ts`, `ProtectedRoute.tsx` 수정

**👉 반드시 수정된 코드 템플릿을 사용하세요!**

---

## 🎯 Phase 2 개요

### 핵심 목표
- **React Router v7 기반 라우팅 시스템** 구축
- **Axios 기반 API 클라이언트** 및 JWT 자동 관리
- **Zustand 기반 인증 상태 관리** 시스템
- **TanStack Query Provider** 설정 및 서버 상태 관리
- **보호된 라우트 및 인증 가드** 구현
- **로그인/대시보드 기본 페이지** 완성

### 완료 시 달성 결과
- React Router 기반 페이지 네비게이션 동작
- 서버 API 연동 및 JWT 인증 시스템 완성
- 로그인 → 대시보드 전체 플로우 동작
- 토큰 만료 시 자동 갱신 또는 로그인 리다이렉트
- TypeScript 타입 에러 0개

---

## ✅ 시작 전 준비사항 체크리스트

### Phase 1 완료 확인
- [ ] Button, Layout, Input, Card, LoadingSpinner, ErrorBoundary 컴포넌트 완성
- [ ] 모든 컴포넌트가 노인 친화적 기준 충족
- [ ] TypeScript 컴파일 에러 없음
- [ ] `npm run build` 성공

### 개발 환경 확인
- [ ] 개발 서버 정상 동작 (`npm run dev`)
- [ ] 서버 API 엔드포인트 확인 (.env.local 설정)
- [ ] React Router v7 패키지 설치 확인
- [ ] TanStack Query, Zustand, Axios 패키지 설치 확인

### 필수 문서 숙지
- [ ] [TECHNICAL_ARCHITECTURE.md](../architecture/TECHNICAL_ARCHITECTURE.md) - API 통신 아키텍처
- [ ] [PACKAGE_STRUCTURE.md](../development/PACKAGE_STRUCTURE.md) - features 구조
- [ ] [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Phase 2 전체 계획

### 서버 연동 준비
- [ ] 서버 API 문서 확인 (../maruni-server/docs/)
- [ ] 로그인 API 엔드포인트 확인 (`POST /api/auth/login`)
- [ ] JWT 토큰 응답 형식 확인
- [ ] 서버가 로컬에서 실행 중인지 확인 (localhost:8080)

---

## 📅 7일간 상세 실행 계획

### Day 1-2: 라우팅 및 API 클라이언트 구축

#### Day 1: React Router 설정

**⏰ 예상 소요 시간**: 5-6시간

**🎯 목표**: React Router v7 기반 라우팅 시스템 구축

**📋 상세 작업**:

1. **폴더 구조 생성** (30분)
   ```
   src/
   ├── app/
   │   ├── App.tsx           # 메인 앱 컴포넌트 (기존 파일 이동)
   │   ├── router.tsx        # 라우터 설정
   │   └── providers/        # Provider 컴포넌트들
   │       └── index.ts
   ├── pages/
   │   ├── auth/
   │   │   ├── LoginPage.tsx
   │   │   └── index.ts
   │   ├── dashboard/
   │   │   ├── DashboardPage.tsx
   │   │   └── index.ts
   │   └── NotFoundPage.tsx
   ```

2. **라우터 설정 파일 작성** (2시간)
   - `app/router.tsx` 생성
   - createBrowserRouter 설정
   - 공개 라우트 (/, /login)
   - 보호 라우트 (대시보드 등)
   - 404 페이지 라우트

3. **기본 페이지 컴포넌트 생성** (2시간)
   - LoginPage: 로그인 페이지 껍데기
   - DashboardPage: 대시보드 페이지 껍데기
   - NotFoundPage: 404 페이지

4. **App.tsx 리팩토링** (1시간)
   - RouterProvider로 라우터 연결
   - 기존 테스트 코드는 DashboardPage로 이동
   - 전역 ErrorBoundary 적용

5. **routes 상수 업데이트** (30분)
   - `shared/constants/routes.ts` 확장
   - 모든 라우트 경로 상수화

**✅ Day 1 완료 기준**:
- [ ] 라우터 설정 완료 및 페이지 이동 동작
- [ ] /login, /dashboard, /404 라우트 접근 가능
- [ ] TypeScript 컴파일 에러 없음
- [ ] 브라우저에서 페이지 전환 확인

#### Day 2: API 클라이언트 구축

**⏰ 예상 소요 시간**: 5-7시간

**🎯 목표**: Axios 기반 API 클라이언트 및 인터셉터 설정

**📋 상세 작업**:

1. **API 클라이언트 파일 생성** (30분)
   ```
   src/shared/utils/
   ├── api.ts              # API 클라이언트
   ├── storage.ts          # LocalStorage 관리
   └── index.ts
   ```

2. **Axios 인스턴스 설정** (1시간)
   - baseURL 설정 (환경변수)
   - timeout 설정
   - 기본 headers 설정

3. **요청 인터셉터 구현** (2시간)
   - JWT accessToken 자동 첨부
   - 요청 로깅 (개발 모드)
   - Content-Type 설정

4. **응답 인터셉터 구현** (2-3시간)
   - 성공 응답 처리
   - 401 에러 처리 (토큰 만료)
   - **토큰 갱신 로직 (중복 방지 포함)**
   - 에러 정규화 및 변환
   - 네트워크 에러 처리

5. **Storage 유틸리티 구현** (1시간)
   - JWT 토큰 저장/조회/삭제 (**accessToken/refreshToken 분리**)
   - 타입 안전한 LocalStorage 래퍼
   - 사용자 정보 저장/조회

**✅ Day 2 완료 기준**:
- [ ] Axios 인스턴스 정상 생성
- [ ] 인터셉터 동작 확인 (콘솔 로그)
- [ ] Storage 유틸리티 정상 동작
- [ ] TypeScript 타입 에러 없음

### Day 3-5: 인증 시스템 구현

#### Day 3: Auth 상태 관리 및 API

**⏰ 예상 소요 시간**: 6-7시간

**🎯 목표**: features/auth 모듈 구조 및 Zustand Store 구현

**📋 상세 작업**:

1. **features/auth 폴더 구조 생성** (30분)
   ```
   src/features/auth/
   ├── api/
   │   └── authApi.ts       # 로그인/로그아웃 API
   ├── store/
   │   └── authStore.ts     # Zustand 인증 상태
   ├── types/
   │   └── auth.types.ts    # 인증 관련 타입
   ├── hooks/
   │   └── useAuth.ts       # 인증 훅
   ├── components/
   │   └── ProtectedRoute.tsx  # 보호 라우트 컴포넌트
   └── index.ts             # Export
   ```

2. **타입 정의** (1시간)
   - LoginRequest, LoginResponse
   - User, AuthState
   - Token 관련 타입

3. **authApi 구현** (2시간)
   - login(credentials) 함수
   - logout() 함수
   - refreshToken() 함수
   - getCurrentUser() 함수

4. **authStore 구현** (2-3시간)
   - Zustand store 생성
   - 상태: user, accessToken, refreshToken, isAuthenticated, isLoading, **isInitialized**
   - 액션: login, logout, setUser, setTokens, **initialize**
   - persist 미들웨어 적용 (localStorage 연동)
   - **onRehydrateStorage 콜백으로 초기화 처리**

5. **useAuth 훅 구현** (1시간)
   - authStore 래퍼 훅
   - 편리한 API 제공
   - 타입 안전성 보장

**✅ Day 3 완료 기준**:
- [ ] authStore 정상 동작 (상태 변경 확인)
- [ ] authApi 함수 정의 완료
- [ ] useAuth 훅 정상 동작
- [ ] TypeScript 타입 에러 없음

#### Day 4: 로그인 페이지 구현

**⏰ 예상 소요 시간**: 5-6시간

**🎯 목표**: 노인 친화적 로그인 UI 및 로직 완성

**📋 상세 작업**:

1. **LoginForm 컴포넌트 생성** (30분)
   ```
   src/features/auth/components/
   └── LoginForm/
       ├── LoginForm.tsx
       ├── LoginForm.types.ts
       └── index.ts
   ```

2. **로그인 폼 UI 구현** (2시간)
   - Input 컴포넌트 활용 (전화번호/비밀번호)
   - Button 컴포넌트 활용 (로그인 버튼)
   - 노인 친화적 레이아웃
   - 에러 메시지 표시 영역

3. **로그인 로직 구현** (2-3시간)
   - 폼 상태 관리 (useState)
   - 유효성 검사 (전화번호, 비밀번호)
   - authApi.login 호출
   - 성공 시 토큰 저장 및 리다이렉트
   - 실패 시 에러 메시지 표시

4. **로딩 상태 처리** (1시간)
   - LoadingSpinner 표시
   - 버튼 disabled 처리
   - 사용자 피드백 강화

**✅ Day 4 완료 기준**:
- [ ] 로그인 폼 UI 완성
- [ ] 유효성 검사 동작
- [ ] 로그인 API 호출 (Mock 또는 실제 서버)
- [ ] 에러 처리 정상 동작

#### Day 5: 보호된 라우트 및 인증 플로우

**⏰ 예상 소요 시간**: 5-6시간

**🎯 목표**: ProtectedRoute 및 전체 인증 플로우 완성

**📋 상세 작업**:

1. **ProtectedRoute 컴포넌트 구현** (2시간)
   - 인증 상태 확인 (useAuth)
   - 미인증 시 /login 리다이렉트
   - 인증 완료 시 children 렌더링
   - 로딩 상태 처리

2. **라우터에 ProtectedRoute 적용** (1시간)
   - DashboardPage를 ProtectedRoute로 감싸기
   - 다른 보호 라우트 설정

3. **로그인 후 리다이렉트 구현** (1-2시간)
   - 로그인 성공 시 /dashboard 이동
   - 이전 페이지로 돌아가기 (선택 사항)
   - navigate 훅 활용

4. **로그아웃 기능 구현** (1시간)
   - 로그아웃 버튼 추가 (DashboardPage)
   - authStore.logout 호출
   - 토큰 삭제 및 /login 리다이렉트

5. **토큰 갱신 로직 테스트** (1시간)
   - 401 에러 시 자동 갱신 시도
   - 갱신 실패 시 로그아웃

**✅ Day 5 완료 기준**:
- [ ] ProtectedRoute 정상 동작
- [ ] 미인증 시 /login 리다이렉트
- [ ] 로그인 → 대시보드 플로우 완성
- [ ] 로그아웃 기능 정상 동작

### Day 6-7: Provider 설정 및 통합 테스트

#### Day 6: TanStack Query Provider 설정

**⏰ 예상 소요 시간**: 4-5시간

**🎯 목표**: TanStack Query 설정 및 Provider 구조 완성

**📋 상세 작업**:

1. **QueryProvider 파일 생성** (30분)
   ```
   src/app/providers/
   ├── QueryProvider.tsx
   ├── AppProviders.tsx     # 모든 Provider 통합
   └── index.ts
   ```

2. **QueryClient 설정** (1-2시간)
   - QueryClient 생성
   - 기본 옵션 설정 (staleTime, cacheTime)
   - 에러 핸들링 설정
   - retry 전략 설정

3. **QueryProvider 컴포넌트 구현** (1시간)
   - QueryClientProvider 래핑
   - devtools 설정 (개발 모드)

4. **AppProviders 통합** (1시간)
   - QueryProvider 통합
   - ErrorBoundary 통합
   - 향후 Provider 확장 준비

5. **main.tsx 업데이트** (30분)
   - AppProviders로 App 감싸기
   - strict mode 설정

**✅ Day 6 완료 기준**:
- [ ] QueryClient 정상 생성
- [ ] devtools 동작 확인
- [ ] Provider 계층 구조 올바름
- [ ] TypeScript 타입 에러 없음

#### Day 7: 통합 테스트 및 최종 검증

**⏰ 예상 소요 시간**: 5-6시간

**🎯 목표**: 전체 시스템 통합 및 품질 확인

**📋 상세 작업**:

1. **전체 플로우 테스트** (2시간)
   - 로그인 → 대시보드 이동
   - 새로고침 시 상태 유지
   - 로그아웃 → 로그인 페이지 이동
   - 직접 대시보드 접근 시 리다이렉트

2. **서버 API 연동 테스트** (2시간)
   - 실제 서버와 연동 (localhost:8080)
   - 로그인 API 호출 확인
   - JWT 토큰 저장/조회 확인
   - 에러 처리 확인

3. **코드 품질 검사** (1시간)
   - TypeScript 컴파일 (`npm run build`)
   - ESLint 검사 (`npm run lint`)
   - 불필요한 console.log 제거

4. **문서 업데이트** (1시간)
   - CURRENT_STATUS.md 업데이트
   - COMPONENT_CATALOG.md 업데이트 (ProtectedRoute 추가)
   - README.md 업데이트 (필요 시)

**✅ Day 7 완료 기준**:
- [ ] 전체 인증 플로우 정상 동작
- [ ] 서버 API 연동 성공
- [ ] TypeScript 컴파일 에러 0개
- [ ] ESLint 경고 0개
- [ ] Phase 2 완료 기준 충족

---

## 🏗️ 상세 구현 가이드 및 코드 템플릿

### 1. React Router 설정

#### app/router.tsx

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { ROUTES } from '@/shared/constants/routes';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFoundPage />,
    children: [
      // 루트 경로 - 대시보드로 리다이렉트
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },

      // 공개 라우트 - 인증 페이지
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },

      // 보호된 라우트 - 인증 필요
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },

      // 404 페이지
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
```

#### app/App.tsx

```typescript
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export function App() {
  return <RouterProvider router={router} />;
}
```

#### shared/constants/routes.ts

```typescript
// 라우트 경로 상수
export const ROUTES = {
  // 공개 라우트
  HOME: '/',
  LOGIN: '/login',

  // 보호된 라우트
  DASHBOARD: '/dashboard',
  CONVERSATION: '/conversation',
  GUARDIANS: '/guardians',
  SETTINGS: '/settings',
} as const;

// 타입 정의
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
```

### 2. API 클라이언트 구현

#### shared/utils/api.ts

```typescript
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL } from '@/shared/constants/api';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  removeAllTokens
} from './storage';
import { ROUTES } from '@/shared/constants/routes';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 관련 상태 (중복 요청 방지)
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 갱신 완료 시 대기 중인 요청들 처리
function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// 토큰 갱신 대기 큐에 추가
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// 요청 인터셉터: JWT accessToken 자동 첨부
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 개발 모드에서 요청 로깅
    if (import.meta.env.DEV) {
      console.log('[API Request]', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리 및 토큰 갱신 (중복 방지)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러 처리 (인증 실패)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 토큰 갱신 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // refreshToken 가져오기
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // 토큰 갱신 요청
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        // 새 accessToken 저장
        setAccessToken(newAccessToken);

        // 대기 중인 요청들에 새 토큰 전달
        onRefreshed(newAccessToken);

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        removeAllTokens();
        window.location.href = ROUTES.LOGIN;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 기타 에러 처리
    const errorMessage = error.response?.data?.message || '오류가 발생했습니다';

    if (import.meta.env.DEV) {
      console.error('[API Error]', error.response?.status, errorMessage);
    }

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

export default apiClient;
```

#### shared/utils/storage.ts

```typescript
import { STORAGE_KEYS } from '@/shared/constants/storage';

// ===== 토큰 관리 (accessToken/refreshToken 분리) =====

// Access Token 저장
export function setAccessToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error('Failed to save access token:', error);
  }
}

// Access Token 조회
export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
}

// Refresh Token 저장
export function setRefreshToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Failed to save refresh token:', error);
  }
}

// Refresh Token 조회
export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
}

// 모든 토큰 삭제
export function removeAllTokens(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Failed to remove tokens:', error);
  }
}

// 타입 안전한 LocalStorage 래퍼
export function setItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to save item (${key}):`, error);
  }
}

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Failed to get item (${key}):`, error);
    return null;
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item (${key}):`, error);
  }
}
```

### 3. Auth 시스템 구현

#### features/auth/types/auth.types.ts

```typescript
// 로그인 요청 타입
export interface LoginRequest {
  username: string; // 전화번호 또는 사용자명
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  refreshToken: string; // refreshToken은 필수
  user: User;
}

// 사용자 정보 타입
export interface User {
  id: number;
  name: string;
  username: string;
  role: 'MEMBER' | 'GUARDIAN' | 'ADMIN';
  createdAt: string;
}

// Auth 상태 타입
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // 초기화 완료 여부
}

// Auth 액션 타입
export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  initialize: () => void; // 초기화 함수
  setLoading: (isLoading: boolean) => void;
}

// Auth Store 타입
export type AuthStore = AuthState & AuthActions;
```

#### features/auth/api/authApi.ts

```typescript
import apiClient from '@/shared/utils/api';
import { API_ENDPOINTS } from '@/shared/constants/api';
import { LoginRequest, LoginResponse, User } from '../types/auth.types';

export const authApi = {
  // 로그인
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  // 토큰 갱신
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post<{ accessToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data;
  },

  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  // 로그아웃 (서버 측 처리 필요 시)
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};
```

#### features/auth/store/authStore.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore, LoginRequest } from '../types/auth.types';
import { authApi } from '../api/authApi';
import {
  setAccessToken,
  setRefreshToken,
  removeAllTokens,
  getAccessToken,
  getRefreshToken,
  getItem,
  setItem,
  removeItem,
} from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import type { User } from '../types/auth.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true, // 초기값 true (초기화 전까지 로딩)
      isInitialized: false,

      // 초기화 (persist 복원 후 실행)
      initialize: () => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        const user = getItem<User>(STORAGE_KEYS.USER);

        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: !!(accessToken && refreshToken && user),
          isLoading: false,
          isInitialized: true,
        });
      },

      // 로그인
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });

        try {
          const response = await authApi.login(credentials);

          // 토큰 저장
          setAccessToken(response.accessToken);
          setRefreshToken(response.refreshToken);
          setItem(STORAGE_KEYS.USER, response.user);

          // 상태 업데이트
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // 로그아웃
      logout: () => {
        // 모든 토큰 및 사용자 정보 삭제
        removeAllTokens();
        removeItem(STORAGE_KEYS.USER);

        // 상태 초기화
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // 사용자 정보 설정
      setUser: (user) => {
        if (user) {
          setItem(STORAGE_KEYS.USER, user);
        } else {
          removeItem(STORAGE_KEYS.USER);
        }
        set({ user, isAuthenticated: !!user });
      },

      // 토큰 설정
      setTokens: (accessToken: string, refreshToken: string) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      // 로딩 상태 설정
      setLoading: (isLoading) => {
        set({ isLoading });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키
      partialize: (state) => ({
        // persist에서는 플래그만 저장 (실제 토큰은 별도 관리)
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // persist 복원 완료 후 초기화 실행
        state?.initialize();
      },
    }
  )
);
```

#### features/auth/hooks/useAuth.ts

```typescript
import { useAuthStore } from '../store/authStore';

/**
 * 인증 관련 훅
 * authStore를 래핑하여 편리한 API 제공
 */
export function useAuth() {
  const {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    logout,
    setUser,
    setTokens,
  } = useAuthStore();

  return {
    // 상태
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    isInitialized,

    // 액션
    login,
    logout,
    setUser,
    setTokens,
  };
}
```

#### features/auth/components/ProtectedRoute.tsx

```typescript
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '@/shared/constants/routes';
import { LoadingSpinner } from '@/shared/components';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 보호된 라우트 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized } = useAuth();

  // 초기화 완료 전까지 로딩 표시 (persist 복원 대기)
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 인증된 경우 children 렌더링
  return <>{children}</>;
}
```

#### features/auth/index.ts

```typescript
// Components
export { ProtectedRoute } from './components/ProtectedRoute';

// Hooks
export { useAuth } from './hooks/useAuth';

// Store
export { useAuthStore } from './store/authStore';

// API
export { authApi } from './api/authApi';

// Types
export * from './types/auth.types';
```

### 4. 로그인 페이지 구현

#### pages/auth/LoginPage.tsx

```typescript
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Input, Card } from '@/shared/components';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/constants/routes';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!username || !password) {
      setError('전화번호와 비밀번호를 입력해주세요');
      return;
    }

    try {
      await login({ username, password });
      // 로그인 성공 시 대시보드로 이동
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('Login error:', err);
    }
  };

  return (
    <Layout title="MARUNI 로그인">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card padding="large" className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="전화번호"
              type="tel"
              placeholder="010-0000-0000"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              error={error}
            />

            <Button
              type="submit"
              variant="primary"
              size="extra-large"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          {error && (
            <p className="mt-4 text-red-600 text-center text-lg" role="alert">
              {error}
            </p>
          )}
        </Card>
      </div>
    </Layout>
  );
}
```

### 5. TanStack Query Provider 설정

#### app/providers/QueryProvider.tsx

```typescript
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// QueryClient 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 모드에서만 devtools 표시 */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

#### app/providers/AppProviders.tsx

```typescript
import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from '@/shared/components';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * 모든 Provider를 통합하는 컴포넌트
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>{children}</QueryProvider>
    </ErrorBoundary>
  );
}
```

#### main.tsx 업데이트

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { AppProviders } from './app/providers/AppProviders';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
```

---

## 🧪 테스트 및 검증 방법

### 1. 라우팅 테스트

#### 브라우저에서 확인
```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
http://localhost:3000/          → /dashboard로 리다이렉트
http://localhost:3000/login     → 로그인 페이지
http://localhost:3000/dashboard → 미인증 시 /login으로 리다이렉트
http://localhost:3000/invalid   → 404 페이지
```

### 2. 인증 플로우 테스트

#### 전체 플로우 시나리오
1. **초기 접근**
   - [ ] /dashboard 접근 시 /login으로 리다이렉트
   - [ ] 로그인 폼 정상 표시

2. **로그인 시도**
   - [ ] 빈 값 제출 시 유효성 검사 에러
   - [ ] 잘못된 인증 정보 시 에러 메시지
   - [ ] 올바른 인증 정보 시 로그인 성공

3. **로그인 성공 후**
   - [ ] /dashboard로 자동 이동
   - [ ] 사용자 정보 표시
   - [ ] 새로고침 시 상태 유지

4. **로그아웃**
   - [ ] 로그아웃 버튼 클릭
   - [ ] /login으로 이동
   - [ ] 상태 초기화 확인

### 3. API 연동 테스트

#### Mock 서버 사용 (선택 사항)
```typescript
// 개발 중 Mock 데이터 사용
if (import.meta.env.DEV) {
  const mockLogin = async (credentials: LoginRequest): Promise<LoginResponse> => {
    // 시뮬레이션 지연
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (credentials.username === 'test' && credentials.password === 'test') {
      return {
        accessToken: 'mock-token-123',
        user: {
          id: 1,
          name: '테스트 사용자',
          username: 'test',
          role: 'MEMBER',
          createdAt: new Date().toISOString(),
        },
      };
    }

    throw new Error('Invalid credentials');
  };
}
```

#### 실제 서버 연동
```bash
# 1. 서버가 실행 중인지 확인
curl http://localhost:8080/api/health

# 2. 로그인 API 테스트
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# 3. 응답 확인
# {
#   "accessToken": "eyJ...",
#   "user": { ... }
# }
```

### 4. 코드 품질 검사

```bash
# TypeScript 컴파일 검사
npm run build

# ESLint 검사
npm run lint

# 타입 체크 (선택 사항)
npx tsc --noEmit
```

---

## 🚨 문제 해결 가이드

### 1. 라우팅 문제

#### "Cannot read property 'pathname'" 에러
```typescript
// 해결방법: RouterProvider가 올바르게 설정되었는지 확인
// App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export function App() {
  return <RouterProvider router={router} />; // ✅
}
```

#### 무한 리다이렉트
```typescript
// 해결방법: ProtectedRoute에서 로딩 상태 확인
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // ✅ 로딩 중에는 리다이렉트하지 않음
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
```

### 2. API 클라이언트 문제

#### CORS 에러
```typescript
// 해결방법 1: 서버에서 CORS 설정
// 서버 측 (Spring Boot)
@CrossOrigin(origins = "http://localhost:3000")

// 해결방법 2: 프록시 설정
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

#### 401 에러 무한 루프
```typescript
// 해결방법: _retry 플래그 사용
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // ✅ 한 번만 재시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // 토큰 갱신 로직...
    }

    return Promise.reject(error);
  }
);
```

### 3. Zustand 상태 관리 문제

#### 상태가 유지되지 않음
```typescript
// 해결방법: persist 미들웨어 확인 및 초기화 함수 사용
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 상태 및 액션...
      initialize: () => {
        // LocalStorage에서 직접 토큰과 사용자 정보 복원
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        const user = getItem<User>(STORAGE_KEYS.USER);

        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: !!(accessToken && refreshToken && user),
          isLoading: false,
          isInitialized: true,
        });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // ✅ persist 복원 후 초기화 실행
        state?.initialize();
      },
    }
  )
);
```

#### 상태 업데이트가 반영되지 않음
```typescript
// 해결방법: set 함수 올바르게 사용
// ❌ 잘못된 예
state.user = newUser; // 직접 변경 금지

// ✅ 올바른 예
set({ user: newUser });
```

### 4. TypeScript 타입 에러

#### "Type 'null' is not assignable to type 'User'"
```typescript
// 해결방법: null을 허용하는 타입 정의
export interface AuthState {
  user: User | null; // ✅ null 허용
  token: string | null;
  // ...
}
```

#### "Property 'Authorization' does not exist"
```typescript
// 해결방법: InternalAxiosRequestConfig 타입 사용
import { InternalAxiosRequestConfig } from 'axios';

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ✅ 올바른 타입
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
);
```

---

## ✅ Phase 2 완료 기준 및 검증

### 필수 완료 기준

#### 라우팅 시스템
- [ ] React Router v7 설정 완료
- [ ] 공개/보호 라우트 분리 동작
- [ ] 404 페이지 정상 표시
- [ ] 페이지 간 이동 정상 동작

#### API 클라이언트
- [ ] Axios 인스턴스 정상 생성
- [ ] JWT 토큰 자동 첨부
- [ ] 401 에러 처리 및 토큰 갱신
- [ ] 에러 정규화 및 로깅

#### 인증 시스템
- [ ] 로그인 기능 정상 동작
- [ ] 로그아웃 기능 정상 동작
- [ ] JWT 토큰 저장/조회/삭제
- [ ] 상태 유지 (새로고침 시)

#### 보호된 라우트
- [ ] ProtectedRoute 정상 동작
- [ ] 미인증 시 /login 리다이렉트
- [ ] 인증 후 대시보드 접근 가능

#### 기술적 품질
- [ ] TypeScript 컴파일 에러 0개
- [ ] ESLint 경고 0개
- [ ] 빌드 성공 (`npm run build`)

### 선택 완료 기준

#### 사용자 경험
- [ ] 로딩 상태 명확히 표시
- [ ] 에러 메시지 노인 친화적
- [ ] 폼 유효성 검사 동작
- [ ] 접근성 기준 충족

#### 성능
- [ ] 페이지 로딩 속도 1초 이내
- [ ] 번들 크기 적정 수준 유지
- [ ] 메모리 누수 없음

### 최종 검증 체크리스트

#### 1단계: 기능 테스트
```bash
npm run dev
# 브라우저에서 전체 플로우 테스트
```

- [ ] 로그인 → 대시보드 이동
- [ ] 새로고침 시 상태 유지
- [ ] 로그아웃 → 로그인 페이지
- [ ] 미인증 시 보호 라우트 접근 차단

#### 2단계: 서버 연동 테스트
- [ ] 실제 서버 API 호출 성공
- [ ] JWT 토큰 정상 저장
- [ ] 토큰 만료 시 갱신 또는 로그아웃

#### 3단계: 코드 품질 검사
```bash
npm run build
npm run lint
```

- [ ] TypeScript 컴파일 성공
- [ ] ESLint 검사 통과
- [ ] 불필요한 console.log 제거

#### 4단계: 문서 업데이트
- [ ] CURRENT_STATUS.md 업데이트
- [ ] 필요시 다른 문서 업데이트

---

## 🎯 Phase 2 완료 후 다음 단계

### Phase 3 준비사항
Phase 2 완료 후 다음 단계인 **Phase 3: 핵심 기능 구현** 준비를 위해:

1. **features 모듈 설계**
   - conversation (AI 대화)
   - daily-check (안부 확인)
   - guardian (보호자 관리)

2. **API 연동 확장**
   - 각 도메인별 API 모듈
   - TanStack Query 활용 데이터 페칭

3. **UI 컴포넌트 확장**
   - ChatMessage 컴포넌트
   - DailyCheckCard 컴포넌트
   - GuardianList 컴포넌트

### 지속적인 개선
Phase 2 완료 후에도 인증 시스템의 지속적인 개선이 필요합니다:

- 보안 강화 (토큰 암호화 등)
- 사용자 경험 개선
- 성능 최적화
- 에러 처리 고도화

---

**🚀 Phase 2 성공적 완료를 위해 이 가이드를 단계별로 따라 진행하세요!**

**📞 문제 발생 시**: 문제 해결 가이드를 참조하거나, 각 Day별 완료 기준을 다시 확인해보세요.

**📝 진행 상황 추적**: 각 체크리스트 항목을 완료할 때마다 체크 표시하여 진행 상황을 관리하세요.

**🎉 Phase 2를 완료하면 MARUNI 클라이언트의 핵심 인프라가 완성됩니다!**
