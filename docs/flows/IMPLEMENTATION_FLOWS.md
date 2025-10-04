# MARUNI 클라이언트 구현 플로우 가이드

**주요 기능별 클라이언트 구현 플로우 - 실제 코드 작성 가이드**

## 📋 개요

이 문서는 MARUNI 클라이언트의 주요 기능 구현 플로우를 정리한 개발 가이드입니다. 각 기능별로 **필요한 페이지**, **API 호출**, **상태 관리**, **UI 컴포넌트**를 명확히 정의합니다.

---

## 🔐 인증 플로우

### 회원가입 → 로그인 → 대시보드 진입

```
[회원가입 페이지] (/auth/signup)
    ↓
1. 이메일 중복 확인
   GET /api/join/email-check?memberEmail=xxx
    ↓
2. 회원가입 폼 제출
   POST /api/join
   {
     memberEmail: "user@example.com",
     memberName: "김할머니",
     memberPassword: "password123"
   }
    ↓
[로그인 페이지] (/auth/login)
    ↓
3. 로그인 요청
   POST /api/members/login
   {
     memberEmail: "user@example.com",
     memberPassword: "password123"
   }
    ↓
4. Access Token 저장 (Zustand)
   Authorization 헤더에서 추출
   Refresh Token은 HttpOnly 쿠키 자동 저장
    ↓
[대시보드] (/)
    ↓
5. 사용자 정보 조회
   GET /api/users/me
```

### 클라이언트 구현

**페이지:**
- `pages/auth/SignupPage.tsx`
- `pages/auth/LoginPage.tsx`
- `pages/Dashboard.tsx`

**API 모듈:**
```typescript
// features/auth/api/authApi.ts
export const authApi = {
  checkEmail: async (email: string) => {
    const response = await apiClient.get('/join/email-check', {
      params: { memberEmail: email }
    });
    return response.data.data.available;
  },

  signup: async (data: SignupRequest) => {
    await apiClient.post('/join', data);
  },

  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post('/members/login', credentials);
    const accessToken = response.headers.authorization?.replace('Bearer ', '');
    return { accessToken };
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  }
};
```

**상태 관리:**
```typescript
// features/auth/stores/authStore.ts
interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      login: (token) => set({ accessToken: token, isAuthenticated: true }),
      logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
      setUser: (user) => set({ user })
    }),
    { name: 'auth-storage' }
  )
);
```

**훅:**
```typescript
// features/auth/hooks/useAuth.ts
export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ accessToken }) => {
      login(accessToken);
      navigate('/');
    }
  });
};

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      navigate('/auth/login');
    }
  });
};
```

---

## 💬 AI 대화 플로우

### 대화 목록 조회 → 메시지 전송 → 실시간 응답

```
[대화 페이지] (/conversation)
    ↓
1. 대화 세션 조회 (선택 사항)
   GET /api/conversations/{conversationId}
    ↓
2. 사용자 메시지 입력
   "오늘 기분이 좋아요!"
    ↓
3. 메시지 전송 + AI 응답 수신
   POST /api/conversations/messages
   {
     content: "오늘 기분이 좋아요!"
   }
    ↓
4. 응답 받기
   {
     conversationId: 1,
     userMessage: { content: "오늘 기분이 좋아요!", emotion: "POSITIVE" },
     aiMessage: { content: "기분이 좋으시다니 다행이에요!", emotion: "NEUTRAL" }
   }
    ↓
5. UI 업데이트
   - 사용자 메시지 말풍선 추가
   - AI 응답 말풍선 추가
   - 감정 아이콘 표시
```

### 클라이언트 구현

**페이지:**
- `pages/ConversationPage.tsx`

**API 모듈:**
```typescript
// features/conversation/api/conversationApi.ts
export const conversationApi = {
  sendMessage: async (content: string) => {
    const response = await apiClient.post('/conversations/messages', { content });
    return response.data.data;
  }
};
```

**훅:**
```typescript
// features/conversation/hooks/useConversation.ts
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: conversationApi.sendMessage,
    onMutate: async (newMessage) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ['conversation'] });

      const previousMessages = queryClient.getQueryData(['conversation']);

      queryClient.setQueryData(['conversation'], (old: Message[]) => [
        ...old,
        {
          type: 'USER_MESSAGE',
          content: newMessage,
          createdAt: new Date().toISOString(),
          emotion: 'NEUTRAL'
        }
      ]);

      return { previousMessages };
    },
    onSuccess: (data) => {
      // 실제 서버 응답으로 교체
      queryClient.setQueryData(['conversation'], (old: Message[]) => [
        ...old.slice(0, -1), // 낙관적 메시지 제거
        data.userMessage,
        data.aiMessage
      ]);
    },
    onError: (err, newMessage, context) => {
      // 롤백
      queryClient.setQueryData(['conversation'], context?.previousMessages);
    }
  });
};
```

**컴포넌트:**
```typescript
// features/conversation/components/ConversationView.tsx
export const ConversationView = () => {
  const [input, setInput] = useState('');
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(input);
    setInput('');
  };

  return (
    <div className="conversation-container">
      <MessageList />
      <form onSubmit={handleSubmit}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <LoadingSpinner /> : '전송'}
        </Button>
      </form>
    </div>
  );
};
```

---

## 👥 보호자 설정 플로우

### 보호자 생성 → 관계 설정 → 알림 확인

```
[보호자 설정 페이지] (/settings/guardian)
    ↓
1. 현재 보호자 조회
   GET /api/guardians/my-guardian
    ↓
2-A. 보호자 없음: 새 보호자 생성
   POST /api/guardians
   {
     guardianName: "김보호",
     guardianEmail: "guardian@example.com",
     guardianPhone: "010-1234-5678",
     relation: "FAMILY",
     notificationPreference: "ALL"
   }
    ↓
2-B. 보호자 생성 후 관계 설정
   POST /api/guardians/{guardianId}/assign
    ↓
3. 보호자 정보 표시
   - 이름, 이메일, 전화번호
   - 관계 (가족/친구/돌봄제공자 등)
   - 알림 설정 (푸시/이메일/SMS/전체)
```

### 클라이언트 구현

**페이지:**
- `pages/settings/GuardianSettingsPage.tsx`

**API 모듈:**
```typescript
// features/guardian/api/guardianApi.ts
export const guardianApi = {
  getMyGuardian: async () => {
    const response = await apiClient.get('/guardians/my-guardian');
    return response.data.data;
  },

  createGuardian: async (data: CreateGuardianRequest) => {
    const response = await apiClient.post('/guardians', data);
    return response.data.data;
  },

  assignGuardian: async (guardianId: number) => {
    await apiClient.post(`/guardians/${guardianId}/assign`);
  },

  removeGuardian: async () => {
    await apiClient.delete('/guardians/remove-guardian');
  }
};
```

**훅:**
```typescript
// features/guardian/hooks/useGuardian.ts
export const useMyGuardian = () => {
  return useQuery({
    queryKey: ['guardians', 'me'],
    queryFn: guardianApi.getMyGuardian,
    retry: false // 404는 보호자 없음으로 처리
  });
};

export const useCreateAndAssignGuardian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGuardianRequest) => {
      const guardian = await guardianApi.createGuardian(data);
      await guardianApi.assignGuardian(guardian.id);
      return guardian;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians', 'me'] });
    }
  });
};
```

---

## 🚨 알림 이력 조회 플로우

### 알림 이력 목록 → 상세 정보 확인

```
[알림 페이지] (/alerts)
    ↓
1. 알림 이력 조회 (최근 30일)
   GET /api/alert-rules/history?days=30
    ↓
2. 알림 목록 표시
   - 알림 레벨 (EMERGENCY/HIGH/MEDIUM/LOW)
   - 알림 메시지
   - 감지 시간
   - 발송 여부
    ↓
3. 알림 상세 정보
   - 감지된 패턴
   - 감정 분석 결과
   - 보호자 알림 발송 결과
```

### 클라이언트 구현

**페이지:**
- `pages/AlertHistoryPage.tsx`

**API 모듈:**
```typescript
// features/alert/api/alertApi.ts
export const alertApi = {
  getAlertHistory: async (days: number = 30) => {
    const response = await apiClient.get('/alert-rules/history', {
      params: { days }
    });
    return response.data.data;
  },

  getAlertRules: async () => {
    const response = await apiClient.get('/alert-rules');
    return response.data.data;
  }
};
```

**훅:**
```typescript
// features/alert/hooks/useAlert.ts
export const useAlertHistory = (days: number = 30) => {
  return useQuery({
    queryKey: ['alerts', 'history', days],
    queryFn: () => alertApi.getAlertHistory(days)
  });
};
```

**컴포넌트:**
```typescript
// features/alert/components/AlertHistoryList.tsx
export const AlertHistoryList = () => {
  const { data: alerts, isLoading } = useAlertHistory(30);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="alert-history-list">
      {alerts?.map((alert) => (
        <AlertHistoryCard
          key={alert.id}
          alert={alert}
          levelColor={getAlertLevelColor(alert.alertLevel)}
        />
      ))}
    </div>
  );
};

const getAlertLevelColor = (level: AlertLevel) => {
  switch (level) {
    case 'EMERGENCY': return 'bg-red-500';
    case 'HIGH': return 'bg-orange-500';
    case 'MEDIUM': return 'bg-yellow-500';
    case 'LOW': return 'bg-blue-500';
  }
};
```

---

## 🔄 자동 토큰 갱신 플로우

### 401 에러 감지 → Refresh Token으로 재발급 → 재시도

```
[모든 API 요청]
    ↓
1. Access Token 첨부
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
    ↓
2-A. 요청 성공 (200)
   → 응답 반환
    ↓
2-B. 401 에러 (Token Expired)
    ↓
3. Refresh Token으로 재발급
   POST /api/auth/token/refresh
   (Refresh Token은 쿠키에 자동 포함)
    ↓
4. 새 Access Token 저장
   Zustand store 업데이트
    ↓
5. 실패한 요청 재시도
   새 Access Token으로 원래 요청 재실행
    ↓
6. 응답 반환
```

### 클라이언트 구현

```typescript
// shared/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true // Refresh Token 쿠키 포함
});

// Request 인터셉터: Access Token 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response 인터셉터: 401 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh Token으로 새 Access Token 발급
        const response = await apiClient.post('/auth/token/refresh');
        const newAccessToken = response.data.data.accessToken;

        // Store 업데이트
        useAuthStore.getState().login(newAccessToken);

        // 실패한 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료 → 로그아웃
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 📊 데이터 타입 정의

### 공통 타입

```typescript
// shared/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  data: {
    fieldErrors?: FieldError[];
  } | null;
}
```

### 도메인별 타입

```typescript
// features/auth/types/auth.ts
export interface User {
  id: number;
  memberName: string;
  memberEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  memberEmail: string;
  memberPassword: string;
}

export interface SignupRequest {
  memberEmail: string;
  memberName: string;
  memberPassword: string;
}

// features/conversation/types/conversation.ts
export type EmotionType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type MessageType = 'USER_MESSAGE' | 'AI_RESPONSE' | 'SYSTEM_MESSAGE';

export interface Message {
  id: number;
  type: MessageType;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

export interface ConversationResponse {
  conversationId: number;
  userMessage: Message;
  aiMessage: Message;
}

// features/guardian/types/guardian.ts
export type GuardianRelation = 'FAMILY' | 'FRIEND' | 'CAREGIVER' | 'NEIGHBOR' | 'OTHER';
export type NotificationPreference = 'PUSH' | 'EMAIL' | 'SMS' | 'ALL';

export interface Guardian {
  id: number;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string | null;
  relation: GuardianRelation;
  notificationPreference: NotificationPreference;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// features/alert/types/alert.ts
export type AlertType = 'EMOTION_PATTERN' | 'NO_RESPONSE' | 'KEYWORD_DETECTION';
export type AlertLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface AlertHistory {
  id: number;
  alertType: AlertType;
  alertLevel: AlertLevel;
  alertMessage: string;
  detectionDetails: string;
  isNotificationSent: boolean;
  alertDate: string;
  createdAt: string;
}
```

---

## 🎯 구현 우선순위 (Phase 3)

### 1단계: 인증 및 기본 UI
- [x] JWT 인증 시스템
- [ ] 회원가입 페이지
- [ ] 로그인 페이지
- [ ] 자동 토큰 갱신

### 2단계: 핵심 기능
- [ ] AI 대화 페이지
- [ ] 대화 히스토리 조회
- [ ] 실시간 메시지 송수신

### 3단계: 부가 기능
- [ ] 보호자 설정 페이지
- [ ] 알림 이력 조회
- [ ] 사용자 프로필 수정

### 4단계: 고도화
- [ ] 푸시 알림 수신
- [ ] 오프라인 모드
- [ ] PWA 최적화

---

## 📚 관련 문서

- **[API 레퍼런스](../api/API_REFERENCE.md)**: 각 API의 상세 명세
- **[기술 아키텍처](../architecture/TECHNICAL_ARCHITECTURE.md)**: 시스템 아키텍처
- **[Phase 3 가이드](../project/PHASE3_IMPLEMENTATION_GUIDE.md)**: 다음 개발 단계 상세 가이드

---

**이 플로우 가이드는 실제 코드 작성 시 참고할 수 있는 구체적인 구현 예제를 포함하고 있습니다. 각 기능별로 필요한 페이지, API, 상태 관리, 훅을 명확히 정의하여 개발 속도를 높일 수 있습니다.**
