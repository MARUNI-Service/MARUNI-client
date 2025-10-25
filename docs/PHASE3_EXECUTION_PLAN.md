# MARUNI Phase 3 실행 계획

**작성일**: 2025-10-12
**버전**: 1.7.0
**상태**: Phase 3-6 완료 ✅ | Phase 3 전체 완료 🎉
**목표**: 새로운 유저 흐름 설계 반영 및 핵심 기능 구현
**최종 업데이트**: 2025-10-25

---

## 📋 목차

1. [개요](#개요)
2. [현재 상태](#현재-상태)
3. [Phase별 실행 계획](#phase별-실행-계획)
4. [Phase 간 의존성](#phase-간-의존성)
5. [성공 기준](#성공-기준)

---

## 개요

### 목적

MARUNI 클라이언트를 새로운 유저 흐름 설계(user-flow.md, USER_FLOW_DESIGN.md)에 맞춰 재구성하고, 핵심 기능을 단계적으로 구현합니다.

### 설계 원칙

- **단일 앱 구조**: 노인/보호자 모두 하나의 앱 사용
- **역할별 동적 화면**: 사용자 역할에 따라 메인 화면이 동적으로 구성됨
- **단계적 구현**: 의존성 고려한 Phase별 개발
- **Mock 우선 개발**: Phase 3-1~3-7은 Mock 데이터로 페이지 구현, API 연결은 맨 마지막
- **지속적 테스트**: 각 Phase 완료 시 통합 테스트

### 참조 문서

- [user-flow.md](./flows/user-flow.md) - 새로운 사용자 여정 (2025-01-06)
- [USER_FLOW_DESIGN.md](./architecture/USER_FLOW_DESIGN.md) - 역할별 플로우 설계 (2025-10-12)
- [설계-구현 차이점 분석 보고서](#) - 현재 구현 상태 분석 (2025-10-12)

---

## 현재 상태

### 구현 완료 (Phase 1-2)

| 항목             | 상태    | 비고                                      |
| ---------------- | ------- | ----------------------------------------- |
| 기본 UI 컴포넌트 | ✅ 100% | Button, Input, Card, Layout 등 6개        |
| 인증 기능        | ✅ 90%  | 로그인, 회원가입, JWT 토큰 관리           |
| 라우팅 기본 구조 | ✅ 50%  | /login, /register, /dashboard 구현        |
| 개발 환경 설정   | ✅ 100% | Vite, TypeScript, Tailwind v4             |

### Phase 3 진행 상황

| 항목                  | 현재 상태 | 목표    | Phase  |
| --------------------- | --------- | ------- | ------ |
| 역할별 동적 메인 화면 | ✅ 100%   | ✅ 100% | 3-1 ✅ |
| 회원가입 (MVP)        | ✅ 100%   | ✅ 100% | 3-2 ✅ |
| 보호자 관리           | ✅ 100%   | ✅ 100% | 3-3 ✅ |
| AI 대화               | ✅ 100%   | ✅ 100% | 3-4 ✅ |
| 공통 기능 보완        | ✅ 100%   | ✅ 100% | 3-7 ✅ |
| 설정 관리             | ✅ 100%   | ✅ 100% | 3-5 ✅ |
| 알림 기능             | ✅ 100%   | ✅ 100% | 3-6 ✅ |

---

## Phase별 실행 계획

### Phase 3-1: 기반 확립 (Foundation) ✅ 완료

**상태**: ✅ 완료 (2025-10-14)
**목표**: 역할별 동적 화면 구성을 위한 데이터 구조 및 메인 화면 완성

**핵심 작업**:

1. User 데이터 모델 확장

   - dailyCheckEnabled, guardian, managedMembers 필드 추가
   - Guardian, ManagedMember 타입 정의

2. 메인 화면 역할별 동적 구성

   - "내 안부 메시지" 섹션 (dailyCheckEnabled 기반)
   - "내 보호자" 섹션 (guardian 기반)
   - "내가 돌보는 사람들" 섹션 (managedMembers 기반)
   - "시작 가이드" 섹션 (모두 없을 때)

3. 비즈니스 컴포넌트 추가
   - MessageCard (안부 메시지 카드)
   - GuardianCard (보호자 정보 카드)
   - ManagedMemberCard (보호 대상 카드)

**완성 기준**:

- ✅ 메인 화면이 사용자 역할에 따라 다르게 표시됨
- ✅ 4가지 페르소나 (soonja, younghee, cheolsu, newuser) 화면 차별화
- ✅ Mock 데이터 기반 동적 렌더링 작동
- ✅ TypeScript 빌드 에러 0건
- ✅ 3개 비즈니스 컴포넌트 구현 완료 (MessageCard, GuardianCard, ManagedMemberCard)

**실제 소요 시간**: 1일 미만 (기존 타입이 이미 정의되어 있었음)

**우선순위**: 🔴 긴급 (다른 모든 Phase의 기반)

**완료 산출물**:

- `src/pages/dashboard/DashboardPage.tsx` - 동적 섹션 구현
- `src/shared/components/business/MessageCard/` - 안부 메시지 카드
- `src/shared/components/business/GuardianCard/` - 보호자 정보 카드
- `src/shared/components/business/ManagedMemberCard/` - 보호 대상 카드
- `src/features/auth/types/index.ts` - Guardian, ManagedMember export 추가

---

### Phase 3-2: 회원가입 (MVP 버전) ✅ 완료

**상태**: ✅ 완료 (2025-10-17)
**목표**: 새로운 사용자가 회원가입하고 대시보드에 진입할 수 있는 최소 기능 구현

**핵심 작업 (완료)**:

1. 회원가입 페이지 구현
   - ✅ RegisterPage 컴포넌트 생성
   - ✅ 이메일, 이름, 비밀번호, 전화번호 입력 폼
   - ✅ 클라이언트 폼 검증 (이메일 형식, 비밀번호 길이)
   - ✅ Mock 회원가입 처리 (useAuthStore.signup)

2. 인증 로직 확장
   - ✅ SignupRequest 타입 정의
   - ✅ useAuthStore에 signup 함수 추가
   - ✅ useAuth 훅에 signup 추가

3. 라우팅 확장
   - ✅ /register 라우트 추가
   - ✅ ROUTES.REGISTER 상수 추가
   - ✅ LoginPage에 회원가입 링크 추가
   - ✅ 회원가입 후 대시보드로 직접 이동

**완성 기준**:

- ✅ 사용자가 회원가입 폼 작성 가능
- ✅ 폼 검증 정상 작동 (이메일, 비밀번호)
- ✅ 회원가입 후 대시보드 자동 이동
- ✅ TypeScript 빌드 에러 0건
- ✅ "시작 가이드" 섹션 표시 (신규 사용자)

**실제 소요 시간**: 2시간

**우선순위**: 🟠 높음

**MVP 변경사항**:
- ❌ 온보딩 3단계 제외 (추후 추가 가능)
- ❌ 이메일 중복 확인 제외 (API 연결 시 추가)
- ✅ 회원가입 → 대시보드 직접 이동으로 단순화

**완료 산출물**:
- `src/pages/auth/RegisterPage.tsx` - 회원가입 페이지
- `src/features/auth/types/auth.types.ts` - SignupRequest 타입
- `src/features/auth/store/useAuthStore.ts` - signup 함수
- `src/app/router.tsx` - /register 라우트
- `src/shared/constants/routes.ts` - ROUTES.REGISTER

**세부 계획 문서**: `docs/phases/phase3-2-onboarding.md`

---

### Phase 3-3: 보호자 관계 (Guardian) ✅ 완료

**상태**: ✅ 완료 (2025-10-18)
**목표**: 노인과 보호자 간 관계 성립 및 관리 기능 완성

**핵심 작업 (완료)**:

1. features/guardian 모듈 생성
   - ✅ API: 보호자 검색, 등록 요청, 수락, 거절 (Mock)
   - ✅ Hooks: useGuardian
   - ✅ Types: Guardian, GuardianRequest, ManagedMember, GuardianSearchResult

2. 보호자 관리 화면
   - ✅ 보호자 관리 페이지 (/guardians)
   - ✅ 보호자 찾기 화면 (/guardians/search)
   - ✅ 보호자 요청 목록 (/guardians/requests)

3. 보호자 관계 플로우
   - ✅ 노인: 보호자 검색 → 등록 요청
   - ✅ 보호자: 요청 수신 → 수락/거절
   - ✅ 관계 성립 시 메인 화면 자동 업데이트

**완성 기준**:

- ✅ 김순자가 김영희를 보호자로 검색 및 요청 가능
- ✅ 김영희가 요청 수락 후 "내가 돌보는 사람들" 섹션 표시
- ✅ user-flow.md Journey 3-4 (보호자 등록, 보호자 알림) 재현 가능
- ✅ TypeScript 빌드 에러 0건
- ✅ ESLint 경고 0건

**실제 소요 시간**: 1.5일 (약 8시간)

**우선순위**: 🟠 높음

**완료 산출물**:
- `src/features/guardian/` - Guardian 모듈 전체
- `src/pages/guardians/GuardiansPage.tsx` - 보호자 관리 페이지
- `src/pages/guardians/GuardianSearchPage.tsx` - 보호자 검색 페이지
- `src/pages/guardians/GuardianRequestsPage.tsx` - 보호자 요청 목록 페이지
- `src/app/router.tsx` - Guardian 라우트 3개 추가
- `src/shared/constants/routes.ts` - ROUTES.GUARDIANS, GUARDIANS_SEARCH, GUARDIANS_REQUESTS

**세부 계획 문서**: `docs/phases/phase3-3-guardian.md`

---

### Phase 3-4: AI 대화 (Conversation) ✅ 완료

**상태**: ✅ 완료 (2025-10-19)
**목표**: 노인이 AI와 자연스러운 대화를 나누는 핵심 기능 구현

**핵심 작업 (완료)**:

1. features/conversation 모듈 생성
   - ✅ API: mockConversationApi (메시지 전송, 이력 조회, 에러 시뮬레이션)
   - ✅ Hooks: useConversation (메시지 로드, 전송, 로컬 상태 관리)
   - ✅ Types: Message, MessageSender, EmotionStatus, SendMessageRequest

2. 대화 화면
   - ✅ ConversationPage (/conversation) - 자동 스크롤, 로딩 상태
   - ✅ ChatMessage 컴포넌트 (사용자/AI 메시지 구분, 감정 이모지 표시)
   - ✅ MessageInput 컴포넌트 (노인 친화적 큰 입력창, Enter 키 전송)
   - ✅ 대화 이력 localStorage 저장

3. AI 대화 기능
   - ✅ 메시지 전송 및 AI 응답 수신 (Mock)
   - ✅ 감정 분석 결과 표시 (POSITIVE/NEGATIVE/NEUTRAL 이모지)
   - ✅ 에러 시뮬레이션 ([error], [timeout] 키워드)
   - ✅ 대화 이력 저장 및 조회 (localStorage 기반)

**완성 기준**:

- ✅ 노인이 AI와 실시간 대화 가능
- ✅ AI 응답이 자연스럽게 표시됨
- ✅ user-flow.md Journey 2 (안부 메시지) 재현 가능
- ✅ TypeScript 빌드 에러 0건
- ✅ 에러 시뮬레이션 기능 작동

**실제 소요 시간**: 1일 (약 6시간)

**우선순위**: 🟠 높음

**완료 산출물**:
- `src/features/conversation/` - Conversation 모듈 전체
- `src/shared/components/business/ChatMessage/` - 채팅 메시지 컴포넌트
- `src/shared/components/business/MessageInput/` - 메시지 입력 컴포넌트
- `src/pages/conversation/ConversationPage.tsx` - 대화 페이지
- `src/app/router.tsx` - /conversation 라우트 추가
- `src/shared/constants/routes.ts` - ROUTES.CONVERSATION
- `src/shared/components/business/MessageCard/` - 대시보드에서 대화 페이지로 이동

**세부 계획 문서**: `docs/phases/phase3-4-conversation.md`

**TODO (Phase 3-6 검토 필요)**:
- ⏳ Zustand로 상태 관리 마이그레이션 고려 (대시보드 뱃지 구현 시)
- ⏳ ChatMessage, MessageInput 컴포넌트 위치 재검토 (재사용성 평가 후)

---

### Phase 3-5: 설정 관리 (Settings) ✅ 완료

**상태**: ✅ 완료 (2025-10-25)
**목표**: 사용자가 앱 설정 및 개인정보를 관리할 수 있는 기능 구현

**핵심 작업 (완료)**:

1. features/member 모듈 생성
   - ✅ API: getProfile, updateProfile, changePassword (Mock, localStorage 기반)
   - ✅ Hooks: useMember (프로필 조회, 수정, 비밀번호 변경)
   - ✅ Types: ProfileUpdateRequest, PasswordChangeRequest, MemberSettings

2. 설정 화면 (4개 페이지)
   - ✅ 설정 메뉴 페이지 (/settings) - 3개 메뉴 카드 (Lucide 아이콘)
   - ✅ 내 정보 수정 페이지 (/settings/profile) - 이름, 전화번호 수정
   - ✅ 알림 설정 페이지 (/settings/notifications) - dailyCheckEnabled 토글
   - ✅ 비밀번호 변경 페이지 (/settings/password) - 현재/새 비밀번호 입력

3. 설정 기능
   - ✅ 프로필 수정 → AuthStore 즉시 업데이트 (localStorage 동기화)
   - ✅ 비밀번호 변경 → 현재 비밀번호 검증 후 변경
   - ✅ dailyCheckEnabled 토글 → 대시보드 "내 안부 메시지" 섹션 자동 업데이트
   - ✅ Toast 피드백 (Phase 3-7 컴포넌트 재사용)

**완성 기준**:

- ✅ 설정 메뉴에서 모든 항목 접근 가능
- ✅ 내 정보 수정 후 즉시 반영 (AuthStore 업데이트)
- ✅ 안부 메시지 ON/OFF 시 메인 화면 섹션 변화
- ✅ 비밀번호 변경 시 현재 비밀번호 검증
- ✅ TypeScript 빌드 에러 0건
- ✅ ESLint 경고 0건

**실제 소요 시간**: 1일 (약 6시간)

**우선순위**: 🟠 높음

**완료 산출물**:
- `src/features/member/` - Member 모듈 전체 (API, hooks, types)
- `src/pages/settings/SettingsPage.tsx` - 설정 메뉴 페이지
- `src/pages/settings/ProfilePage.tsx` - 내 정보 수정 페이지
- `src/pages/settings/NotificationsPage.tsx` - 알림 설정 페이지
- `src/pages/settings/PasswordPage.tsx` - 비밀번호 변경 페이지
- `src/app/router.tsx` - Settings 라우트 4개 추가
- `src/shared/constants/routes.ts` - SETTINGS_PROFILE, SETTINGS_NOTIFICATIONS, SETTINGS_PASSWORD

**세부 계획 문서**: `docs/phases/phase3-5-settings.md`

**TODO (Phase 3-8 API 연결 시 개선)**:
- ⏳ Mock API → 실제 API 연결 (PATCH /api/members/me)
- ⏳ 비밀번호 변경 보안 강화 (bcrypt 암호화, 세션 무효화)
- ⏳ 프로필 이미지 업로드 (Phase 4)

---

### Phase 3-6: 알림 기능 (Notification) ✅ 완료

**상태**: ✅ 완료 (2025-10-25)
**목표**: 알림 목록 조회 및 상세 확인 기능 구현 (Mock 데이터 기반)

**핵심 작업 (완료)**:

1. features/notification 모듈 생성
   - ✅ API: Mock 알림 API (getNotifications, markAsRead, getNotificationById)
   - ✅ Hooks: useNotifications, useNotification
   - ✅ Types: Notification, NotificationType, NotificationLevel
   - ✅ Mock 데이터: 3개 페르소나별 알림 (김순자, 김영희, 박철수)

2. 알림 화면
   - ✅ 알림 목록 페이지 (/notifications)
   - ✅ 알림 상세 페이지 (/notifications/:id)
   - ✅ NotificationCard 컴포넌트
   - ✅ EmptyState, NavigationBar 재사용

3. 알림 기능 (기본)
   - ✅ 알림 목록 조회 및 표시 (읽음/안읽음 구분)
   - ✅ 알림 읽음 처리 (localStorage 기반)
   - ✅ 알림 종류별 아이콘 (보호자 요청, 이상 징후, 안부 메시지)
   - ✅ 알림 레벨별 색상 (HIGH/EMERGENCY: 빨강, MEDIUM: 노랑, LOW: 파랑)

4. 공용 유틸리티 추가
   - ✅ src/shared/utils/date.ts (formatTimeAgo, formatLastCheckTime)
   - ✅ src/shared/utils/cn.ts (클래스명 조합 유틸리티)
   - ✅ ManagedMemberCard 리팩토링 (중복 코드 제거)

**완성 기준**:

- ✅ 알림 목록에서 모든 알림 확인 가능
- ✅ 알림 상세에서 타입별 액션 버튼 제공 (보호자 요청, 대화보기)
- ✅ 읽음/안읽음 상태 표시 (파란색 점, 파란색 배경)
- ✅ NavigationBar 알림 탭 활성화
- ✅ TypeScript 빌드 에러 0건
- ✅ ESLint 경고 0건

**실제 소요 시간**: 1일 미만 (약 4-5시간)

**우선순위**: 🟠 높음

**완료 산출물**:
- `src/features/notification/` - Notification 모듈 전체 (types, api, hooks)
- `src/pages/notifications/NotificationsPage.tsx` - 알림 목록 페이지
- `src/pages/notifications/NotificationDetailPage.tsx` - 알림 상세 페이지
- `src/shared/components/business/NotificationCard/` - 알림 카드 컴포넌트
- `src/shared/utils/date.ts` - 시간 포맷 유틸리티
- `src/shared/utils/cn.ts` - 클래스명 조합 유틸리티
- `src/app/router.tsx` - Notification 라우트 2개 추가
- `src/shared/constants/routes.ts` - NOTIFICATIONS, NOTIFICATION_DETAIL
- `src/shared/components/layout/NavigationBar.tsx` - 알림 탭 path 수정

**세부 계획 문서**: `docs/phases/phase3-6-notification.md`

**TODO (Phase 3-8 API 연결 시 개선)**:
- ⏳ Mock API → 실제 API 연결 (GET /api/notifications, PATCH /api/notifications/:id/read)
- ⏳ 알림 배지 카운트 (NavigationBar에 미읽음 개수 표시) - Phase 4
- ⏳ FCM 푸시 알림 연동 - Phase 4
- ⏳ 알림 필터링 (종류별, 읽음/안읽음) - Phase 4

---

### Phase 3-7: 공통 기능 보완 (Polish) ✅ 완료

**상태**: ✅ 완료 (2025-10-21)
**목표**: 사용자 경험 개선 및 공통 컴포넌트 구축으로 코드 품질과 일관성 향상

**핵심 작업 (완료)**:

1. 공통 컴포넌트 구현 (4개)
   - ✅ Toast 시스템 (Zustand 기반, success/error/info 타입)
   - ✅ Modal 컴포넌트 (Portal, ESC/배경 클릭으로 닫기)
   - ✅ EmptyState 컴포넌트 (이모지 + 제목 + 설명)
   - ✅ NavigationBar (하단 고정, 4개 탭, Lucide 아이콘)

2. 기술 부채 해결
   - ✅ alert() 7곳 → Toast로 교체
   - ✅ 임시 Modal 1곳 → Modal 컴포넌트로 교체
   - ✅ 일관된 사용자 피드백 시스템 확립

3. 설정 및 패키지
   - ✅ Tailwind 애니메이션 추가 (fadeIn/fadeOut)
   - ✅ App.tsx에 ToastContainer 추가
   - ✅ lucide-react 패키지 설치
   - ✅ 공통 컴포넌트 export 설정

**완성 기준**:

- ✅ Toast로 모든 성공/에러 메시지 통일 (8곳 리팩토링)
- ✅ Modal 컴포넌트로 확인 다이얼로그 통일
- ✅ NavigationBar 구현 완료 (홈, 대화, 알림, 설정)
- ✅ TypeScript 빌드 에러 0건
- ✅ ESLint 경고 0건

**실제 소요 시간**: 1일 (약 6시간)

**우선순위**: 🟢 중간 (Phase 3-5, 3-6에서 공통 컴포넌트 재사용)

**완료 산출물**:
- `src/shared/components/ui/Toast/` - Toast 시스템 전체
- `src/shared/components/ui/Modal/` - Modal 컴포넌트
- `src/shared/components/ui/EmptyState/` - EmptyState 컴포넌트
- `src/shared/components/layout/NavigationBar/` - NavigationBar
- `src/shared/hooks/useToast.ts` - Toast 상태 관리 hook
- `src/index.css` - Tailwind 애니메이션 추가
- `src/app/App.tsx` - ToastContainer 추가
- 리팩토링: ConversationPage, GuardianSearchPage, GuardianRequestsPage

**세부 계획 문서**: `docs/phases/phase3-7-polish.md`

---

## Phase 간 의존성

```
Phase 3-1 (기반 확립)
    │
    ├──→ Phase 3-2 (회원 온보딩)
    │       ↓
    │   Phase 3-3 (보호자 관계)
    │       ↓
    ├──→ Phase 3-4 (AI 대화)
    │
    └──→ Phase 3-5 (설정 관리)
            │
            └──→ Phase 3-6 (알림 기능)
                    │
                    └──→ Phase 3-7 (공통 기능 보완)
```

**의존성 규칙**:

- Phase 3-1은 모든 Phase의 **필수 전제조건**
- Phase 3-2, 3-3, 3-4는 Phase 3-1 완료 후 **병렬 진행 가능**
- Phase 3-5, 3-6은 Phase 3-3 완료 후 진행 권장
- Phase 3-7은 모든 Phase 완료 후 진행

---

## 성공 기준

### Phase 3 완료 시 달성 상태 (현재 진행률: 100%) ✅

#### 기능 완성도

- ✅ **회원가입 (MVP)**: 새 사용자가 회원가입하고 대시보드 진입 가능 (Phase 3-2 완료)
- ✅ **역할별 메인 화면**: soonja, younghee, cheolsu, newuser 각자 다른 화면 (Phase 3-1 완료)
- ✅ **AI 대화**: 노인이 AI와 실시간 대화 가능 (Phase 3-4 완료)
- ✅ **보호자 관계**: 노인 ↔ 보호자 관계 성립 및 관리 (Phase 3-3 완료)
- ✅ **공통 컴포넌트**: Toast, Modal, EmptyState, NavigationBar (Phase 3-7 완료)
- ✅ **설정 관리**: 내 정보 수정, 안부 메시지 ON/OFF, 비밀번호 변경 (Phase 3-5 완료)
- ✅ **알림 기능**: 알림 목록 조회 및 상세 확인 (Phase 3-6 완료)

#### 사용자 여정 재현

- ✅ **Journey 1 (MVP)** (첫 시작): 회원가입 → ✅ 대시보드 (Phase 3-2 완료)
- ✅ **Journey 2** (안부 메시지): 푸시 알림 → ✅ AI 대화 (Phase 3-4 완료, 푸시 알림 제외)
- ✅ **Journey 3** (보호자 등록): 검색 → 요청 → 수락 (Phase 3-3 완료)
- ✅ **Journey 4** (보호자 알림): 이상 징후 감지 → 알림 수신 (Phase 3-6 완료, Mock 데이터)

#### 기술 지표

- ✅ **코드 커버리지**: 핵심 기능 100% 완료 (인증, 메인 화면, 보호자 관계, AI 대화, 설정, 알림, 공통 컴포넌트)
- ✅ **TypeScript 에러**: 0건 (Phase 3-1~3-7 모두 유지)
- ✅ **ESLint 경고**: 0건 (Phase 3-7에서 모든 경고 해결)
- ✅ **빌드 성공**: npm run build 성공 (Phase 3-1~3-7 모두 유지)

#### 사용성

- ✅ **노인 친화적**: 터치 영역 60px+, 폰트 20px+ (모든 컴포넌트에 적용)
- ✅ **일관된 피드백**: Toast로 성공/에러 메시지 통일 (Phase 3-7 완료)
- ✅ **접근성**: ESC 키, 키보드 네비게이션, aria-label 적용 (Phase 3-7 완료)
- ⏳ **반응 속도**: API 응답 2초 이내 (API 연결 전)
- ✅ **에러 처리**: 모든 에러에 Toast 메시지 표시 (Phase 3-7 완료)

---

## 다음 단계

### 🎉 Phase 3 전체 완료!

**완료된 Phase**:
- ✅ Phase 3-1: 기반 확립 (역할별 동적 메인 화면)
- ✅ Phase 3-2: 회원가입 (MVP)
- ✅ Phase 3-3: 보호자 관계 관리
- ✅ Phase 3-4: AI 대화 기능
- ✅ Phase 3-5: 설정 관리
- ✅ Phase 3-6: 알림 기능
- ✅ Phase 3-7: 공통 기능 보완

**세부 계획 문서**:
- ✅ `docs/phases/phase3-1-foundation.md` (완료)
- ✅ `docs/phases/phase3-2-onboarding.md` (완료)
- ✅ `docs/phases/phase3-3-guardian.md` (완료)
- ✅ `docs/phases/phase3-4-conversation.md` (완료)
- ✅ `docs/phases/phase3-5-settings.md` (완료)
- ✅ `docs/phases/phase3-6-notification.md` (완료)
- ✅ `docs/phases/phase3-7-polish.md` (완료)

---

### Phase 3-8: API 연결 (다음 단계)

**목표**: Mock 데이터를 실제 백엔드 API로 교체

**핵심 작업**:
1. 인증 API 연결 (로그인, 회원가입)
2. 회원 관리 API 연결 (프로필 조회/수정, 비밀번호 변경)
3. 보호자 관계 API 연결 (검색, 요청, 수락/거절)
4. AI 대화 API 연결 (메시지 전송, 이력 조회)
5. 알림 API 연결 (목록 조회, 읽음 처리)
6. 설정 API 연결 (dailyCheckEnabled 업데이트)

**예상 소요 시간**: 2-3일

---

### Phase 4: 고도화 기능

**추가할 기능**:

- FCM 푸시 알림 연동
- 이상 징후 자동 감지 (3일 연속 NEGATIVE 등)
- 무응답 감지 (24시간 무응답)
- 알림 배지 카운트 (미읽음 개수)
- 알림 필터링 (종류별, 읽음/안읽음)
- 오프라인 대화 저장 및 동기화
- 성능 최적화 (React.memo, useMemo)
- PWA 오프라인 지원 강화
- 프로필 이미지 업로드

**Phase 4 시작 조건**:

- ✅ Phase 3-1 ~ 3-7 모두 완료
- ⏳ Phase 3-8 (API 연결) 완료
- ⏳ 주요 버그 수정 완료
- ⏳ 통합 테스트 통과

---

## 부록

### 세부 계획 작성 규칙

각 Phase 시작 시 다음 형식으로 세부 계획을 작성합니다:

1. **Phase 개요**: 목표, 범위, 제약사항
2. **작업 분해**: Task 단위로 세분화 (1-2시간 단위)
3. **구현 가이드**: 파일 구조, 코드 예시, API 명세
4. **테스트 계획**: 단위 테스트, 통합 테스트 시나리오
5. **완료 체크리스트**: 기능, 코드 품질, 문서화

### 문서 위치

- **큰 틀 계획**: `docs/PHASE3_EXECUTION_PLAN.md` (본 문서)
- **세부 계획**: `docs/phases/phase3-{N}-{name}.md`
  - 예: `docs/phases/phase3-1-foundation.md`
  - 예: `docs/phases/phase3-3-guardian.md`

---

**📅 문서 작성일**: 2025-10-12
**📅 최종 업데이트**: 2025-10-25
**✏️ 작성자**: Claude Code
**🔄 버전**: 1.7.0
**✅ 완료**: Phase 3 전체 완료 (3-1 ~ 3-7) 🎉
**📍 다음 단계**: Phase 3-8 (API 연결) 세부 계획 작성 및 구현 시작
