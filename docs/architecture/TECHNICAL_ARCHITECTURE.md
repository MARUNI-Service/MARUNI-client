# MARUNI Client 기술 아키텍처

## 🏗️ 아키텍처 개요

### 전체 시스템 구조
```
┌─────────────────────────────────────────┐
│              MARUNI Client              │
│            (React 19 PWA)               │
├─────────────────────────────────────────┤
│  Presentation Layer (pages/)            │
│  ├─ auth/ dashboard/ conversation/      │
│  ├─ guardians/ settings/               │
│  └─ Route Guards & Navigation          │
├─────────────────────────────────────────┤
│  Feature Layer (features/)             │
│  ├─ auth/ member/ conversation/        │
│  ├─ daily-check/ guardian/             │
│  ├─ alert/ notification/               │
│  └─ Domain-specific Business Logic     │
├─────────────────────────────────────────┤
│  Shared Layer (shared/)                │
│  ├─ components/ hooks/ utils/          │
│  ├─ constants/ types/                  │
│  └─ Common Utilities & UI Components   │
├─────────────────────────────────────────┤
│  Infrastructure Layer                  │
│  ├─ API Client (Axios)                │
│  ├─ State Management (Zustand)        │
│  ├─ Cache Management (TanStack Query)  │
│  └─ Storage (LocalStorage, PWA)       │
└─────────────────────────────────────────┘
                    │
                HTTP/HTTPS
                    │
┌─────────────────────────────────────────┐
│            MARUNI Server                │
│        (Spring Boot + JWT)              │
│   ✅ Phase 2 MVP 100% 완성             │
└─────────────────────────────────────────┘
```

## 📦 패키지 아키텍처

### 계층별 책임 분리
```typescript
// 1. App Layer - 앱 설정과 전역 상태
src/app/
├── App.tsx              // 메인 앱 컴포넌트
├── router.tsx           // 라우팅 설정
└── providers/           // 전역 Provider들
    ├── QueryProvider.tsx    // TanStack Query
    ├── AuthProvider.tsx     // 인증 Context
    └── ThemeProvider.tsx    // 테마 설정

// 2. Pages Layer - 화면 조합
src/pages/
├── auth/
│   ├── LoginPage.tsx        // 로그인 화면
│   ├── RegisterPage.tsx     // 회원가입 화면
│   └── index.ts             // Export
├── dashboard/
│   └── DashboardPage.tsx    // 메인 대시보드
├── conversation/
│   ├── ConversationPage.tsx // AI 대화 화면
│   └── HistoryPage.tsx      // 대화 이력
└── [도메인]/[페이지].tsx

// 3. Features Layer - 도메인별 비즈니스 로직
src/features/
├── auth/                    // 인증 도메인
│   ├── components/          // UI 컴포넌트
│   ├── hooks/               // 비즈니스 로직
│   ├── api/                 // API 통신
│   ├── store/               // 상태 관리
│   ├── types/               // 타입 정의
│   └── index.ts             // Public API
├── [도메인]/
└── 서버 6개 도메인 매핑

// 4. Shared Layer - 공통 모듈
src/shared/
├── components/ui/           // 재사용 UI 컴포넌트
├── hooks/                   // 공통 훅
├── utils/                   // 유틸리티 함수
├── constants/               // 상수
└── types/                   // 공통 타입
```

### Feature 모듈 상세 구조
```typescript
// 예시: features/auth/
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx
│   │   └── index.ts
│   ├── ProtectedRoute/
│   └── index.ts
├── hooks/
│   ├── useAuth.ts           // 인증 상태 훅
│   ├── useLogin.ts          // 로그인 로직
│   ├── useLogout.ts         // 로그아웃 로직
│   └── index.ts
├── api/
│   ├── authApi.ts           // API 함수들
│   └── index.ts
├── store/
│   ├── authStore.ts         // Zustand 스토어
│   └── index.ts
├── types/
│   ├── auth.types.ts        // 인증 관련 타입
│   └── index.ts
└── index.ts                 // Feature 전체 Export
```

## 🔧 기술 스택 상세

### Core Technologies
```json
{
  "framework": "React 19.1.1",
  "language": "TypeScript 5.8.3",
  "bundler": "Vite 7.1.7",
  "styling": "Tailwind CSS 4.1.13",
  "pwa": "vite-plugin-pwa 1.0.3"
}
```

### State Management
```typescript
// 1. Server State - TanStack Query v5.90.2
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 서버 데이터 캐싱 및 동기화
const { data, isLoading, error } = useQuery({
  queryKey: ['conversations'],
  queryFn: () => conversationApi.getHistory(),
  staleTime: 5 * 60 * 1000, // 5분
  cacheTime: 10 * 60 * 1000, // 10분
});

// 2. Client State - Zustand v5.0.8
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 클라이언트 전용 상태 (설정, UI 상태 등)
interface AppSettingsStore {
  fontSize: 'small' | 'medium' | 'large';
  darkMode: boolean;
  setFontSize: (size: string) => void;
  toggleDarkMode: () => void;
}

const useAppSettingsStore = create<AppSettingsStore>()(
  persist(
    (set) => ({
      fontSize: 'medium',
      darkMode: false,
      setFontSize: (fontSize) => set({ fontSize }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    { name: 'app-settings' }
  )
);
```

### API Client Architecture
```typescript
// shared/utils/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 요청 인터셉터 - JWT 토큰 자동 첨부
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터 - 토큰 갱신 및 에러 처리
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          return this.handleTokenRefresh(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleTokenRefresh(originalError: any) {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.redirectToLogin();
        return Promise.reject(originalError);
      }

      const response = await this.client.post('/auth/refresh', {
        refreshToken,
      });

      const { accessToken } = response.data;
      this.setAccessToken(accessToken);

      // 원래 요청 재시도
      const originalRequest = originalError.config;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return this.client(originalRequest);
    } catch (refreshError) {
      this.redirectToLogin();
      return Promise.reject(originalError);
    }
  }
}

export const apiClient = new ApiClient();
```

### Routing Architecture
```typescript
// app/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public Routes
      {
        path: 'auth',
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },
      // Protected Routes
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'conversation', element: <ConversationPage /> },
          { path: 'guardians', element: <GuardiansPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
      // 404 Page
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
```

## 📱 PWA 아키텍처

### Service Worker 전략
```typescript
// vite.config.ts PWA 설정
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      // API 응답 캐싱
      {
        urlPattern: /^https:\/\/api\.maruni\.com\/.*$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60, // 1시간
          },
        },
      },
      // 이미지 캐싱
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
          },
        },
      },
    ],
  },
})
```

### Offline 전략
```typescript
// features/conversation/hooks/useConversation.ts
export const useConversation = () => {
  const [offlineMessages, setOfflineMessages] = useLocalStorage<Message[]>(
    'offline-messages',
    []
  );

  const sendMessage = useMutation({
    mutationFn: conversationApi.sendMessage,
    onMutate: async (message) => {
      // Optimistic Update
      const optimisticMessage = {
        ...message,
        id: `temp-${Date.now()}`,
        status: 'sending' as const,
      };

      // 오프라인 시 로컬 저장
      if (!navigator.onLine) {
        setOfflineMessages(prev => [...prev, optimisticMessage]);
      }

      return { optimisticMessage };
    },
    onSuccess: (data, variables, context) => {
      // 성공 시 오프라인 메시지 제거
      setOfflineMessages(prev =>
        prev.filter(msg => msg.id !== context?.optimisticMessage.id)
      );
    },
  });

  // 네트워크 복구 시 오프라인 메시지 동기화
  useEffect(() => {
    const handleOnline = () => {
      offlineMessages.forEach(message => {
        sendMessage.mutate(message);
      });
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [offlineMessages]);
};
```

## 🔔 Push Notification 아키텍처

### FCM 통합
```typescript
// features/notification/api/fcmApi.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

class FCMService {
  private messaging: Messaging;

  constructor() {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    this.messaging = getMessaging(app);
  }

  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
        return token;
      }
      return null;
    } catch (error) {
      console.error('FCM permission error:', error);
      return null;
    }
  }

  onForegroundMessage(callback: (payload: any) => void) {
    return onMessage(this.messaging, callback);
  }
}

export const fcmService = new FCMService();
```

## 🧪 테스트 아키텍처

### 테스트 전략
```typescript
// 1. Unit Tests - Vitest + React Testing Library
// shared/components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// 2. Integration Tests - MSW
// features/auth/hooks/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server } from '@/test/server';
import { useAuth } from './useAuth';

describe('useAuth Hook', () => {
  it('logs in user successfully', async () => {
    server.use(
      rest.post('/api/auth/login', (req, res, ctx) => {
        return res(ctx.json({
          accessToken: 'test-token',
          user: { id: 1, name: 'Test User' }
        }));
      })
    );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        username: 'test',
        password: 'password'
      });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

## 🚀 성능 최적화 전략

### Code Splitting
```typescript
// 라우트별 코드 스플리팅
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ConversationPage = lazy(() => import('@/pages/conversation/ConversationPage'));

// Feature별 청크 분리
const AuthFeature = lazy(() => import('@/features/auth'));

// 조건부 로딩
const AdminPanel = lazy(() =>
  import('@/features/admin').then(module => ({
    default: module.AdminPanel
  }))
);
```

### Bundle Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 벤더 청크 분리
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@headlessui/react'],

          // Feature별 청크
          'auth-feature': ['./src/features/auth'],
          'conversation-feature': ['./src/features/conversation'],
        },
      },
    },
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
  },
});
```

### 메모리 최적화
```typescript
// React.memo와 useMemo 활용
export const ConversationItem = React.memo<ConversationItemProps>(
  ({ message, isAI }) => {
    const formattedTime = useMemo(
      () => formatMessageTime(message.timestamp),
      [message.timestamp]
    );

    return (
      <div className={isAI ? 'ai-message' : 'user-message'}>
        {message.content}
        <span>{formattedTime}</span>
      </div>
    );
  }
);

// useCallback으로 함수 메모이제이션
const handleSendMessage = useCallback(
  (content: string) => {
    sendMessage.mutate({ content, conversationId });
  },
  [conversationId, sendMessage]
);
```

## 📊 모니터링 및 분석

### 성능 모니터링
```typescript
// shared/utils/performance.ts
export class PerformanceMonitor {
  static measurePageLoad(pageName: string) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log(`Page Load Time for ${pageName}:`, entry.duration);
          // Analytics 서비스로 전송
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });
  }

  static measureUserInteraction(action: string) {
    performance.mark(`${action}-start`);

    return () => {
      performance.mark(`${action}-end`);
      performance.measure(action, `${action}-start`, `${action}-end`);
    };
  }
}
```

### 에러 추적
```typescript
// app/providers/ErrorProvider.tsx
export class ErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅 서비스로 전송
    console.error('Error Boundary caught an error:', error, errorInfo);

    // 사용자 친화적 에러 메시지 표시
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>문제가 발생했습니다</h2>
          <p>잠시 후 다시 시도해주세요</p>
          <button onClick={this.handleReset}>다시 시도</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

**🎯 이 기술 아키텍처는 확장성, 성능, 유지보수성을 고려하여 설계되었으며, 노인 친화적 사용자 경험을 제공하는 것을 최우선으로 합니다.**