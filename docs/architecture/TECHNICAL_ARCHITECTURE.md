# MARUNI Client 기술 아키텍처

> 노인 돌봄 AI 서비스 **MARUNI** 클라이언트의 고수준 시스템 아키텍처 설계

## 🔗 관련 문서

- 📋 [기술 스택](../TECH_STACK.md) - 사용 기술 상세 정보
- 📁 [패키지 구조](../development/PACKAGE_STRUCTURE.md) - 구현 구조 가이드
- 🎨 [디자인 시스템](./DESIGN_SYSTEM.md) - UI/UX 설계

## 🏗️ 아키텍처 개요

### 전체 시스템 구조

```
┌─────────────────────────────────────────┐
│              MARUNI Client              │
│            (React 19 PWA)               │
├─────────────────────────────────────────┤
│  Presentation Layer (pages/)            │
│  ├─ auth/ dashboard/ conversation/      │
│  ├─ guardians/ alerts/ settings/        │
│  └─ Route Guards & Navigation           │
├─────────────────────────────────────────┤
│  Feature Layer (features/)              │
│  ├─ auth/ member/ conversation/         │
│  ├─ guardian/ alert/ notification/      │
│  └─ 서버 도메인과 1:1 매핑              │
├─────────────────────────────────────────┤
│  Shared Layer (shared/)                 │
│  ├─ components/ hooks/ utils/           │
│  ├─ api/ constants/ types/              │
│  └─ Common Utilities & UI Components    │
├─────────────────────────────────────────┤
│  Infrastructure Layer                   │
│  ├─ API Client (Axios + Interceptors)  │
│  ├─ State Management (Zustand)         │
│  ├─ Cache Management (TanStack Query)   │
│  └─ Storage (LocalStorage, PWA)        │
└─────────────────────────────────────────┘
                    │
         HTTP/HTTPS (JWT Bearer)
                    │
┌─────────────────────────────────────────┐
│            MARUNI Server                │
│        (Spring Boot + JWT)              │
│                                         │
│  📦 도메인 (6개)                         │
│  ├─ Auth (인증/인가)                    │
│  ├─ Member (회원 관리)                  │
│  ├─ Conversation (AI 대화)              │
│  ├─ Guardian (보호자 관리)               │
│  ├─ AlertRule (이상징후 감지)            │
│  └─ Notification (알림 발송)             │
│                                         │
│  🔧 기술 스택                            │
│  ├─ OpenAI GPT-4o (AI 대화)            │
│  ├─ Firebase FCM (푸시 알림)            │
│  ├─ Redis (토큰 저장)                   │
│  └─ PostgreSQL (메인 DB)                │
│                                         │
│   ✅ 서버 완성 (100%)                   │
└─────────────────────────────────────────┘
```

### 서버-클라이언트 도메인 매핑

| 서버 도메인  | 클라이언트 Feature    | API 엔드포인트                   | 상태         |
| ------------ | --------------------- | -------------------------------- | ------------ |
| Auth         | features/auth         | /api/members/login, /api/auth/*  | ✅ 완성      |
| Member       | features/member       | /api/join, /api/users/me         | ✅ 완성      |
| Conversation | features/conversation | /api/conversations/messages      | ⏳ 구현 예정 |
| Guardian     | features/guardian     | /api/guardians/*                 | ⏳ 구현 예정 |
| AlertRule    | features/alert        | /api/alert-rules/*               | ⏳ 구현 예정 |
| Notification | (내부 서비스)         | -                                | N/A          |

## 📦 패키지 아키텍처

### 계층별 책임 분리

> **상세한 패키지 구조**: [패키지 구조 문서](../development/PACKAGE_STRUCTURE.md) 참조

**4계층 아키텍처 구조:**
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

**주요 사용 예:**
- **서버 상태**: 대화 기록, 회원 정보, 보호자 목록 등
- **클라이언트 상태**: 인증 상태, UI 설정, 임시 폼 데이터 등

### API 통신 아키텍처

**핵심 설계 원칙:**
- **JWT 자동 갱신**: 사용자 경험 중단 없는 토큰 관리
- **에러 처리**: 네트워크 오류, 인증 오류 체계적 처리
- **타입 안전성**: TypeScript로 API 응답 타입 보장
- **중복 요청 방지**: 토큰 갱신 중 대기 큐 관리

**API 엔드포인트:**

```
Base URL: http://localhost:8080/api (개발)
         https://api.maruni.kro.kr/api (운영)

인증 API (Auth Domain)
  POST /api/members/login           로그인
  POST /api/auth/token/refresh      Access Token 재발급
  POST /api/auth/logout             로그아웃

회원 API (Member Domain)
  POST /api/join                    회원가입
  GET  /api/join/email-check        이메일 중복 확인
  GET  /api/users/me                내 정보 조회
  PUT  /api/users/me                내 정보 수정
  DELETE /api/users/me              계정 삭제

AI 대화 API (Conversation Domain)
  POST /api/conversations/messages  AI 대화 메시지 전송
  GET  /api/conversations/history   대화 내역 조회

보호자 API (Guardian Domain)
  POST /api/guardians               보호자 생성
  GET  /api/guardians/{id}          보호자 조회
  PUT  /api/guardians/{id}          보호자 수정
  DELETE /api/guardians/{id}        보호자 비활성화

알림 규칙 API (AlertRule Domain)
  POST /api/alert-rules             알림 규칙 생성
  GET  /api/alert-rules             알림 규칙 목록
  GET  /api/alert-rules/history     알림 이력 조회
```

**공통 응답 형식:**
모든 API는 공통 응답 래퍼를 사용합니다:
- `success`: boolean - 성공 여부
- `code`: string - 응답 코드
- `message`: string - 응답 메시지
- `data`: T | null - 실제 데이터

### 라우팅 아키텍처

**계층적 라우팅 구조:**
- **보호된 라우트**: 인증 필요 페이지들 (대시보드, 대화, 설정 등)
- **공개 라우트**: 로그인, 회원가입 등
- **에러 경계**: 라우트 레벨 에러 처리

**라우팅 구조:**
```
/ (루트)
├── /auth/* (공개)
│   ├── /login
│   └── /register
└── /app/* (보호됨)
    ├── /dashboard
    ├── /conversation
    ├── /guardians
    └── /settings
```

## 📱 PWA 아키텍처

### Service Worker 전략

**캐싱 전략:**
- **Static Assets**: CacheFirst - 앱 쉘, 아이콘, 폰트
- **API Responses**: NetworkFirst - 최신 데이터 우선, 오프라인 시 캐시
- **Images**: CacheFirst - 이미지 캐싱 (30일)

### Offline 전략

**오프라인 지원:**
- **오프라인 감지**: navigator.onLine으로 상태 감지
- **로컬 저장**: 오프라인 시 메시지 로컬 저장
- **동기화**: 네트워크 복구 시 자동 동기화

## 🔔 Push Notification 아키텍처

### FCM 통합

**Firebase Cloud Messaging 통합:**
- **권한 요청**: Notification API 권한 요청
- **토큰 생성**: FCM 디바이스 토큰 생성 및 서버 등록
- **포그라운드 메시지**: 앱 사용 중 알림 처리
- **백그라운드 메시지**: Service Worker로 처리

**알림 종류:**
- **안부 메시지**: 매일 오전 9시 푸시
- **이상 징후 알림**: 즉시 푸시
- **보호자 요청**: 즉시 푸시

## 🚀 성능 최적화 전략

### Code Splitting

**라우트별 코드 스플리팅:**
- React.lazy()로 페이지별 청크 분리
- Feature별 청크 분리
- 조건부 로딩 (관리자 패널 등)

### Bundle Optimization

**번들 최적화 전략:**
- **벤더 청크 분리**: React, Router, UI 라이브러리 분리
- **Feature별 청크**: 도메인별 청크 분리
- **Tree Shaking**: 사용하지 않는 코드 자동 제거

### 메모리 최적화

**React 최적화:**
- **React.memo**: 불필요한 재렌더링 방지
- **useMemo**: 비용이 큰 계산 메모이제이션
- **useCallback**: 함수 재생성 방지

---

**🎯 이 기술 아키텍처는 확장성, 성능, 유지보수성을 고려하여 설계되었으며, 노인 친화적 사용자 경험을 제공하는 것을 최우선으로 합니다.**

**📅 마지막 업데이트**: 2025-10-12
