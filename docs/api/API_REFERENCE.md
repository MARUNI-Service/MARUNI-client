# MARUNI API 레퍼런스 (클라이언트 개발 가이드)

**서버와 통신하기 위한 필수 API 레퍼런스 - 클라이언트 개발자용**

## 📋 개요

이 문서는 MARUNI 클라이언트 개발을 위한 실용적인 API 레퍼런스입니다. 각 API의 **사용법**, **요청/응답 형식**, **에러 처리**, **클라이언트 코드 예제**를 포함합니다.

### 🔑 기본 정보

- **Base URL**: `http://localhost:8080/api` (개발), `https://api.maruni.kro.kr/api` (운영)
- **인증 방식**: JWT Bearer Token (Authorization 헤더)
- **Content-Type**: `application/json`
- **응답 형식**: 공통 응답 래퍼 구조

---

## 🔐 인증 (Auth)

### 1. 로그인

**POST** `/members/login`

```typescript
// Request
const loginRequest = {
  memberEmail: "user@example.com",
  memberPassword: "password123"
};

// Response Headers
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// Set-Cookie: refresh=eyJhbGciOiJIUzI1NiIs...; HttpOnly

// Response Body
{
  "success": true,
  "code": "MEMBER_LOGIN_SUCCESS",
  "message": "로그인이 완료되었습니다",
  "data": null
}
```

**클라이언트 구현 예제:**

```typescript
// features/auth/api/authApi.ts
export const authApi = {
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post('/members/login', credentials);

    // Authorization 헤더에서 Access Token 추출
    const accessToken = response.headers.authorization?.replace('Bearer ', '');

    // Refresh Token은 HttpOnly 쿠키로 자동 저장됨

    return { accessToken };
  },
};
```

### 2. Access Token 재발급

**POST** `/auth/token/refresh`

```typescript
// Request (Refresh Token은 쿠키에 자동 포함)
// Cookie: refresh=eyJhbGciOiJIUzI1NiIs...

// Response
{
  "success": true,
  "code": "MEMBER_TOKEN_REISSUE_SUCCESS",
  "message": "토큰이 재발급되었습니다",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "refreshTokenIncluded": false
  }
}
```

**클라이언트 구현 예제:**

```typescript
// shared/api/client.ts - Axios 인터셉터
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Refresh Token으로 새 Access Token 발급
      const response = await apiClient.post('/auth/token/refresh');
      const newAccessToken = response.data.data.accessToken;

      // Zustand store 업데이트
      useAuthStore.getState().setAccessToken(newAccessToken);

      // 실패한 요청 재시도
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

### 3. 로그아웃

**POST** `/auth/logout`

```typescript
// Request Headers
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Response
{
  "success": true,
  "code": "MEMBER_LOGOUT_SUCCESS",
  "message": "로그아웃이 완료되었습니다",
  "data": null
}
```

---

## 👤 회원 관리 (Member)

### 1. 회원가입

**POST** `/join`

```typescript
// Request
const joinRequest = {
  memberEmail: "user@example.com",
  memberName: "김할머니",
  memberPassword: "password123"
};

// Response
{
  "success": true,
  "code": "MEMBER_JOIN_SUCCESS",
  "message": "회원가입이 완료되었습니다",
  "data": null
}
```

**클라이언트 구현 예제:**

```typescript
// features/auth/api/authApi.ts
export const authApi = {
  join: async (data: JoinRequest) => {
    await apiClient.post('/join', data);
  },

  checkEmail: async (email: string) => {
    const response = await apiClient.get('/join/email-check', {
      params: { memberEmail: email },
    });
    return response.data.data.available;
  },
};
```

### 2. 내 정보 조회

**GET** `/users/me`

```typescript
// Request Headers
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Response
{
  "success": true,
  "code": "SUCCESS",
  "message": "조회되었습니다",
  "data": {
    "id": 1,
    "memberName": "김할머니",
    "memberEmail": "user@example.com",
    "createdAt": "2025-01-15T10:30:00",
    "updatedAt": "2025-01-15T10:30:00"
  }
}
```

**클라이언트 구현 예제:**

```typescript
// features/member/api/memberApi.ts
export const memberApi = {
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data.data;
  },
};

// features/member/hooks/useMe.ts
export const useMe = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: memberApi.getMe,
  });
};
```

---

## 💬 AI 대화 (Conversation)

### 1. AI 대화 메시지 전송

**POST** `/conversations/messages`

```typescript
// Request
const messageRequest = {
  content: "오늘 기분이 좋아요!"
};

// Response
{
  "success": true,
  "code": "SUCCESS",
  "message": "성공적으로 처리되었습니다",
  "data": {
    "conversationId": 1,
    "userMessage": {
      "id": 1,
      "type": "USER_MESSAGE",
      "content": "오늘 기분이 좋아요!",
      "emotion": "POSITIVE",
      "createdAt": "2025-09-18T10:30:00"
    },
    "aiMessage": {
      "id": 2,
      "type": "AI_RESPONSE",
      "content": "기분이 좋으시다니 정말 다행이에요! 오늘 특별한 일이 있으셨나요?",
      "emotion": "NEUTRAL",
      "createdAt": "2025-09-18T10:30:03"
    }
  }
}
```

**클라이언트 구현 예제:**

```typescript
// features/conversation/api/conversationApi.ts
export const conversationApi = {
  sendMessage: async (content: string) => {
    const response = await apiClient.post('/conversations/messages', { content });
    return response.data.data;
  },
};

// features/conversation/hooks/useConversation.ts
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: conversationApi.sendMessage,
    onSuccess: data => {
      // 대화 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
```

---

## 👥 보호자 관리 (Guardian)

### 1. 보호자 생성

**POST** `/guardians`

```typescript
// Request
const guardianRequest = {
  guardianName: "김보호",
  guardianEmail: "guardian@example.com",
  guardianPhone: "010-1234-5678",
  relation: "FAMILY",
  notificationPreference: "ALL"
};

// Response
{
  "success": true,
  "code": "SUCCESS",
  "message": "성공적으로 처리되었습니다",
  "data": {
    "id": 1,
    "guardianName": "김보호",
    "guardianEmail": "guardian@example.com",
    // ...
  }
}
```

### 2. 현재 회원의 보호자 조회

**GET** `/guardians/my-guardian`

```typescript
// Request Headers
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Response
{
  "success": true,
  "code": "SUCCESS",
  "message": "성공적으로 처리되었습니다",
  "data": {
    "id": 1,
    "guardianName": "김보호",
    "guardianEmail": "guardian@example.com",
    "guardianPhone": "010-1234-5678",
    "relation": "FAMILY",
    "notificationPreference": "ALL",
    "isActive": true
  }
}
```

**클라이언트 구현 예제:**

```typescript
// features/guardian/api/guardianApi.ts
export const guardianApi = {
  getMyGuardian: async () => {
    const response = await apiClient.get('/guardians/my-guardian');
    return response.data.data;
  },

  assignGuardian: async (guardianId: number) => {
    await apiClient.post(`/guardians/${guardianId}/assign`);
  },
};

// features/guardian/hooks/useGuardian.ts
export const useMyGuardian = () => {
  return useQuery({
    queryKey: ['guardians', 'me'],
    queryFn: guardianApi.getMyGuardian,
  });
};
```

---

## 🚨 이상징후 알림 (AlertRule)

### 1. 알림 규칙 목록 조회

**GET** `/alert-rules`

```typescript
// Request Headers
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Response
{
  "success": true,
  "code": "SUCCESS",
  "message": "성공적으로 처리되었습니다",
  "data": [
    {
      "id": 1,
      "alertType": "EMOTION_PATTERN",
      "alertLevel": "HIGH",
      "ruleName": "연속 부정감정 감지 규칙",
      "condition": {
        "consecutiveDays": 3,
        "description": "3일 연속 부정감정 감지"
      },
      "isActive": true
    }
  ]
}
```

### 2. 알림 이력 조회

**GET** `/alert-rules/history?days=7`

```typescript
// Response
{
  "success": true,
  "code": "SUCCESS",
  "message": "성공적으로 처리되었습니다",
  "data": [
    {
      "id": 1,
      "alertType": "KEYWORD_DETECTION",
      "alertLevel": "EMERGENCY",
      "alertMessage": "긴급 키워드 감지: '아파요'",
      "isNotificationSent": true,
      "alertDate": "2025-09-17T15:20:00"
    }
  ]
}
```

**클라이언트 구현 예제:**

```typescript
// features/alert/api/alertApi.ts
export const alertApi = {
  getAlertRules: async () => {
    const response = await apiClient.get('/alert-rules');
    return response.data.data;
  },

  getAlertHistory: async (days: number = 30) => {
    const response = await apiClient.get('/alert-rules/history', {
      params: { days },
    });
    return response.data.data;
  },
};
```

---

## 🔔 공통 응답 형식

모든 API 응답은 다음 공통 형식을 따릅니다:

```typescript
interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
}
```

---

## ❌ 에러 처리

### 공통 에러 코드

| HTTP Status | Code                  | 설명             | 클라이언트 처리      |
| ----------- | --------------------- | ---------------- | -------------------- |
| 400         | INVALID_INPUT_VALUE   | 입력값 검증 실패 | 폼 유효성 검사       |
| 401         | UNAUTHORIZED          | 인증 실패        | 로그인 페이지로 이동 |
| 403         | TOKEN_EXPIRED         | 토큰 만료        | 자동 토큰 갱신       |
| 404         | NOT_FOUND             | 리소스 없음      | 404 페이지 표시      |
| 409         | DUPLICATE_EMAIL       | 이메일 중복      | 중복 메시지 표시     |
| 500         | INTERNAL_SERVER_ERROR | 서버 오류        | 오류 페이지 표시     |

### 에러 응답 형식

```typescript
{
  "success": false,
  "code": "INVALID_INPUT_VALUE",
  "message": "입력값이 올바르지 않습니다",
  "data": {
    "fieldErrors": [
      {
        "field": "memberEmail",
        "message": "올바른 이메일 형식이어야 합니다"
      }
    ]
  }
}
```

**클라이언트 에러 처리 예제:**

```typescript
// shared/api/client.ts
apiClient.interceptors.response.use(
  response => response,
  error => {
    const errorCode = error.response?.data?.code;
    const message = error.response?.data?.message;

    switch (errorCode) {
      case 'UNAUTHORIZED':
        // 로그인 페이지로 리다이렉트
        window.location.href = '/auth/login';
        break;
      case 'TOKEN_EXPIRED':
        // 자동 토큰 갱신 (인터셉터에서 처리)
        break;
      case 'INVALID_INPUT_VALUE':
        // 폼 에러 표시
        const fieldErrors = error.response?.data?.data?.fieldErrors;
        return Promise.reject({ fieldErrors, message });
      default:
        // 일반 에러 메시지 표시
        toast.error(message || '오류가 발생했습니다');
    }

    return Promise.reject(error);
  }
);
```

---

## 🎯 클라이언트 개발 체크리스트

### 인증 시스템

- [x] JWT Access Token 자동 첨부 (Axios 인터셉터)
- [x] 401 에러 시 자동 토큰 갱신
- [x] Refresh Token HttpOnly 쿠키 관리
- [x] 로그아웃 시 토큰 무효화

### API 연동

- [ ] 각 도메인별 API 모듈 생성 (authApi, memberApi, conversationApi 등)
- [ ] TanStack Query 훅 구현 (useQuery, useMutation)
- [ ] 에러 처리 및 토스트 메시지
- [ ] 로딩 상태 관리

### 타입 안전성

- [ ] API 요청/응답 TypeScript 인터페이스 정의
- [ ] Enum 타입 정의 (EmotionType, AlertLevel, GuardianRelation 등)
- [ ] 공통 타입 재사용

### 성능 최적화

- [ ] API 응답 캐싱 (TanStack Query)
- [ ] 낙관적 업데이트 (Optimistic Update)
- [ ] 무한 스크롤 구현 (필요시)

---

## 📚 관련 문서

- **[플로우 가이드](../flows/IMPLEMENTATION_FLOWS.md)**: 주요 기능별 구현 플로우
- **[기술 아키텍처](../architecture/TECHNICAL_ARCHITECTURE.md)**: API 통신 아키텍처
- **[Phase 3 가이드](../project/PHASE3_IMPLEMENTATION_GUIDE.md)**: 다음 개발 단계 가이드

---

**이 API 레퍼런스는 클라이언트 개발에 필요한 핵심 정보만 담고 있습니다. 각 API의 상세한 비즈니스 로직과 서버 측 구현은 서버 문서를 참조하세요.**
