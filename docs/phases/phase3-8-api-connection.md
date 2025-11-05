# MARUNI API 연결 실행 계획

**작성일**: 2025-10-29
**버전**: 1.0.0
**상태**: Phase 3-8 API 연결 계획

---

## 📋 의사결정 요약

### 핵심 결정 사항

- ✅ **토큰 전략**: Access Token만 사용 (1시간 유효, Refresh Token 없음)
  - 만료 시 자동 로그아웃 후 재로그인 필요
  - 향후 Refresh Token 추가 가능 (Phase 3-9 이후)

- ✅ **로그인 플로우**: 2단계 처리
  1. `POST /api/auth/login` → 헤더에서 토큰 추출
  2. `GET /api/members/me` → 사용자 정보 조회
  - 향후 서버 개선 시 1단계로 통합 가능

- ✅ **응답 구조**: 서버 구조 그대로 사용
  ```typescript
  interface CommonApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    data: T | null;
  }
  ```

- ✅ **구현 범위**: 전체 도메인 순차적 연결
  - Auth → Member → Conversation → Guardian → AlertRule

### 참고 문서

- **API 명세**: `docs/api-spec.md`
- **API 플로우**: `docs/flows/api-flow.md`
- **코딩 컨벤션**: `docs/development/CODING_CONVENTIONS.md`
- **기술 아키텍처**: `docs/architecture/TECHNICAL_ARCHITECTURE.md`

---

## 🎯 Phase 1: 공통 기반 작업 (Foundation)

### 목표
서버 응답 구조와 일치하는 타입 정의 및 API 클라이언트 기반 구축

### 작업 항목

#### 1.1 타입 정의 수정

**파일**: `src/shared/types/common.ts`

**변경 사항**:
```typescript
// Before
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: number;
  timestamp: string;
}

// After
export interface CommonApiResponse<T = unknown> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T | null;
}
```

**작업**:
- [ ] `CommonApiResponse<T>` 인터페이스 정의
- [ ] 기존 `ApiResponse` 타입 제거 또는 deprecated 처리
- [ ] 모든 API 함수에서 `CommonApiResponse` 사용

---

#### 1.2 API 엔드포인트 확장

**파일**: `src/shared/constants/api.ts`

**변경 사항**:
```typescript
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
  },

  // 회원가입
  JOIN: {
    SIGNUP: '/join',
    EMAIL_CHECK: '/join/email-check',
  },

  // 회원 관리
  MEMBERS: {
    ME: '/members/me',
    SEARCH: '/members/search',
    UPDATE_ME: '/members/me',
    DELETE_ME: '/members/me',
    MANAGED_MEMBERS: '/members/me/managed-members',
    DAILY_CHECK: '/members/me/daily-check',
    REMOVE_GUARDIAN: '/members/me/guardian',
  },

  // AI 대화
  CONVERSATIONS: {
    SEND_MESSAGE: '/conversations/messages',
    HISTORY: '/conversations/history',
  },

  // 보호자 관계
  GUARDIANS: {
    REQUESTS: '/guardians/requests',
    ACCEPT: (id: number) => `/guardians/requests/${id}/accept`,
    REJECT: (id: number) => `/guardians/requests/${id}/reject`,
  },

  // 이상징후 감지
  ALERT_RULES: {
    LIST: '/alert-rules',
    DETAIL: (id: number) => `/alert-rules/${id}`,
    CREATE: '/alert-rules',
    UPDATE: (id: number) => `/alert-rules/${id}`,
    DELETE: (id: number) => `/alert-rules/${id}`,
    TOGGLE: (id: number) => `/alert-rules/${id}/toggle`,
    HISTORY: '/alert-rules/history',
    HISTORY_DETAIL: (id: number) => `/alert-rules/history/${id}`,
    DETECT: '/alert-rules/detect',
  },
} as const;
```

**작업**:
- [ ] 전체 도메인 엔드포인트 상수 추가
- [ ] 동적 URL 생성 함수 추가 (예: `ACCEPT: (id) => ...`)
- [ ] BASE_URL 설정 확인 (`http://localhost:8080/api`)

---

#### 1.3 API 인터셉터 구현

**파일**: `src/shared/api/client.ts`

**구현 내용**:

##### Request 인터셉터
```typescript
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
```

##### Response 인터셉터
```typescript
apiClient.interceptors.response.use(
  (response) => {
    // 로그인 응답인 경우 헤더에서 토큰 추출
    const authHeader = response.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      localStorage.setItem('access_token', token);
    }

    return response;
  },
  (error) => {
    // 401 Unauthorized - 자동 로그아웃
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);
```

**작업**:
- [ ] Request 인터셉터: JWT 토큰 자동 추가
- [ ] Response 인터셉터: 로그인 응답 토큰 추출
- [ ] Response 인터셉터: 401 에러 자동 로그아웃
- [ ] 에러 헬퍼 함수 업데이트 (`getApiErrorMessage`, `getApiErrorCode`)

---

#### 1.4 공통 타입 추가

**새 파일**: `src/shared/types/enums.ts`

**추가 타입**:
```typescript
// 보호자 관계
export type GuardianRelation =
  | 'FAMILY'      // 가족
  | 'FRIEND'      // 친구
  | 'CAREGIVER'   // 돌봄제공자
  | 'NEIGHBOR'    // 이웃
  | 'OTHER';      // 기타

// 요청 상태
export type RequestStatus =
  | 'PENDING'     // 대기중
  | 'ACCEPTED'    // 수락됨
  | 'REJECTED';   // 거절됨

// 메시지 타입
export type MessageType =
  | 'USER_MESSAGE'   // 사용자 메시지
  | 'AI_RESPONSE'    // AI 응답
  | 'SYSTEM_MESSAGE'; // 시스템 메시지

// 감정 분석 결과
export type EmotionType =
  | 'POSITIVE'   // 긍정
  | 'NEGATIVE'   // 부정
  | 'NEUTRAL';   // 중립

// 알림 유형
export type AlertType =
  | 'EMOTION_PATTERN'    // 감정 패턴 분석
  | 'NO_RESPONSE'        // 무응답 패턴 분석
  | 'KEYWORD_DETECTION'; // 키워드 감지

// 알림 레벨
export type AlertLevel =
  | 'EMERGENCY'  // 긴급 (즉시 알림)
  | 'HIGH'       // 높음
  | 'MEDIUM'     // 중간
  | 'LOW';       // 낮음
```

**작업**:
- [ ] 공통 Enum 타입 정의
- [ ] `src/shared/types/index.ts`에서 export

---

### Phase 1 완료 기준

- ✅ `CommonApiResponse<T>` 타입 정의 완료
- ✅ 전체 API 엔드포인트 상수 정의 완료
- ✅ Request/Response 인터셉터 구현 완료
- ✅ 공통 Enum 타입 정의 완료
- ✅ `npm run build` 에러 없음

---

## 🔐 Phase 2: Auth & Member (인증 및 회원 관리)

### 목표
로그인/회원가입 및 회원 정보 관리 API 연결

### 작업 항목

#### 2.1 Auth 타입 수정

**파일**: `src/features/auth/types/auth.types.ts`

**수정 사항**:
```typescript
// LoginRequest 수정
export interface LoginRequest {
  memberEmail: string;    // username → memberEmail
  memberPassword: string; // password → memberPassword
}

// LoginResponse 제거 (토큰은 헤더로만 받음)

// User 타입 수정
export interface User extends BaseEntity {
  id: number;
  memberName: string;
  memberEmail: string;
  dailyCheckEnabled: boolean;
  hasPushToken: boolean;

  // Guardian 구조 수정
  guardian: {
    memberId: number;
    memberName: string;
    memberEmail: string;
    relation: GuardianRelation;
  } | null;

  // ManagedMembers 구조 수정
  managedMembers: Array<{
    memberId: number;
    memberName: string;
    memberEmail: string;
    relation: GuardianRelation;
    dailyCheckEnabled: boolean;
    lastDailyCheckAt: string | null; // ISO 8601
  }>;

  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// RefreshTokenResponse 제거

// AuthState 수정
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  // refreshToken 제거
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginRequest) => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<void>;
  logout: () => void;
  // refreshAccessToken 제거
  setUser: (user: User | null) => void;
  setToken: (accessToken: string) => void; // setTokens → setToken
  clearError: () => void;
}
```

**작업**:
- [ ] `LoginRequest` 필드명 변경
- [ ] `LoginResponse` 제거
- [ ] `RefreshTokenResponse` 제거
- [ ] `User` 타입 구조 수정 (guardian, managedMembers)
- [ ] `AuthState`에서 `refreshToken` 제거
- [ ] 불필요한 타입 정리

---

#### 2.2 Auth API 함수 재구현

**파일**: `src/features/auth/api/authApi.ts`

**구현 내용**:
```typescript
/**
 * 로그인 API
 * 1. POST /api/auth/login → 헤더에서 토큰 추출
 * 2. GET /api/members/me → 사용자 정보 조회
 */
export async function login(credentials: LoginRequest): Promise<{
  accessToken: string;
  user: User
}> {
  // 1. 로그인 요청
  const loginResponse = await apiClient.post<CommonApiResponse<null>>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  // 2. 헤더에서 토큰 추출 (인터셉터에서 자동으로 localStorage에 저장)
  const authHeader = loginResponse.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('로그인 응답에 토큰이 없습니다');
  }
  const accessToken = authHeader.substring(7);

  // 3. 사용자 정보 조회
  const userResponse = await apiClient.get<CommonApiResponse<User>>(
    API_ENDPOINTS.MEMBERS.ME
  );

  if (!userResponse.data.isSuccess || !userResponse.data.data) {
    throw new Error('사용자 정보 조회 실패');
  }

  return {
    accessToken,
    user: userResponse.data.data,
  };
}

/**
 * 로그아웃 API
 * - 클라이언트 전용 (서버 호출 불필요)
 */
export async function logout(): Promise<void> {
  localStorage.removeItem('access_token');
  return Promise.resolve();
}
```

**작업**:
- [ ] `login()` 2단계 처리 구현
- [ ] `logout()` 간소화 (로컬 스토리지만 처리)
- [ ] `refreshAccessToken()` 제거
- [ ] 에러 처리 개선

---

#### 2.3 Auth Store 수정

**파일**: `src/features/auth/store/useAuthStore.ts`

**수정 사항**:
```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      // refreshToken 제거
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          // Mock 데이터 제거, 실제 API 호출
          const { accessToken, user } = await authApi.login(credentials);

          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = getApiErrorMessage(error);
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      signup: async (credentials: SignupRequest) => {
        set({ isLoading: true, error: null });

        try {
          await authApi.signup(credentials);

          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = getApiErrorMessage(error);
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        authApi.logout();
      },

      // refreshAccessToken 제거

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setToken: (accessToken: string) => {
        set({
          accessToken,
          isAuthenticated: true,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      // refreshToken 제거
    }
  )
);
```

**작업**:
- [ ] Mock 데이터 (`MOCK_USERS`) 완전 제거
- [ ] `refreshToken` 필드 제거
- [ ] `login()` 실제 API 호출로 변경
- [ ] `refreshAccessToken()` 메서드 제거
- [ ] persist 설정 정리

---

#### 2.4 Join API 추가

**새 파일**: `src/features/auth/api/joinApi.ts`

**구현 내용**:
```typescript
import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { CommonApiResponse } from '@/shared/types/common';
import type { SignupRequest, User } from '../types';

/**
 * 이메일 중복 확인
 */
export async function checkEmailAvailability(email: string): Promise<{
  available: boolean;
  email: string;
}> {
  const response = await apiClient.get<CommonApiResponse<{
    available: boolean;
    email: string;
  }>>(
    `${API_ENDPOINTS.JOIN.EMAIL_CHECK}?memberEmail=${encodeURIComponent(email)}`
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '이메일 확인 실패');
  }

  return response.data.data;
}

/**
 * 회원가입
 */
export async function signup(request: SignupRequest): Promise<User> {
  const response = await apiClient.post<CommonApiResponse<User>>(
    API_ENDPOINTS.JOIN.SIGNUP,
    {
      memberEmail: request.email,
      memberName: request.name,
      memberPassword: request.password,
      dailyCheckEnabled: true, // 기본값
    }
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '회원가입 실패');
  }

  return response.data.data;
}
```

**작업**:
- [ ] `checkEmailAvailability()` 구현
- [ ] `signup()` 구현
- [ ] 타입 정의 추가 (`SignupRequest`)

---

#### 2.5 Member API 추가

**새 파일**: `src/features/member/api/memberApi.ts`

**구현 내용**:
```typescript
/**
 * 내 정보 조회
 */
export async function getMyInfo(): Promise<User> {
  const response = await apiClient.get<CommonApiResponse<User>>(
    API_ENDPOINTS.MEMBERS.ME
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '내 정보 조회 실패');
  }

  return response.data.data;
}

/**
 * 내 정보 수정
 */
export async function updateMyInfo(request: UpdateMemberRequest): Promise<User> {
  const response = await apiClient.put<CommonApiResponse<User>>(
    API_ENDPOINTS.MEMBERS.UPDATE_ME,
    request
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '정보 수정 실패');
  }

  return response.data.data;
}

/**
 * 내 계정 삭제
 */
export async function deleteMyAccount(): Promise<void> {
  await apiClient.delete<CommonApiResponse<null>>(
    API_ENDPOINTS.MEMBERS.DELETE_ME
  );
}

/**
 * 회원 검색 (이메일)
 */
export async function searchMember(email: string): Promise<User> {
  const response = await apiClient.get<CommonApiResponse<User>>(
    `${API_ENDPOINTS.MEMBERS.SEARCH}?email=${encodeURIComponent(email)}`
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '회원 검색 실패');
  }

  return response.data.data;
}

/**
 * 내가 돌보는 사람들 목록
 */
export async function getManagedMembers(): Promise<User[]> {
  const response = await apiClient.get<CommonApiResponse<User[]>>(
    API_ENDPOINTS.MEMBERS.MANAGED_MEMBERS
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '목록 조회 실패');
  }

  return response.data.data;
}

/**
 * 안부 메시지 설정 변경
 */
export async function updateDailyCheckSetting(enabled: boolean): Promise<User> {
  const response = await apiClient.patch<CommonApiResponse<User>>(
    `${API_ENDPOINTS.MEMBERS.DAILY_CHECK}?enabled=${enabled}`
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '설정 변경 실패');
  }

  return response.data.data;
}

/**
 * 보호자 관계 해제
 */
export async function removeGuardian(): Promise<void> {
  await apiClient.delete<CommonApiResponse<null>>(
    API_ENDPOINTS.MEMBERS.REMOVE_GUARDIAN
  );
}
```

**작업**:
- [ ] 모든 Member API 함수 구현
- [ ] 타입 정의 추가 (`UpdateMemberRequest`)

---

#### 2.6 Member 타입 정의

**새 파일**: `src/features/member/types/member.types.ts`

**타입 정의**:
```typescript
export interface UpdateMemberRequest {
  memberEmail: string;
  memberName: string;
  memberPassword: string;
}

export interface ManagedMemberResponse {
  memberId: number;
  memberName: string;
  memberEmail: string;
  relation: GuardianRelation;
  dailyCheckEnabled: boolean;
  lastDailyCheckAt: string | null;
}
```

**작업**:
- [ ] Member 관련 타입 정의
- [ ] `src/features/member/types/index.ts`에서 export

---

### Phase 2 완료 기준

- ✅ 로그인 성공 시 토큰 저장 및 사용자 정보 조회
- ✅ 로그아웃 시 토큰 제거 및 상태 초기화
- ✅ 회원가입 성공 후 로그인 페이지 이동
- ✅ 이메일 중복 확인 동작
- ✅ 내 정보 조회/수정/삭제 API 호출 성공
- ✅ 회원 검색 동작
- ✅ 돌보는 사람 목록 조회 성공
- ✅ 안부 메시지 설정 변경 성공
- ✅ 보호자 관계 해제 성공
- ✅ `npm run build` 에러 없음

---

## 💬 Phase 3: Conversation (AI 대화)

### 목표
AI 대화 메시지 전송 및 대화 내역 조회 API 연결

### 작업 항목

#### 3.1 Conversation 타입 정의

**새 파일**: `src/features/conversation/types/conversation.types.ts`

**타입 정의**:
```typescript
import type { MessageType, EmotionType } from '@/shared/types/enums';

export interface SendMessageRequest {
  content: string; // 최대 500자
}

export interface MessageDto {
  id: number;
  type: MessageType;
  content: string;
  emotion: EmotionType | null;
  createdAt: string; // ISO 8601
}

export interface ConversationResponseDto {
  conversationId: number;
  userMessage: MessageDto;
  aiMessage: MessageDto;
}
```

**작업**:
- [ ] Conversation 타입 정의
- [ ] `src/features/conversation/types/index.ts`에서 export

---

#### 3.2 Conversation API 구현

**새 파일**: `src/features/conversation/api/conversationApi.ts`

**구현 내용**:
```typescript
/**
 * AI 대화 메시지 전송
 */
export async function sendMessage(request: SendMessageRequest): Promise<ConversationResponseDto> {
  if (request.content.length > 500) {
    throw new Error('메시지는 500자를 초과할 수 없습니다');
  }

  const response = await apiClient.post<CommonApiResponse<ConversationResponseDto>>(
    API_ENDPOINTS.CONVERSATIONS.SEND_MESSAGE,
    request
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '메시지 전송 실패');
  }

  return response.data.data;
}

/**
 * 대화 내역 조회
 */
export async function getHistory(days: number = 7): Promise<MessageDto[]> {
  const response = await apiClient.get<CommonApiResponse<MessageDto[]>>(
    `${API_ENDPOINTS.CONVERSATIONS.HISTORY}?days=${days}`
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '대화 내역 조회 실패');
  }

  return response.data.data;
}
```

**작업**:
- [ ] `sendMessage()` 구현 (500자 제한 검증 포함)
- [ ] `getHistory()` 구현 (days 파라미터 기본값 7)

---

#### 3.3 Conversation Store (선택사항)

**새 파일**: `src/features/conversation/store/useConversationStore.ts`

**구현 내용**:
```typescript
interface ConversationState {
  messages: MessageDto[];
  isLoading: boolean;
  error: string | null;

  sendMessage: (content: string) => Promise<void>;
  loadHistory: (days?: number) => Promise<void>;
  clearMessages: () => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (content: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await conversationApi.sendMessage({ content });

      // 기존 메시지에 새 메시지 추가
      set(state => ({
        messages: [...state.messages, response.userMessage, response.aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  loadHistory: async (days = 7) => {
    set({ isLoading: true, error: null });

    try {
      const messages = await conversationApi.getHistory(days);
      set({ messages, isLoading: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  },
}));
```

**작업**:
- [ ] Conversation Store 구현 (메시지 캐싱)
- [ ] 메시지 전송 상태 관리
- [ ] 대화 내역 로딩 상태 관리

---

### Phase 3 완료 기준

- ✅ AI 대화 메시지 전송 성공
- ✅ 대화 내역 조회 성공 (7일 기본값)
- ✅ 감정 분석 결과 표시 (POSITIVE, NEGATIVE, NEUTRAL)
- ✅ 메시지 500자 제한 검증
- ✅ 메시지 목록 실시간 업데이트
- ✅ `npm run build` 에러 없음

---

## 👨‍👩‍👧 Phase 4: Guardian (보호자 관계)

### 목표
보호자 요청, 수락, 거절 API 연결

### 작업 항목

#### 4.1 Guardian 타입 정의

**새 파일**: `src/features/guardian/types/guardian.types.ts`

**타입 정의**:
```typescript
import type { GuardianRelation, RequestStatus } from '@/shared/types/enums';

export interface GuardianRequestRequest {
  guardianId: number;
  relation: GuardianRelation;
}

export interface GuardianRequestResponse {
  id: number;
  requester: {
    id: number;
    name: string;
    email: string;
  };
  guardian: {
    id: number;
    name: string;
    email: string;
  };
  relation: GuardianRelation;
  status: RequestStatus;
  createdAt: string; // ISO 8601
}
```

**작업**:
- [ ] Guardian 타입 정의
- [ ] `src/features/guardian/types/index.ts`에서 export

---

#### 4.2 Guardian API 구현

**새 파일**: `src/features/guardian/api/guardianApi.ts`

**구현 내용**:
```typescript
/**
 * 보호자 요청 생성
 */
export async function createGuardianRequest(
  request: GuardianRequestRequest
): Promise<GuardianRequestResponse> {
  const response = await apiClient.post<CommonApiResponse<GuardianRequestResponse>>(
    API_ENDPOINTS.GUARDIANS.REQUESTS,
    request
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '보호자 요청 생성 실패');
  }

  return response.data.data;
}

/**
 * 내가 받은 보호자 요청 목록
 */
export async function getGuardianRequests(): Promise<GuardianRequestResponse[]> {
  const response = await apiClient.get<CommonApiResponse<GuardianRequestResponse[]>>(
    API_ENDPOINTS.GUARDIANS.REQUESTS
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '보호자 요청 목록 조회 실패');
  }

  return response.data.data;
}

/**
 * 보호자 요청 수락
 */
export async function acceptGuardianRequest(requestId: number): Promise<void> {
  await apiClient.post<CommonApiResponse<null>>(
    API_ENDPOINTS.GUARDIANS.ACCEPT(requestId)
  );
}

/**
 * 보호자 요청 거절
 */
export async function rejectGuardianRequest(requestId: number): Promise<void> {
  await apiClient.post<CommonApiResponse<null>>(
    API_ENDPOINTS.GUARDIANS.REJECT(requestId)
  );
}
```

**작업**:
- [ ] `createGuardianRequest()` 구현
- [ ] `getGuardianRequests()` 구현
- [ ] `acceptGuardianRequest()` 구현
- [ ] `rejectGuardianRequest()` 구현

---

### Phase 4 완료 기준

- ✅ 보호자 회원 검색 성공 (`searchMember()`)
- ✅ 보호자 요청 생성 성공
- ✅ 보호자 요청 목록 조회 성공
- ✅ 보호자 요청 수락 성공
- ✅ 보호자 요청 거절 성공
- ✅ 보호자 관계 해제 성공 (`removeGuardian()`)
- ✅ 요청 상태 실시간 반영 (PENDING → ACCEPTED/REJECTED)
- ✅ `npm run build` 에러 없음

---

## 🚨 Phase 5: AlertRule (이상징후 감지)

### 목표
알림 규칙 CRUD 및 알림 이력 조회 API 연결

### 작업 항목

#### 5.1 AlertRule 타입 정의

**새 파일**: `src/features/alert/types/alert.types.ts`

**타입 정의**:
```typescript
import type { AlertType, AlertLevel } from '@/shared/types/enums';

export interface AlertCondition {
  consecutiveDays?: number;
  thresholdCount?: number;
  keywords?: string[];
}

export interface AlertRuleCreateRequest {
  alertType: AlertType;
  alertLevel: AlertLevel;
  condition: AlertCondition;
}

export interface AlertRuleUpdateRequest {
  ruleName: string;
  description: string;
  alertLevel: AlertLevel;
}

export interface AlertRuleResponseDto {
  id: number;
  memberId: number;
  alertType: AlertType;
  alertLevel: AlertLevel;
  ruleName: string;
  condition: AlertCondition;
  description: string;
  active: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface AlertHistoryResponseDto {
  id: number;
  alertRuleId: number;
  memberId: number;
  alertLevel: AlertLevel;
  alertMessage: string;
  detectionDetails: string; // JSON 문자열
  isNotificationSent: boolean;
  notificationSentAt: string | null; // ISO 8601
  notificationResult: string;
  alertDate: string; // ISO 8601
  createdAt: string; // ISO 8601
}
```

**작업**:
- [ ] AlertRule 타입 정의
- [ ] `src/features/alert/types/index.ts`에서 export

---

#### 5.2 AlertRule API 구현

**새 파일**: `src/features/alert/api/alertApi.ts`

**구현 내용**:
```typescript
/**
 * 알림 규칙 생성
 */
export async function createAlertRule(
  request: AlertRuleCreateRequest
): Promise<AlertRuleResponseDto> {
  const response = await apiClient.post<CommonApiResponse<AlertRuleResponseDto>>(
    API_ENDPOINTS.ALERT_RULES.CREATE,
    request
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 생성 실패');
  }

  return response.data.data;
}

/**
 * 알림 규칙 목록 조회
 */
export async function getAlertRules(): Promise<AlertRuleResponseDto[]> {
  const response = await apiClient.get<CommonApiResponse<AlertRuleResponseDto[]>>(
    API_ENDPOINTS.ALERT_RULES.LIST
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 목록 조회 실패');
  }

  return response.data.data;
}

/**
 * 알림 규칙 상세 조회
 */
export async function getAlertRuleDetail(id: number): Promise<AlertRuleResponseDto> {
  const response = await apiClient.get<CommonApiResponse<AlertRuleResponseDto>>(
    API_ENDPOINTS.ALERT_RULES.DETAIL(id)
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 조회 실패');
  }

  return response.data.data;
}

/**
 * 알림 규칙 수정
 */
export async function updateAlertRule(
  id: number,
  request: AlertRuleUpdateRequest
): Promise<AlertRuleResponseDto> {
  const response = await apiClient.put<CommonApiResponse<AlertRuleResponseDto>>(
    API_ENDPOINTS.ALERT_RULES.UPDATE(id),
    request
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 수정 실패');
  }

  return response.data.data;
}

/**
 * 알림 규칙 삭제
 */
export async function deleteAlertRule(id: number): Promise<void> {
  await apiClient.delete<CommonApiResponse<null>>(
    API_ENDPOINTS.ALERT_RULES.DELETE(id)
  );
}

/**
 * 알림 규칙 활성화/비활성화
 */
export async function toggleAlertRule(
  id: number,
  active: boolean
): Promise<AlertRuleResponseDto> {
  const response = await apiClient.post<CommonApiResponse<AlertRuleResponseDto>>(
    `${API_ENDPOINTS.ALERT_RULES.TOGGLE(id)}?active=${active}`
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 규칙 토글 실패');
  }

  return response.data.data;
}

/**
 * 알림 이력 조회
 */
export async function getAlertHistory(days: number = 30): Promise<AlertHistoryResponseDto[]> {
  const response = await apiClient.get<CommonApiResponse<AlertHistoryResponseDto[]>>(
    `${API_ENDPOINTS.ALERT_RULES.HISTORY}?days=${days}`
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 이력 조회 실패');
  }

  return response.data.data;
}

/**
 * 알림 상세 조회
 */
export async function getAlertHistoryDetail(alertId: number): Promise<AlertHistoryResponseDto> {
  const response = await apiClient.get<CommonApiResponse<AlertHistoryResponseDto>>(
    API_ENDPOINTS.ALERT_RULES.HISTORY_DETAIL(alertId)
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '알림 상세 조회 실패');
  }

  return response.data.data;
}

/**
 * 수동 이상징후 감지
 */
export async function detectAnomalies(): Promise<{
  memberId: number;
  detectedAnomalies: unknown[];
}> {
  const response = await apiClient.post<CommonApiResponse<{
    memberId: number;
    detectedAnomalies: unknown[];
  }>>(
    API_ENDPOINTS.ALERT_RULES.DETECT
  );

  if (!response.data.isSuccess || !response.data.data) {
    throw new Error(response.data.message || '이상징후 감지 실패');
  }

  return response.data.data;
}
```

**작업**:
- [ ] 모든 AlertRule API 함수 구현
- [ ] 알림 규칙 CRUD
- [ ] 알림 이력 조회
- [ ] 수동 이상징후 감지

---

### Phase 5 완료 기준

- ✅ 알림 규칙 생성 성공
- ✅ 알림 규칙 목록 조회 성공
- ✅ 알림 규칙 상세 조회 성공
- ✅ 알림 규칙 수정 성공
- ✅ 알림 규칙 삭제 성공
- ✅ 알림 규칙 활성화/비활성화 성공
- ✅ 알림 이력 조회 성공 (30일 기본값)
- ✅ 알림 상세 조회 성공
- ✅ 수동 이상징후 감지 성공
- ✅ `npm run build` 에러 없음

---

## 🧪 Phase 6: 통합 테스트 및 검증

### 목표
전체 API 연결 검증 및 에러 처리 점검

### 작업 항목

#### 6.1 API 테스트

**테스트 시나리오**:
- [ ] **로그인 플로우**
  1. `POST /api/auth/login` 호출
  2. 헤더에서 토큰 추출
  3. `GET /api/members/me` 자동 호출
  4. 사용자 정보 저장 확인

- [ ] **회원가입 플로우**
  1. `GET /api/join/email-check` 이메일 중복 확인
  2. `POST /api/join` 회원가입
  3. 로그인 페이지 리다이렉트

- [ ] **AI 대화 플로우**
  1. `POST /api/conversations/messages` 메시지 전송
  2. 사용자 메시지 + AI 응답 표시
  3. `GET /api/conversations/history` 대화 내역 조회

- [ ] **보호자 관계 플로우**
  1. `GET /api/members/search` 보호자 검색
  2. `POST /api/guardians/requests` 보호자 요청 생성
  3. (보호자 계정으로) `GET /api/guardians/requests` 요청 목록 확인
  4. (보호자 계정으로) `POST /api/guardians/requests/{id}/accept` 수락
  5. (노인 계정으로) `GET /api/members/me` 보호자 정보 확인

- [ ] **알림 규칙 플로우**
  1. `POST /api/alert-rules` 알림 규칙 생성
  2. `GET /api/alert-rules` 목록 확인
  3. `POST /api/alert-rules/{id}/toggle` 활성화/비활성화
  4. `GET /api/alert-rules/history` 이력 조회

---

#### 6.2 에러 처리 검증

**검증 항목**:
- [ ] **401 Unauthorized**
  - 인터셉터에서 자동 로그아웃 처리
  - 로그인 페이지로 리다이렉트

- [ ] **400 Bad Request**
  - 유효성 검사 오류 메시지 표시
  - 사용자에게 적절한 피드백

- [ ] **404 Not Found**
  - "리소스를 찾을 수 없습니다" 메시지
  - 적절한 fallback UI

- [ ] **409 Conflict**
  - 이메일 중복 등 충돌 상황 처리
  - 사용자에게 대안 제시

- [ ] **500 Server Error**
  - "서버 오류가 발생했습니다" 메시지
  - 재시도 옵션 제공

- [ ] **Network Error**
  - "네트워크 연결을 확인해주세요" 메시지
  - 오프라인 상태 감지

---

#### 6.3 TypeScript 컴파일 검증

**검증 명령어**:
```bash
# TypeScript 컴파일 검증
npm run build

# ESLint 검사
npm run lint

# 타입 체크만
npx tsc --noEmit
```

**확인 사항**:
- [ ] TypeScript 컴파일 에러 0개
- [ ] ESLint 에러 0개
- [ ] ESLint 경고 최소화
- [ ] 사용하지 않는 import 제거
- [ ] any 타입 사용 최소화

---

#### 6.4 문서화

**업데이트 문서**:
- [ ] `docs/README.md` - 프로젝트 현황 업데이트
- [ ] `docs/api-spec.md` - 클라이언트 구현 상태 체크
- [ ] `CHANGELOG.md` - Phase 3-8 변경 사항 기록
- [ ] 이 문서 - 각 Phase 완료 체크

**CHANGELOG 예시**:
```markdown
## [Phase 3-8] API 연결 - 2025-10-29

### Added
- CommonApiResponse<T> 타입 정의
- 전체 도메인 API 엔드포인트 상수
- Request/Response 인터셉터 구현
- Auth, Member, Conversation, Guardian, AlertRule API 연결

### Changed
- LoginRequest 필드명 변경 (username → memberEmail)
- User 타입 구조 수정 (guardian, managedMembers)
- AuthState에서 refreshToken 제거
- Mock 데이터 제거, 실제 API 호출로 변경

### Removed
- RefreshTokenResponse 타입
- refreshAccessToken() 메서드
- MOCK_USERS 데이터

### Fixed
- 로그인 플로우 2단계 처리 (토큰 추출 + 사용자 정보 조회)
- 401 에러 자동 로그아웃 처리
```

---

### Phase 6 완료 기준

- ✅ 모든 주요 플로우 테스트 통과
- ✅ 에러 케이스 처리 검증 완료
- ✅ TypeScript 컴파일 에러 0개
- ✅ ESLint 경고 최소화
- ✅ 문서 업데이트 완료
- ✅ 코드 리뷰 완료

---

## 📊 전체 진행 순서

```
Phase 1: 공통 기반 작업
  ├─ 1.1 타입 정의 수정 (CommonApiResponse)
  ├─ 1.2 API 엔드포인트 확장
  ├─ 1.3 API 인터셉터 구현
  └─ 1.4 공통 타입 추가

Phase 2: Auth & Member
  ├─ 2.1 Auth 타입 수정
  ├─ 2.2 Auth API 재구현
  ├─ 2.3 Auth Store 수정
  ├─ 2.4 Join API 추가
  ├─ 2.5 Member API 추가
  └─ 2.6 Member 타입 정의

Phase 3: Conversation
  ├─ 3.1 Conversation 타입 정의
  ├─ 3.2 Conversation API 구현
  └─ 3.3 Conversation Store (선택)

Phase 4: Guardian
  ├─ 4.1 Guardian 타입 정의
  └─ 4.2 Guardian API 구현

Phase 5: AlertRule
  ├─ 5.1 AlertRule 타입 정의
  └─ 5.2 AlertRule API 구현

Phase 6: 통합 테스트
  ├─ 6.1 API 테스트
  ├─ 6.2 에러 처리 검증
  ├─ 6.3 TypeScript 컴파일 검증
  └─ 6.4 문서화
```

---

## 💡 추가 고려사항

### 향후 개선 사항 (Phase 3-9 이후)

#### 1. Refresh Token 추가
**Trade-off**:
- ✅ **장점**: 자동 토큰 갱신으로 UX 향상, 1시간마다 재로그인 불필요
- ❌ **단점**: 서버 수정 필요, 구현 복잡도 증가
- 📝 **조건**: 서버에 `/api/auth/token/refresh` 엔드포인트 추가

#### 2. 로그인 응답 개선
**Trade-off**:
- ✅ **장점**: API 호출 1회로 감소 (로그인 → 완료), 성능 개선
- ❌ **단점**: 서버 수정 필요
- 📝 **조건**: 로그인 응답 body에 사용자 정보 포함

#### 3. TanStack Query 도입
**Trade-off**:
- ✅ **장점**: 캐싱, 낙관적 업데이트, 자동 재시도, Stale/Fresh 관리
- ❌ **단점**: 학습 곡선, 추가 의존성
- 📝 **적용 대상**: Conversation, Member, Guardian, AlertRule

#### 4. 무한 스크롤 (대화 내역)
**Trade-off**:
- ✅ **장점**: 대용량 데이터 처리, 성능 개선
- ❌ **단점**: 서버 페이징 API 추가 필요
- 📝 **조건**: `?page=1&size=20` 파라미터 지원

#### 5. 오프라인 지원
**Trade-off**:
- ✅ **장점**: 네트워크 불안정 환경에서도 사용 가능
- ❌ **단점**: Service Worker 복잡도 증가, IndexedDB 필요
- 📝 **적용 대상**: 메시지 임시 저장, 네트워크 복구 시 동기화

---

## 🔗 참고 자료

### 문서
- **API 명세**: `docs/api-spec.md`
- **API 플로우**: `docs/flows/api-flow.md`
- **코딩 컨벤션**: `docs/development/CODING_CONVENTIONS.md`
- **기술 아키텍처**: `docs/architecture/TECHNICAL_ARCHITECTURE.md`
- **컴포넌트 가이드**: `docs/development/COMPONENT_DESIGN_GUIDE.md`

### Postman 테스트
- **환경 설정**: `docs/flows/api-flow.md` 참조
- **테스트 시나리오**: 4개 사용자 플로우
- **자동화 스크립트**: Pre-request/Tests 스크립트

### 서버 문서
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **서버 GitHub**: (추가 예정)

---

## ✅ 체크리스트

### Phase 1: 공통 기반
- [ ] CommonApiResponse 타입 정의
- [ ] API 엔드포인트 상수 확장
- [ ] Request 인터셉터 (JWT 토큰)
- [ ] Response 인터셉터 (토큰 추출, 401 처리)
- [ ] 공통 Enum 타입 정의
- [ ] `npm run build` 성공

### Phase 2: Auth & Member
- [ ] Auth 타입 수정 (LoginRequest, User)
- [ ] Auth API 재구현 (login 2단계)
- [ ] Auth Store 수정 (Mock 제거)
- [ ] Join API 추가 (이메일 확인, 회원가입)
- [ ] Member API 추가 (7개 함수)
- [ ] `npm run build` 성공
- [ ] 로그인/회원가입 테스트 통과

### Phase 3: Conversation
- [ ] Conversation 타입 정의
- [ ] sendMessage API 구현
- [ ] getHistory API 구현
- [ ] Conversation Store (선택)
- [ ] `npm run build` 성공
- [ ] AI 대화 테스트 통과

### Phase 4: Guardian
- [ ] Guardian 타입 정의
- [ ] createGuardianRequest API 구현
- [ ] getGuardianRequests API 구현
- [ ] acceptGuardianRequest API 구현
- [ ] rejectGuardianRequest API 구현
- [ ] `npm run build` 성공
- [ ] 보호자 관계 테스트 통과

### Phase 5: AlertRule
- [ ] AlertRule 타입 정의
- [ ] createAlertRule API 구현
- [ ] getAlertRules API 구현
- [ ] getAlertRuleDetail API 구현
- [ ] updateAlertRule API 구현
- [ ] deleteAlertRule API 구현
- [ ] toggleAlertRule API 구현
- [ ] getAlertHistory API 구현
- [ ] getAlertHistoryDetail API 구현
- [ ] detectAnomalies API 구현
- [ ] `npm run build` 성공
- [ ] 알림 규칙 테스트 통과

### Phase 6: 통합 테스트
- [ ] 전체 플로우 테스트
- [ ] 에러 처리 검증
- [ ] TypeScript 컴파일 검증
- [ ] ESLint 검사 통과
- [ ] 문서 업데이트
- [ ] 코드 리뷰 완료

---

**문서 끝**

**다음 단계**: Phase 1부터 순차적으로 진행
**예상 완료 시간**: Phase 1-2 (2일), Phase 3-5 (3일), Phase 6 (1일) = 총 6일
