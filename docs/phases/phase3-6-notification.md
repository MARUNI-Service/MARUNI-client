# Phase 3-6: 알림 기능 - 세부 구현 계획

**작성일**: 2025-10-25
**최종 업데이트**: 2025-10-25 (v1.0.0)
**예상 소요 시간**: 1-2일 (6-10시간)
**상태**: 📋 준비 완료
**우선순위**: 🟠 높음
**구현 원칙**: Mock 데이터 기반 구현 - 알림 목록 및 상세 확인 플로우 완성
**API 연결**: ❌ 이 Phase에서는 연결 안 함 - Phase 3-8에서 일괄 연결
**의존성**: Phase 3-1, 3-2, 3-3, 3-4, 3-5, 3-7 완료 필요

---

## 📋 목차

1. [Phase 개요](#phase-개요)
2. [API 연결 전략](#api-연결-전략)
3. [최소 구현 원칙](#최소-구현-원칙)
4. [기술 부채 관리](#기술-부채-관리)
5. [작업 분해](#작업-분해)
6. [Task별 구현 가이드](#task별-구현-가이드)
7. [테스트 계획](#테스트-계획)
8. [완료 체크리스트](#완료-체크리스트)

---

## Phase 개요

### 목표

사용자가 받은 알림 목록을 확인하고 상세 내용을 볼 수 있는 기능을 완성하여, 보호자 요청, 이상 징후 등의 알림을 효과적으로 확인할 수 있도록 한다.

### 핵심 요구사항

**알림 기능 플로우**:

```
[사용자] NavigationBar → 알림 탭 → 알림 목록
                                        ↓
                        [알림 카드] 클릭 → 알림 상세 화면
                                        ↓
                        읽음 처리 → 목록으로 돌아가기
```

**주요 기능**:
1. 🎯 알림 목록 조회 (읽음/안읽음 구분)
2. 🎯 알림 상세 확인
3. 🎯 알림 읽음 처리
4. 🎯 알림 종류별 아이콘 및 색상 표시
5. 🎯 빈 상태 처리 (알림 없을 때)

### 범위

**포함**:

- ✅ features/notification 모듈 생성
  - Notification 관련 타입 정의
  - Mock 알림 목록 API
  - Mock 알림 상세 조회 API
  - Mock 읽음 처리 API
  - useNotifications 훅
- ✅ 알림 화면 2개
  - /notifications - 알림 목록
  - /notifications/:id - 알림 상세 (선택적, 시간이 부족하면 Modal로 대체)
- ✅ 알림 기능
  - 알림 목록 조회 (최근 30일)
  - 읽음/안읽음 상태 표시
  - 알림 클릭 시 읽음 처리
  - 알림 종류별 아이콘 (보호자 요청, 이상 징후, 안부 메시지)
- ✅ Phase 3-7 공통 컴포넌트 재사용
  - EmptyState: 알림 없을 때
  - NavigationBar: 알림 탭 활성화
  - Card: 알림 카드

**제외**:

- ❌ FCM 푸시 알림 연동 (Phase 4)
- ❌ 실시간 알림 수신 (Phase 4)
- ❌ 알림 배지 카운트 (Phase 4)
- ❌ 알림 삭제 기능 (Phase 4)
- ❌ 알림 필터링 (종류별, 읽음/안읽음) (Phase 4)
- ❌ 알림 설정 (알림 종류별 ON/OFF) - Phase 3-5에서 dailyCheckEnabled만 구현

---

## API 연결 전략

### Phase 3-6: Mock 데이터로 알림 플로우 구현

**원칙**:

- **알림 목록 조회 및 상세 확인 플로우만 구현, 실제 API는 호출 안 함**
- localStorage에 Mock 알림 데이터 저장
- 읽음 처리 시 localStorage 업데이트
- 사용자별 알림 목록 구분 (현재 로그인한 사용자만)

### Phase 3-6에서 할 일

1. **알림 목록 조회**
   - Mock 알림 데이터 생성 (보호자 요청, 이상 징후, 안부 메시지)
   - localStorage에서 현재 사용자의 알림만 필터링
   - 최신순 정렬 (createdAt 기준)

2. **알림 상세 조회**
   - 알림 ID로 상세 내용 조회
   - 자동 읽음 처리 (isRead = true)

3. **읽음 처리**
   - 알림 클릭 시 isRead 업데이트
   - localStorage 동기화

### Phase 3-8에서 할 일 (API 연결)

1. **실제 API 연결**
   - `GET /api/notifications` - 알림 목록 조회
   - `GET /api/notifications/:id` - 알림 상세 조회
   - `PATCH /api/notifications/:id/read` - 읽음 처리

2. **FCM 푸시 알림 연동**
   - Firebase 설정
   - 푸시 알림 수신 처리
   - 알림 배지 카운트

---

## 최소 구현 원칙

### MVP 범위

**반드시 구현**:

1. ✅ 알림 목록 조회 (Mock)
2. ✅ 알림 클릭 시 상세 표시 (Modal 또는 별도 페이지)
3. ✅ 읽음/안읽음 상태 표시
4. ✅ 알림 종류별 아이콘 (보호자 요청, 이상 징후)
5. ✅ 빈 상태 처리 (EmptyState 재사용)

**나중에 추가 (Phase 4)**:

- ❌ 알림 배지 카운트 (NavigationBar에 읽지 않은 알림 수)
- ❌ 알림 삭제
- ❌ 알림 필터링
- ❌ 실시간 알림 수신

### UI/UX 가이드라인

- **터치 영역**: 알림 카드 높이 최소 80px (노인 친화적)
- **폰트 크기**: 알림 제목 20px, 내용 18px
- **색상**:
  - 안읽음: 파란색 점 표시
  - 읽음: 회색 배경
  - 이상 징후 (HIGH): 빨간색 아이콘
  - 보호자 요청 (MEDIUM): 노란색 아이콘
  - 일반 (LOW): 파란색 아이콘

---

## 기술 부채 관리

### TODO 주석으로 관리

Phase 3-6에서 Mock으로 구현한 부분은 다음과 같이 주석 달기:

```typescript
// TODO: [Phase 3-8] API 연결 시 실제 API 호출로 교체
export async function getNotifications(): Promise<Notification[]> {
  // Mock 데이터 반환
}

// TODO: [Phase 4] FCM 푸시 알림 연동
// 현재는 Mock 데이터만 표시, 실시간 알림은 Phase 4에서 구현
```

### Phase 3-8에서 개선할 사항

1. **API 연결**
   - Mock API → 실제 백엔드 API 호출
   - TanStack Query로 자동 갱신 (refetchOnFocus, polling 등)

2. **에러 처리**
   - 네트워크 에러 시 Toast 메시지
   - 재시도 로직

3. **성능 최적화**
   - 알림 목록 페이지네이션 (무한 스크롤)
   - 이미지 lazy loading

---

## 작업 분해

### Task 1: features/notification 모듈 생성 (2-3시간)

**목표**: 알림 관련 타입, Mock API, 훅 구현

**구현 파일**:

```
src/features/notification/
├── types/
│   ├── notification.types.ts   # Notification, NotificationType 등
│   └── index.ts
├── api/
│   ├── notificationApi.ts      # Mock 알림 API (목록, 상세, 읽음 처리)
│   └── index.ts
├── hooks/
│   ├── useNotifications.ts     # TanStack Query 훅
│   └── index.ts
└── index.ts
```

**타입 정의**:

```typescript
// notification.types.ts
export type NotificationType = 'GUARDIAN_REQUEST' | 'ALERT' | 'DAILY_CHECK' | 'SYSTEM';

export type NotificationLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface Notification {
  id: string;
  type: NotificationType;
  level: NotificationLevel;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO 8601
  data?: {
    // 타입별 추가 데이터
    guardianRequestId?: number;
    alertId?: number;
    conversationId?: number;
  };
}
```

**Mock API 구현**:

```typescript
// notificationApi.ts
export async function getNotifications(): Promise<Notification[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // localStorage에서 현재 사용자의 알림 조회
  const authStorage = localStorage.getItem('auth-storage');
  if (!authStorage) return [];

  const { state } = JSON.parse(authStorage);
  const currentUser = state.user;

  // Mock 알림 데이터 (사용자별)
  const mockNotifications: Notification[] = getMockNotificationsForUser(currentUser.id);

  // localStorage에 저장된 읽음 상태 반영
  const readStatus = JSON.parse(localStorage.getItem('notification-read-status') || '{}');
  return mockNotifications.map(noti => ({
    ...noti,
    isRead: readStatus[noti.id] || false,
  }));
}

export async function markAsRead(notificationId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const readStatus = JSON.parse(localStorage.getItem('notification-read-status') || '{}');
  readStatus[notificationId] = true;
  localStorage.setItem('notification-read-status', JSON.stringify(readStatus));
}
```

**useNotifications 훅**:

```typescript
// useNotifications.ts
export function useNotifications() {
  const toast = useToast();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  const { mutateAsync: markAsReadMutation } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('알림 읽음 처리에 실패했습니다');
    },
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation,
    unreadCount,
  };
}
```

---

### Task 2: 알림 목록 페이지 구현 (2-3시간)

**목표**: /notifications 경로에서 알림 목록 표시

**구현 파일**:

```
src/pages/notifications/
├── NotificationsPage.tsx       # 알림 목록 페이지
└── index.ts
```

**화면 구성**:

```typescript
// NotificationsPage.tsx
export function NotificationsPage() {
  const { notifications, isLoading, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    // Modal 또는 상세 페이지로 이동
    navigate(`/notifications/${notification.id}`);
  };

  if (isLoading) {
    return <Layout title="알림"><div>로딩 중...</div></Layout>;
  }

  if (notifications.length === 0) {
    return (
      <>
        <Layout title="알림">
          <EmptyState
            icon={<Bell size={64} />}
            title="알림이 없습니다"
            description="새로운 알림이 오면 여기에 표시됩니다"
          />
        </Layout>
        <NavigationBar />
      </>
    );
  }

  return (
    <>
      <Layout title="알림">
        <div className="space-y-2 pb-24">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
            />
          ))}
        </div>
      </Layout>
      <NavigationBar />
    </>
  );
}
```

**NotificationCard 컴포넌트**:

```typescript
// src/shared/components/business/NotificationCard/NotificationCard.tsx
interface NotificationCardProps {
  notification: Notification;
  onClick: () => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const icon = getNotificationIcon(notification.type, notification.level);
  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <Card
      padding="medium"
      onClick={onClick}
      className={cn(
        'cursor-pointer hover:bg-gray-50 transition-colors',
        !notification.isRead && 'bg-blue-50'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('flex-shrink-0', getLevelColor(notification.level))}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {notification.title}
            </h3>
            {!notification.isRead && (
              <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />
            )}
          </div>
          <p className="text-base text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-sm text-gray-400 mt-2">{timeAgo}</p>
        </div>
      </div>
    </Card>
  );
}

function getNotificationIcon(type: NotificationType, level: NotificationLevel) {
  if (level === 'HIGH' || level === 'EMERGENCY') {
    return <AlertCircle size={32} />;
  }

  switch (type) {
    case 'GUARDIAN_REQUEST':
      return <Users size={32} />;
    case 'ALERT':
      return <AlertTriangle size={32} />;
    case 'DAILY_CHECK':
      return <MessageCircle size={32} />;
    default:
      return <Bell size={32} />;
  }
}

function getLevelColor(level: NotificationLevel) {
  switch (level) {
    case 'EMERGENCY':
    case 'HIGH':
      return 'text-red-600';
    case 'MEDIUM':
      return 'text-yellow-600';
    case 'LOW':
    default:
      return 'text-blue-600';
  }
}

function formatTimeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '방금';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}
```

---

### Task 3: 알림 상세 페이지 구현 (1-2시간) - 선택적

**목표**: /notifications/:id 경로에서 알림 상세 표시

**구현 파일**:

```
src/pages/notifications/
├── NotificationDetailPage.tsx  # 알림 상세 페이지
└── index.ts (수정)
```

**화면 구성**:

```typescript
// NotificationDetailPage.tsx
export function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();

  const notification = notifications.find(n => n.id === id);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  if (!notification) {
    return (
      <Layout title="알림" showBack={true}>
        <EmptyState
          icon={<Bell size={64} />}
          title="알림을 찾을 수 없습니다"
          description="삭제되었거나 존재하지 않는 알림입니다"
        />
      </Layout>
    );
  }

  const icon = getNotificationIcon(notification.type, notification.level);
  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <Layout title="알림 상세" showBack={true}>
      <div className="space-y-6">
        <Card padding="large">
          <div className="flex items-start gap-4">
            <div className={cn('flex-shrink-0', getLevelColor(notification.level))}>
              {icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {notification.title}
              </h2>
              <p className="text-sm text-gray-400 mt-1">{timeAgo}</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 mt-6 whitespace-pre-wrap">
            {notification.message}
          </p>
        </Card>

        {/* 타입별 추가 액션 */}
        {notification.type === 'GUARDIAN_REQUEST' && (
          <Card padding="medium">
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={() => navigate('/guardians/requests')}
            >
              보호자 요청 확인하기
            </Button>
          </Card>
        )}

        {notification.type === 'ALERT' && (
          <Card padding="medium">
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={() => navigate('/conversation')}
            >
              대화 전체보기
            </Button>
          </Card>
        )}

        {notification.type === 'DAILY_CHECK' && (
          <Card padding="medium">
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={() => navigate('/conversation')}
            >
              답장하기
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}
```

**대안: Modal로 구현**

시간이 부족하면 별도 페이지 대신 Modal로 구현 가능:

```typescript
// NotificationsPage.tsx에서 Modal 사용
const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

<Modal
  isOpen={!!selectedNotification}
  onClose={() => setSelectedNotification(null)}
  title="알림 상세"
>
  {/* 알림 상세 내용 */}
</Modal>
```

---

### Task 4: 라우팅 설정 (30분)

**목표**: 알림 페이지 라우트 추가

**수정 파일**:

1. `src/shared/constants/routes.ts`

```typescript
// 알림 (Phase 3-6)
NOTIFICATIONS: '/notifications',
NOTIFICATION_DETAIL: '/notifications/:id', // 선택적
```

2. `src/app/router.tsx`

```typescript
import { NotificationsPage, NotificationDetailPage } from '@/pages/notifications';

// 라우트 추가
{
  path: ROUTES.NOTIFICATIONS,
  element: (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  ),
},
{
  path: ROUTES.NOTIFICATION_DETAIL, // 선택적
  element: (
    <ProtectedRoute>
      <NotificationDetailPage />
    </ProtectedRoute>
  ),
},
```

3. `src/pages/notifications/index.ts`

```typescript
export { NotificationsPage } from './NotificationsPage';
export { NotificationDetailPage } from './NotificationDetailPage'; // 선택적
```

---

### Task 5: NavigationBar 알림 탭 활성화 (30분)

**목표**: NavigationBar에서 알림 탭 활성화

**수정 파일**: `src/shared/components/layout/NavigationBar/NavigationBar.tsx`

현재 NavigationBar는 이미 알림 탭이 있으므로, 활성화 상태만 확인하면 됩니다.

**확인 사항**:

```typescript
// NavigationBar.tsx
const navItems = [
  { path: ROUTES.DASHBOARD, icon: <Home size={24} />, label: '홈' },
  { path: ROUTES.CONVERSATION, icon: <MessageCircle size={24} />, label: '대화' },
  { path: ROUTES.SETTINGS, icon: <Settings size={24} />, label: '설정' },
  { path: ROUTES.NOTIFICATIONS, icon: <Bell size={24} />, label: '알림' }, // 이미 있음
];
```

**배지 카운트 추가 (선택적, Phase 4에서 구현 예정)**:

```typescript
// TODO: [Phase 4] 알림 배지 카운트 추가
const { unreadCount } = useNotifications();

<div className="relative">
  <Bell size={24} />
  {unreadCount > 0 && (
    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
      <span className="text-xs text-white font-bold">{unreadCount}</span>
    </div>
  )}
</div>
```

---

### Task 6: Mock 알림 데이터 생성 (1시간)

**목표**: 다양한 타입의 Mock 알림 데이터 생성

**구현 파일**: `src/features/notification/api/mockNotificationData.ts`

```typescript
// mockNotificationData.ts
import type { Notification } from '../types';

export function getMockNotificationsForUser(userId: number): Notification[] {
  const now = new Date();

  // 김순자 (노인 - elderly) 알림
  if (userId === 123) {
    return [
      {
        id: 'noti-1',
        type: 'DAILY_CHECK',
        level: 'LOW',
        title: '오늘 기분이 어떠세요?',
        message: 'AI가 안부를 묻고 있습니다. 오늘 하루는 어떠셨나요?',
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000).toISOString(), // 1시간 전
      },
      {
        id: 'noti-2',
        type: 'SYSTEM',
        level: 'LOW',
        title: '보호자 등록이 완료되었습니다',
        message: '김영희님이 회원님의 보호자로 등록되었습니다.',
        isRead: true,
        createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(), // 2일 전
      },
    ];
  }

  // 김영희 (보호자 - guardian) 알림
  if (userId === 456) {
    return [
      {
        id: 'noti-3',
        type: 'ALERT',
        level: 'HIGH',
        title: '이상 징후가 감지되었습니다',
        message: '김순자님께서 3일간 우울한 감정을 보이고 있습니다. 확인이 필요합니다.',
        isRead: false,
        createdAt: new Date(now.getTime() - 1800000).toISOString(), // 30분 전
        data: { alertId: 1 },
      },
      {
        id: 'noti-4',
        type: 'GUARDIAN_REQUEST',
        level: 'MEDIUM',
        title: '보호자 요청이 왔습니다',
        message: '김순자님이 회원님을 보호자로 등록하길 원합니다.',
        isRead: true,
        createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(), // 3일 전
        data: { guardianRequestId: 1 },
      },
      {
        id: 'noti-5',
        type: 'ALERT',
        level: 'MEDIUM',
        title: '24시간 무응답',
        message: '김순자님이 24시간 동안 응답하지 않았습니다.',
        isRead: true,
        createdAt: new Date(now.getTime() - 86400000 * 5).toISOString(), // 5일 전
        data: { alertId: 2 },
      },
    ];
  }

  // 박철수 (다중 보호자) 알림
  if (userId === 789) {
    return [
      {
        id: 'noti-6',
        type: 'ALERT',
        level: 'EMERGENCY',
        title: '긴급 상황 감지',
        message: '부모님께서 "쓰러졌어요" 라는 메시지를 보내셨습니다. 즉시 확인이 필요합니다.',
        isRead: false,
        createdAt: new Date(now.getTime() - 600000).toISOString(), // 10분 전
        data: { alertId: 3 },
      },
    ];
  }

  // 신규 사용자: 빈 알림
  return [];
}
```

---

## 테스트 계획

### 수동 테스트 시나리오

#### 시나리오 1: 알림 목록 조회 (김영희 - 보호자)

1. **로그인**: `younghee@example.com` / `password123`
2. **NavigationBar**: [알림] 탭 클릭
3. **확인**: 3개의 알림 카드 표시
   - "이상 징후가 감지되었습니다" (안읽음, 빨간색 아이콘)
   - "보호자 요청이 왔습니다" (읽음, 회색 배경)
   - "24시간 무응답" (읽음, 회색 배경)
4. **확인**: 시간 표시 ("30분 전", "3일 전", "5일 전")

#### 시나리오 2: 알림 상세 확인 및 읽음 처리

1. **알림 클릭**: "이상 징후가 감지되었습니다" 클릭
2. **확인**: 알림 상세 페이지/Modal 표시
3. **확인**: 알림 아이콘, 제목, 시간, 메시지 표시
4. **확인**: [대화 전체보기] 버튼 표시
5. **뒤로 가기**: 알림 목록으로 돌아가기
6. **확인**: 해당 알림이 "읽음" 상태로 변경 (파란색 점 사라짐)

#### 시나리오 3: 빈 알림 목록 (신규 사용자)

1. **로그인**: `newuser@example.com` / `password123`
2. **NavigationBar**: [알림] 탭 클릭
3. **확인**: EmptyState 표시
   - 아이콘: Bell
   - 제목: "알림이 없습니다"
   - 설명: "새로운 알림이 오면 여기에 표시됩니다"

#### 시나리오 4: 알림 종류별 아이콘 확인

1. **로그인**: `younghee@example.com` / `password123`
2. **NavigationBar**: [알림] 탭 클릭
3. **확인**: 각 알림의 아이콘 및 색상
   - 이상 징후 (HIGH): AlertCircle, 빨간색
   - 보호자 요청 (MEDIUM): Users, 노란색
   - 무응답 (MEDIUM): AlertTriangle, 노란색

---

## 완료 체크리스트

### 기능

- [ ] features/notification 모듈 생성
  - [ ] notification.types.ts (Notification, NotificationType, NotificationLevel)
  - [ ] notificationApi.ts (getNotifications, markAsRead)
  - [ ] mockNotificationData.ts (getMockNotificationsForUser)
  - [ ] useNotifications.ts
- [ ] 알림 목록 페이지 (/notifications)
  - [ ] NotificationsPage.tsx
  - [ ] NotificationCard 컴포넌트
  - [ ] EmptyState 재사용
  - [ ] NavigationBar 표시
- [ ] 알림 상세 페이지 또는 Modal
  - [ ] NotificationDetailPage.tsx 또는 Modal
  - [ ] 타입별 액션 버튼 (보호자 요청 확인, 대화 전체보기 등)
- [ ] 라우팅 설정
  - [ ] ROUTES.NOTIFICATIONS 추가
  - [ ] router.tsx에 /notifications 라우트 추가
  - [ ] pages/notifications/index.ts export
- [ ] NavigationBar 알림 탭 활성화
  - [ ] 알림 탭 클릭 시 /notifications로 이동
- [ ] Mock 데이터
  - [ ] 김순자 알림 (DAILY_CHECK, SYSTEM)
  - [ ] 김영희 알림 (ALERT, GUARDIAN_REQUEST)
  - [ ] 박철수 알림 (EMERGENCY)

### 코드 품질

- [ ] TypeScript 빌드 에러 0건 (`npm run build`)
- [ ] ESLint 경고 0건 (`npm run lint`)
- [ ] 모든 컴포넌트에 한글 주석 추가
- [ ] TODO 주석으로 기술 부채 관리
- [ ] 노인 친화적 UI 적용 (터치 영역 80px+, 폰트 18px+)

### 테스트

- [ ] 시나리오 1: 알림 목록 조회 (김영희)
- [ ] 시나리오 2: 알림 상세 확인 및 읽음 처리
- [ ] 시나리오 3: 빈 알림 목록 (신규 사용자)
- [ ] 시나리오 4: 알림 종류별 아이콘 확인

### 문서화

- [ ] 이 계획 문서 작성 완료
- [ ] PHASE3_EXECUTION_PLAN.md 업데이트
  - [ ] Phase 3-6 진행 상황 업데이트
  - [ ] 버전 업데이트 (1.6.0 → 1.7.0)
  - [ ] 진행률 업데이트 (86% → 100%)

---

## 예상 일정

| Task | 예상 시간 | 비고 |
|------|----------|------|
| Task 1: features/notification 모듈 | 2-3시간 | 타입, API, 훅 |
| Task 2: 알림 목록 페이지 | 2-3시간 | NotificationsPage, NotificationCard |
| Task 3: 알림 상세 페이지 | 1-2시간 | 선택적 (Modal 대체 가능) |
| Task 4: 라우팅 설정 | 30분 | ROUTES, router.tsx |
| Task 5: NavigationBar 확인 | 30분 | 이미 구현됨, 확인만 |
| Task 6: Mock 데이터 생성 | 1시간 | 다양한 알림 데이터 |
| 테스트 및 버그 수정 | 1-2시간 | 4개 시나리오 |
| **총 예상 시간** | **8-12시간** | **1-2일** |

---

## 참고 자료

- [user-flow.md](../flows/user-flow.md) - Journey 4 (보호자의 알림 받기)
- [PHASE3_EXECUTION_PLAN.md](../PHASE3_EXECUTION_PLAN.md) - Phase 3-6 개요
- [phase3-7-polish.md](./phase3-7-polish.md) - EmptyState, NavigationBar 컴포넌트

---

**📅 문서 작성일**: 2025-10-25
**✏️ 작성자**: Claude Code
**🔄 버전**: 1.0.0
**📍 다음 단계**: Phase 3-6 구현 시작 → Phase 3-8 (API 연결)
