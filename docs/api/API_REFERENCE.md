# MARUNI API 레퍼런스

> **MARUNI 서버 API 전체 가이드 - 클라이언트 개발자용 진입점 문서**

## 📋 문서 개요

이 문서는 MARUNI 서버의 **모든 API를 안내하는 진입점(Hub) 문서**입니다. 각 도메인별 상세 API 문서로 연결되며, 개발 계획 수립 및 실제 구현 시 참고하세요.

---

## 🌐 도메인별 API 문서

MARUNI 서버는 **6개 도메인**으로 구성되어 있으며, 각 도메인별 상세 API 문서가 준비되어 있습니다.

### 🔐 인증 및 회원 관리
- **[Auth API](./auth-api.md)** - 로그인, 토큰 관리 (갱신/재발급), 로그아웃
  - JWT 이중 토큰 시스템 (Access Token + Refresh Token)
  - 자동 토큰 갱신 (401 에러 처리)
  - Redis 기반 토큰 관리 및 블랙리스트

- **[Member API](./member-api.md)** - 회원가입, 내 정보 조회/수정/삭제
  - 이메일 중복 확인
  - BCrypt 비밀번호 암호화
  - JWT 기반 본인 정보만 접근 가능

### 💬 핵심 서비스 기능
- **[Conversation API](./conversation-api.md)** - AI 대화 메시지 전송 및 응답
  - OpenAI GPT-4o 기반 멀티턴 대화
  - 실시간 감정 분석 (POSITIVE/NEGATIVE/NEUTRAL)
  - 대화 컨텍스트 기반 개인화 응답
  - 평균 2-3초 응답 시간

- **[Guardian API](./guardian-api.md)** - 보호자 관리 및 회원-보호자 관계 설정
  - 보호자 CRUD (생성/조회/수정/비활성화)
  - 회원-보호자 1:N 관계 관리
  - 4종 알림 채널 설정 (PUSH/EMAIL/SMS/ALL)
  - 담당 회원 목록 조회

- **[AlertRule API](./alertrule-api.md)** - 이상징후 감지 규칙 관리 및 알림 이력
  - 3종 이상징후 감지 (감정패턴/무응답/키워드)
  - 4단계 알림 레벨 (LOW/MEDIUM/HIGH/EMERGENCY)
  - 실시간 이상징후 감지 및 즉시 알림
  - 알림 이력 조회 및 통계

### 🔔 내부 서비스
- **[Notification API](./notification-api.md)** - 통합 알림 시스템 (내부 서비스)
  - ⚠️ **직접적인 REST API 제공 없음** (다른 도메인에서 내부적으로 사용)
  - Firebase FCM 실제 연동
  - 3중 안전망 시스템 (Retry + Fallback + History)
  - 다중 채널 지원 (푸시/이메일/SMS)

---

## 🚀 빠른 시작 가이드

### 1️⃣ 개발 환경 설정

```bash
# .env.local 파일 생성
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2️⃣ 첫 API 호출 순서 (회원가입 → 로그인 → 대시보드)

```
1. 회원가입
   └─ POST /api/join
      └─ 문서: Member API > 회원가입

2. 로그인
   └─ POST /api/members/login
      └─ 문서: Auth API > 로그인
      └─ 응답: Authorization 헤더에 Access Token 포함

3. 내 정보 조회
   └─ GET /api/users/me
      └─ 문서: Member API > 내 정보 조회
      └─ 헤더: Authorization: Bearer {ACCESS_TOKEN}
```

**상세 구현 방법**: [구현 플로우 가이드](../flows/IMPLEMENTATION_FLOWS.md#인증-플로우) 참조

### 3️⃣ JWT 인증 사용법

```typescript
// API 요청 시 Authorization 헤더에 토큰 첨부
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**자동 토큰 갱신 구현**: [자동 토큰 갱신 플로우](../flows/IMPLEMENTATION_FLOWS.md#자동-토큰-갱신-플로우) 참조

---

## 🔑 공통 정보

### Base URL
- **개발 환경**: `http://localhost:8080/api`
- **운영 환경**: `https://api.maruni.kro.kr/api`

### 인증 방식
- **JWT Bearer Token** (Authorization 헤더)
- **Refresh Token**: HttpOnly 쿠키로 자동 관리
- **자동 갱신**: 401 에러 발생 시 Refresh Token으로 자동 재발급

### Content-Type
- `application/json`

---

## 📊 공통 응답 형식

모든 API는 다음 공통 응답 래퍼를 사용합니다:

```typescript
interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
}
```

### 성공 응답 예시
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "성공적으로 처리되었습니다",
  "data": {
    "id": 1,
    "memberName": "김할머니",
    "memberEmail": "user@example.com"
  }
}
```

### 에러 응답 예시
```json
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

---

## ❌ 공통 에러 코드

모든 API에서 공통으로 발생할 수 있는 에러 코드입니다.

| HTTP Status | Code | 설명 | 클라이언트 처리 방법 |
|-------------|------|------|---------------------|
| 400 | `INVALID_INPUT_VALUE` | 입력값 검증 실패 | 폼 유효성 검사 메시지 표시 |
| 401 | `UNAUTHORIZED` | 인증 실패 (토큰 없음/만료) | 로그인 페이지로 이동 |
| 403 | `TOKEN_EXPIRED` | Access Token 만료 | **자동 토큰 갱신** 시도 |
| 403 | `TOKEN_BLACKLISTED` | 블랙리스트된 토큰 | 강제 로그아웃 후 재로그인 |
| 404 | `NOT_FOUND` | 리소스를 찾을 수 없음 | 404 페이지 표시 |
| 409 | `DUPLICATE_EMAIL` | 이메일 중복 | 중복 메시지 표시 |
| 500 | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 | 오류 페이지 표시 + 재시도 버튼 |

### 도메인별 추가 에러 코드
각 도메인별 특수한 에러 코드는 해당 API 문서의 "에러 코드" 섹션을 참조하세요:
- [Auth API 에러 코드](./auth-api.md#에러-코드)
- [Member API 에러 코드](./member-api.md#에러-코드)
- [Conversation API 에러 코드](./conversation-api.md#에러-코드)
- [Guardian API 에러 코드](./guardian-api.md#에러-코드)
- [AlertRule API 에러 코드](./alertrule-api.md#에러-코드)

---

## 🔧 클라이언트 구현 가이드

### API 클라이언트 설정

```typescript
// shared/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Refresh Token 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: Access Token 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response 인터셉터: 401 에러 자동 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 발생 시 자동 토큰 갱신
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

### 공통 에러 처리

```typescript
// shared/utils/errorHandler.ts
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api';

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;

    // 필드별 에러 메시지 처리
    if (apiError?.data?.fieldErrors) {
      return apiError.data.fieldErrors
        .map((fe) => `${fe.field}: ${fe.message}`)
        .join(', ');
    }

    // 일반 에러 메시지
    return apiError?.message || '알 수 없는 오류가 발생했습니다.';
  }

  return '네트워크 오류가 발생했습니다.';
};
```

**상세 구현 예제**: [구현 플로우 가이드](../flows/IMPLEMENTATION_FLOWS.md) 참조

---

## 📚 관련 문서

### 🔗 개발 가이드
- **[구현 플로우 가이드](../flows/IMPLEMENTATION_FLOWS.md)** - 기능별 단계별 구현 방법 및 코드 예제
- **[기술 아키텍처](../architecture/TECHNICAL_ARCHITECTURE.md)** - 시스템 아키텍처 및 API 통신 구조
- **[컴포넌트 디자인 가이드](../development/COMPONENT_DESIGN_GUIDE.md)** - 노인 친화적 UI 구현 가이드
- **[코딩 컨벤션](../development/CODING_CONVENTIONS.md)** - TypeScript, React 코딩 규칙

### 🎨 디자인 시스템
- **[디자인 시스템](../architecture/DESIGN_SYSTEM.md)** - 색상, 타이포그래피, 간격 시스템
- **[현재 프로젝트 상태](../project/CURRENT_STATUS.md)** - 프로젝트 진행 상황 및 완료된 작업

---

## 🎯 개발 계획 수립 시 참고 사항

### Phase 3 구현 대상 API

현재 **Phase 2 완료** 상태이며, Phase 3에서 다음 API들을 클라이언트에 통합해야 합니다:

#### ✅ 우선순위 1 (핵심 기능)
1. **[Conversation API](./conversation-api.md)** - AI 대화 기능
   - 페이지: `/conversation`
   - 주요 작업: 메시지 전송, AI 응답 표시, 감정 아이콘 표시
   - 예상 기간: 4일

2. **[Guardian API](./guardian-api.md)** - 보호자 설정
   - 페이지: `/settings/guardian`
   - 주요 작업: 보호자 생성, 관계 할당, 보호자 정보 조회/수정
   - 예상 기간: 2일

#### ✅ 우선순위 2 (모니터링)
3. **[AlertRule API](./alertrule-api.md)** - 알림 이력 및 설정
   - 페이지: `/alerts/history`, `/alerts/rules`
   - 주요 작업: 알림 이력 조회, 알림 규칙 관리
   - 예상 기간: 4일

4. **[Member API](./member-api.md)** - 회원 정보 관리
   - 페이지: `/profile`
   - 주요 작업: 회원 정보 조회/수정
   - 예상 기간: 2일

### API 통합 작업 체크리스트

각 API 통합 시 다음 작업이 필요합니다:

```
□ API 모듈 작성 (features/{domain}/api/{domain}Api.ts)
□ 타입 정의 (features/{domain}/types/{domain}.types.ts)
□ TanStack Query 훅 작성 (features/{domain}/hooks/use{Domain}.ts)
□ Zustand Store 작성 (필요시)
□ 페이지 컴포넌트 작성 (pages/{domain}/{Page}.tsx)
□ UI 컴포넌트 작성 (features/{domain}/components/)
□ 라우팅 설정 (app/router.tsx)
□ 에러 처리 테스트
□ 노인 친화적 UI 적용 (60px+ 터치영역, 18px+ 폰트)
```

**상세 계획**: [CURRENT_STATUS.md - Phase 3 계획](../project/CURRENT_STATUS.md#phase-3-계획) 참조

---

## 📋 API 개요 (빠른 참조)

각 도메인의 핵심 엔드포인트를 빠르게 참조할 수 있도록 정리했습니다. 상세 내용은 각 도메인 문서를 참조하세요.

### 🔐 Auth API
| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| POST | `/api/members/login` | 로그인 (토큰 발급) | ❌ |
| POST | `/api/auth/token/refresh` | Access Token 재발급 | 🔄 Refresh Token |
| POST | `/api/auth/token/refresh/full` | 전체 토큰 재발급 | 🔄 Refresh Token |
| POST | `/api/auth/logout` | 로그아웃 (토큰 무효화) | ✅ JWT |

**상세 문서**: [Auth API](./auth-api.md)

### 👤 Member API
| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| POST | `/api/join` | 회원가입 | ❌ |
| GET | `/api/join/email-check` | 이메일 중복 확인 | ❌ |
| GET | `/api/users/me` | 내 정보 조회 | ✅ JWT |
| PUT | `/api/users/me` | 내 정보 수정 | ✅ JWT |
| DELETE | `/api/users/me` | 내 계정 삭제 | ✅ JWT |

**상세 문서**: [Member API](./member-api.md)

### 💬 Conversation API
| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| POST | `/api/conversations/messages` | AI 대화 메시지 전송 | ✅ JWT |

**상세 문서**: [Conversation API](./conversation-api.md)

### 👥 Guardian API
| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| POST | `/api/guardians` | 보호자 생성 | ❌ |
| GET | `/api/guardians/{guardianId}` | 보호자 조회 | ❌ |
| PUT | `/api/guardians/{guardianId}` | 보호자 정보 수정 | ❌ |
| DELETE | `/api/guardians/{guardianId}` | 보호자 비활성화 | ❌ |
| POST | `/api/guardians/{guardianId}/assign` | 현재 회원에게 보호자 할당 | ✅ JWT |
| DELETE | `/api/guardians/remove-guardian` | 현재 회원의 보호자 관계 해제 | ✅ JWT |
| GET | `/api/guardians/my-guardian` | 현재 회원의 보호자 조회 | ✅ JWT |
| GET | `/api/guardians/{guardianId}/members` | 보호자가 담당하는 회원 목록 | ❌ |

**상세 문서**: [Guardian API](./guardian-api.md)

### 🚨 AlertRule API
| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| POST | `/api/alert-rules` | 알림 규칙 생성 | ✅ JWT |
| GET | `/api/alert-rules` | 알림 규칙 목록 조회 | ✅ JWT |
| GET | `/api/alert-rules/{id}` | 알림 규칙 상세 조회 | ✅ JWT |
| PUT | `/api/alert-rules/{id}` | 알림 규칙 수정 | ✅ JWT |
| DELETE | `/api/alert-rules/{id}` | 알림 규칙 삭제 | ✅ JWT |
| POST | `/api/alert-rules/{id}/toggle` | 알림 규칙 활성화/비활성화 | ✅ JWT |
| GET | `/api/alert-rules/history` | 알림 이력 조회 | ✅ JWT |
| POST | `/api/alert-rules/detect` | 수동 이상징후 감지 | ✅ JWT |

**상세 문서**: [AlertRule API](./alertrule-api.md)

---

**이 문서는 MARUNI 클라이언트 개발 시 API 통합을 위한 진입점이자, 개발 계획 수립의 기반이 되는 핵심 문서입니다. 각 도메인별 상세 문서와 구현 플로우 가이드를 함께 참고하세요.** 🚀
