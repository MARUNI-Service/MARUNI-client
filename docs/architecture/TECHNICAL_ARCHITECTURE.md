# MARUNI Client 기술 아키텍처

> 노인 돌봄 AI 서비스 **MARUNI** 클라이언트의 고수준 시스템 아키텍처 설계

## 🔗 관련 문서
- 📋 [기술 스택](../TECH_STACK.md) - 사용 기술 상세 정보
- 📁 [패키지 구조](../development/PACKAGE_STRUCTURE.md) - 구현 구조 가이드
- 🎨 [디자인 시스템](./DESIGN_SYSTEM.md) - UI/UX 설계
- 📈 [현재 상태](../project/CURRENT_STATUS.md) - 현재 구현 상태

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

> **상세한 패키지 구조**: [패키지 구조 문서](../development/PACKAGE_STRUCTURE.md) 참조

4계층 아키텍처 구조:
- **App Layer**: 앱 설정과 전역 상태 관리
- **Pages Layer**: 화면 조합 및 라우팅
- **Features Layer**: 도메인별 비즈니스 로직 (서버 도메인과 매핑)
- **Shared Layer**: 공통 모듈 및 재사용 컴포넌트

## 🔧 기술 아키텍처 개념

> **상세한 기술 스택 정보는 [TECH_STACK.md](../TECH_STACK.md)를 참조하세요.**

### 아키텍처 설계 원칙
- **계층 분리**: 명확한 책임 분담으로 유지보수성 향상
- **도메인 중심**: 서버 도메인과 일치하는 Feature 구조
- **확장성**: 새로운 기능 추가시 기존 코드 영향 최소화
- **접근성 우선**: 노인 사용자를 위한 설계

### 상태 관리 아키텍처

**이원화된 상태 관리 전략:**
- **서버 상태**: TanStack Query로 캐싱, 동기화, 낙관적 업데이트
- **클라이언트 상태**: Zustand로 가벼운 전역 상태 관리

```typescript
// 서버 상태 예시 - 대화 기록
const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: conversationApi.getHistory,
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });
};

// 클라이언트 상태 예시 - 앱 설정
const useAppSettings = create<AppSettings>()(persist(
  (set) => ({
    fontSize: 'medium',
    theme: 'light',
    // ...
  }),
  { name: 'app-settings' }
));
```

### API 통신 아키텍처

**핵심 설계 원칙:**
- **JWT 자동 갱신**: 사용자 경험 중단 없는 토큰 관리
- **에러 처리**: 네트워크 오류, 인증 오류 체계적 처리
- **타입 안전성**: TypeScript로 API 응답 타입 보장

```typescript
// API 클라이언트 구조
class ApiClient {
  // 1. 요청 인터셉터: JWT 토큰 자동 첨부
  // 2. 응답 인터셉터: 401 오류시 토큰 갱신 및 재시도
  // 3. 에러 정규화: 일관된 에러 객체 반환
  // 4. 타임아웃 관리: 네트워크 상황 대응
}

// Feature별 API 모듈
auth/api/authApi.ts        // 인증 관련 API
member/api/memberApi.ts    // 회원 관리 API
conversation/api/chatApi.ts // 대화 API
// ...
```

> **구현된 API 클라이언트**: `src/shared/utils/api.ts` 참조

### 라우팅 아키텍처

**계층적 라우팅 구조:**
- **보호된 라우트**: 인증 필요 페이지들
- **공개 라우트**: 로그인, 회원가입 등
- **에러 경계**: 라우트 레벨 에러 처리

```typescript
// 라우팅 구조 개념
/ (루트)
├── /auth/* (공개)
│   ├── /login
│   └── /register
└── /app/* (보호됨)
    ├── /dashboard
    ├── /conversation
    ├── /guardians
    └── /settings

// 인증 가드 적용
const protectedRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  // ...
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