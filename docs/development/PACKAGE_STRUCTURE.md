# MARUNI Client 패키지 구조 설계

## 🏗️ 서버 도메인 기반 클라이언트 구조

### 서버 도메인 아키텍처 (참조)
```
🔐 Foundation Layer (기반)
├── Member (회원 관리) ✅
└── Auth (JWT 인증) ✅

💬 Core Service Layer (핵심 서비스)
├── Conversation (AI 대화) ✅
├── DailyCheck (스케줄링) ✅
└── Guardian (보호자 관리) ✅

🚨 Integration Layer (통합/알림)
├── AlertRule (이상징후 감지) ✅
└── Notification (알림 서비스) ✅
```

## 📁 클라이언트 패키지 구조

### 전체 구조
```
src/
├── app/                      # 앱 설정 및 라우팅
│   ├── App.tsx              # 메인 앱 컴포넌트
│   ├── router.tsx           # 라우터 설정
│   └── providers/           # Context Provider들
├── shared/                   # 공유 모듈
│   ├── components/          # 공통 컴포넌트
│   ├── hooks/               # 공통 훅
│   ├── utils/               # 유틸리티 함수
│   ├── constants/           # 상수 정의
│   └── types/               # 공통 타입
├── features/                # 도메인별 기능 모듈
│   ├── auth/                # 인증 기능
│   ├── member/              # 회원 관리
│   ├── conversation/        # AI 대화
│   ├── daily-check/         # 안부 확인
│   ├── guardian/            # 보호자 관리
│   ├── alert/               # 알림 및 이상징후
│   └── notification/        # 푸시 알림
├── pages/                   # 페이지 컴포넌트
│   ├── auth/                # 로그인/회원가입
│   ├── dashboard/           # 메인 대시보드
│   ├── conversation/        # 대화 화면
│   ├── guardians/           # 보호자 관리
│   └── settings/            # 설정
└── assets/                  # 정적 자산
    ├── images/
    ├── icons/
    └── fonts/
```

## 🔍 상세 패키지 구조

### 1. `/app` - 애플리케이션 설정
```
src/app/
├── App.tsx                  # 메인 앱 컴포넌트
├── router.tsx               # React Router 설정
└── providers/
    ├── QueryProvider.tsx    # TanStack Query Provider
    ├── AuthProvider.tsx     # 인증 Context Provider
    └── NotificationProvider.tsx  # 알림 Context Provider
```

### 2. `/shared` - 공유 모듈
```
src/shared/
├── components/              # 재사용 가능한 UI 컴포넌트
│   ├── ui/                 # 기본 UI 컴포넌트
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── Header/
│   │   ├── BottomNav/
│   │   ├── Sidebar/
│   │   └── PageLayout/
│   └── forms/              # 폼 관련 컴포넌트
│       ├── FormField/
│       ├── ValidationMessage/
│       └── SubmitButton/
├── hooks/                  # 공통 커스텀 훅
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useAsync.ts
│   └── useKeyboard.ts
├── utils/                  # 유틸리티 함수
│   ├── api.ts              # API 클라이언트 설정
│   ├── storage.ts          # 로컬 스토리지 관리
│   ├── validation.ts       # 폼 검증 함수
│   ├── format.ts           # 날짜/시간 포맷팅
│   └── accessibility.ts    # 접근성 유틸리티
├── constants/              # 상수 정의
│   ├── api.ts              # API 엔드포인트
│   ├── routes.ts           # 라우트 경로
│   ├── storage.ts          # 스토리지 키
│   └── ui.ts               # UI 관련 상수
└── types/                  # 공통 타입 정의
    ├── api.ts              # API 응답 타입
    ├── auth.ts             # 인증 관련 타입
    └── common.ts           # 공통 타입
```

### 3. `/features` - 도메인별 기능 모듈
각 도메인은 독립적인 모듈로 구성하여 응집도를 높이고 결합도를 낮춤

#### 3.1 `/features/auth` - 인증 기능
```
src/features/auth/
├── components/             # 인증 관련 컴포넌트
│   ├── LoginForm/
│   ├── RegisterForm/
│   ├── LogoutButton/
│   └── ProtectedRoute/
├── hooks/                  # 인증 관련 훅
│   ├── useAuth.ts          # 인증 상태 관리
│   ├── useLogin.ts         # 로그인 로직
│   └── useLogout.ts        # 로그아웃 로직
├── api/                    # 인증 API
│   └── authApi.ts
├── store/                  # 인증 상태 스토어
│   └── authStore.ts        # Zustand 스토어
├── types/                  # 인증 타입
│   └── auth.types.ts
└── index.ts                # Export 모음
```

#### 3.2 `/features/member` - 회원 관리
```
src/features/member/
├── components/
│   ├── ProfileForm/
│   ├── ProfileView/
│   └── MemberSettings/
├── hooks/
│   ├── useMember.ts
│   └── useProfileUpdate.ts
├── api/
│   └── memberApi.ts
├── store/
│   └── memberStore.ts
├── types/
│   └── member.types.ts
└── index.ts
```

#### 3.3 `/features/conversation` - AI 대화
```
src/features/conversation/
├── components/
│   ├── ChatInterface/
│   ├── MessageBubble/
│   ├── MessageInput/
│   ├── EmotionIndicator/
│   └── ConversationHistory/
├── hooks/
│   ├── useConversation.ts
│   ├── useMessageSend.ts
│   └── useEmotionAnalysis.ts
├── api/
│   └── conversationApi.ts
├── store/
│   └── conversationStore.ts
├── types/
│   └── conversation.types.ts
└── index.ts
```

#### 3.4 `/features/daily-check` - 안부 확인
```
src/features/daily-check/
├── components/
│   ├── DailyCheckCard/
│   ├── ResponseOptions/
│   ├── CheckHistory/
│   └── QuickResponse/
├── hooks/
│   ├── useDailyCheck.ts
│   ├── useCheckResponse.ts
│   └── useCheckHistory.ts
├── api/
│   └── dailyCheckApi.ts
├── store/
│   └── dailyCheckStore.ts
├── types/
│   └── dailyCheck.types.ts
└── index.ts
```

#### 3.5 `/features/guardian` - 보호자 관리
```
src/features/guardian/
├── components/
│   ├── GuardianList/
│   ├── GuardianForm/
│   ├── RelationshipSelector/
│   └── NotificationSettings/
├── hooks/
│   ├── useGuardian.ts
│   ├── useGuardianAdd.ts
│   └── useNotificationSettings.ts
├── api/
│   └── guardianApi.ts
├── store/
│   └── guardianStore.ts
├── types/
│   └── guardian.types.ts
└── index.ts
```

#### 3.6 `/features/alert` - 알림 및 이상징후
```
src/features/alert/
├── components/
│   ├── AlertRuleList/
│   ├── AlertHistory/
│   ├── EmergencyAlert/
│   └── AlertSettings/
├── hooks/
│   ├── useAlertRule.ts
│   ├── useAlertHistory.ts
│   └── useEmergencyDetection.ts
├── api/
│   └── alertApi.ts
├── store/
│   └── alertStore.ts
├── types/
│   └── alert.types.ts
└── index.ts
```

#### 3.7 `/features/notification` - 푸시 알림
```
src/features/notification/
├── components/
│   ├── NotificationCenter/
│   ├── NotificationItem/
│   └── NotificationSettings/
├── hooks/
│   ├── useNotification.ts
│   ├── usePushNotification.ts
│   └── useNotificationPermission.ts
├── api/
│   └── notificationApi.ts
├── store/
│   └── notificationStore.ts
├── types/
│   └── notification.types.ts
└── index.ts
```

### 4. `/pages` - 페이지 컴포넌트
```
src/pages/
├── auth/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── index.ts
├── dashboard/
│   ├── DashboardPage.tsx
│   └── index.ts
├── conversation/
│   ├── ConversationPage.tsx
│   ├── ConversationHistoryPage.tsx
│   └── index.ts
├── guardians/
│   ├── GuardianListPage.tsx
│   ├── GuardianAddPage.tsx
│   └── index.ts
└── settings/
    ├── SettingsPage.tsx
    ├── ProfileSettingsPage.tsx
    ├── NotificationSettingsPage.tsx
    └── index.ts
```

## 🔗 도메인간 의존성 관리

### Import/Export 규칙
```typescript
// ✅ 같은 feature 내에서
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';

// ✅ shared 모듈에서
import { Button } from '@/shared/components/ui/Button';
import { useLocalStorage } from '@/shared/hooks';

// ✅ 다른 feature에서 (index.ts를 통해서만)
import { useAuth } from '@/features/auth';
import { useMember } from '@/features/member';

// ❌ 다른 feature의 내부 모듈 직접 접근 금지
import { authStore } from '@/features/auth/store/authStore'; // 금지
```

### 의존성 계층
```
Pages → Features → Shared
  ↓        ↓         ↓
 UI     Business   Utils
```

## 📋 패키지별 책임 분리

### Feature 모듈의 책임
- **Components**: 해당 도메인의 UI 컴포넌트
- **Hooks**: 도메인 비즈니스 로직과 상태 관리
- **API**: 서버와의 통신 로직
- **Store**: 클라이언트 상태 관리 (Zustand)
- **Types**: 도메인 특화 타입 정의

### Shared 모듈의 책임
- **Components**: 재사용 가능한 범용 UI 컴포넌트
- **Hooks**: 범용 커스텀 훅
- **Utils**: 공통 유틸리티 함수
- **Constants**: 전역 상수
- **Types**: 공통 타입 정의

### Pages의 책임
- **페이지 조합**: Feature 컴포넌트들을 조합하여 완성된 페이지 구성
- **라우팅**: URL과 페이지 매핑
- **레이아웃 적용**: 공통 레이아웃 컴포넌트 적용

## 🚀 확장성 고려사항

### 새 기능 추가 시
1. **새 도메인**: `/features/{domain}` 폴더 생성
2. **기존 도메인 확장**: 해당 feature 내부에 컴포넌트/훅 추가
3. **공통 기능**: `/shared` 모듈에 추가

### 성능 최적화
- **코드 스플리팅**: feature별 lazy loading
- **트리 셰이킹**: index.ts를 통한 명시적 export
- **청크 분리**: 도메인별 번들 분리

### 테스트 전략
- **단위 테스트**: 각 컴포넌트/훅별 테스트
- **통합 테스트**: feature별 통합 테스트
- **E2E 테스트**: pages별 사용자 시나리오 테스트

---

**🎯 이 구조는 서버의 도메인 아키텍처와 일관성을 유지하면서, 프론트엔드의 특성을 고려한 최적화된 설계입니다.**