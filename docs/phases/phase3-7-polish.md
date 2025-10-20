# Phase 3-7: 공통 기능 보완 (Polish) - 세부 구현 계획

**작성일**: 2025-10-19
**최종 업데이트**: 2025-10-19 (v1.0.0)
**예상 소요 시간**: 1-2일 (10-12시간)
**상태**: 📋 준비 완료
**우선순위**: 🟢 중간 (Phase 3-5, 3-6에서 공통 컴포넌트 재사용)
**구현 원칙**: UI/UX 개선 및 공통 컴포넌트 구축
**API 연결**: ❌ 이 Phase는 API 연결 없음 (순수 프론트엔드)
**의존성**: Phase 3-1 ~ 3-4 완료 (기술 부채 TODO 주석 존재)

---

## 📋 목차

1. [Phase 개요](#phase-개요)
2. [현재 상태 분석](#현재-상태-분석)
3. [최소 구현 원칙](#최소-구현-원칙)
4. [기술 부채 해결](#기술-부채-해결)
5. [작업 분해](#작업-분해)
6. [Task별 구현 가이드](#task별-구현-가이드)
7. [테스트 계획](#테스트-계획)
8. [완료 체크리스트](#완료-체크리스트)

---

## Phase 개요

### 목표

사용자 경험 개선 및 공통 컴포넌트 구축으로 코드 품질과 일관성 향상. Phase 3-5 (설정 관리), Phase 3-6 (알림 기능)에서 재사용할 공통 컴포넌트를 먼저 구축한다.

### 핵심 요구사항

**Phase 3-1 ~ 3-4에서 쌓인 기술 부채 해결**:

```
[현재 상태]
- alert() 사용: 7곳 (ConversationPage, GuardianSearchPage, GuardianRequestsPage)
- 임시 Modal: 1곳 (GuardianSearchPage)
- NavigationBar 없음: 페이지 간 이동이 뒤로가기 버튼만 의존

[목표 상태]
- Toast 컴포넌트로 통일: 성공/에러/정보 메시지
- Modal 컴포넌트로 통일: 확인 다이얼로그
- NavigationBar 추가: [홈] [대화] [알림] [설정] 4개 탭
```

**우선순위 선정 이유**:

Phase 3-7을 Phase 3-5보다 **먼저** 진행하는 이유:
1. ✅ Toast, Modal이 Phase 3-5 (설정 관리)에서 필요
2. ✅ NavigationBar가 Phase 3-5, 3-6에서 필요
3. ✅ 공통 컴포넌트를 먼저 구축하면 이후 Phase에서 반복 작업 최소화

### 범위

**포함**:

- ✅ Toast 컴포넌트 구현
  - 성공/에러/정보 메시지 표시
  - 자동 사라짐 (3초 default)
  - Zustand 기반 상태 관리
- ✅ Modal 컴포넌트 구현
  - 제목 + 내용 + 확인/취소 버튼
  - ESC 키로 닫기
  - 배경 클릭 시 닫기 (옵션)
- ✅ EmptyState 컴포넌트 구현
  - 이모지 + 제목 + 설명 + 액션 버튼
  - 빈 상태 UI 통일
- ✅ NavigationBar 구현
  - [홈] [대화] [알림] [설정] 4개 탭
  - 현재 페이지 하이라이트
  - Lucide 아이콘 사용
- ✅ 기존 코드 리팩토링
  - alert() → Toast 교체 (7곳)
  - 임시 Modal → Modal 컴포넌트 교체 (1곳)

**제외**:

- ❌ API 연결 (이 Phase는 순수 UI/UX 개선)
- ❌ 에러 바운더리 개선 (이미 ErrorBoundary 존재)
- ❌ 오프라인 지원 (Phase 4)
- ❌ 성능 최적화 (React.memo, useMemo - Phase 4)

---

## 현재 상태 분석

### 기존 UI 컴포넌트 현황

**이미 구현됨** (`src/shared/components/ui/`):
- ✅ Button (variant: primary/secondary/danger, size: large/extra-large)
- ✅ Input (size: medium/large)
- ✅ Card (padding: small/medium/large)
- ✅ LoadingSpinner
- ✅ ErrorBoundary

**이미 구현됨** (`src/shared/components/layout/`):
- ✅ Layout (Header + Main, 뒤로가기 버튼)

**구현 필요** (이 Phase에서 추가):
- ❌ Toast
- ❌ Modal
- ❌ EmptyState
- ❌ NavigationBar

### 기술 부채 현황

**TODO: Phase 3-7 주석 통계**:

| 파일 | 위치 | 교체 대상 | 개수 |
|------|------|----------|------|
| `ConversationPage.tsx` | 31번째 줄 | `alert()` | 1 |
| `GuardianSearchPage.tsx` | 41, 45번째 줄 | `alert()` | 2 |
| `GuardianSearchPage.tsx` | 119번째 줄 | 임시 Modal | 1 |
| `GuardianRequestsPage.tsx` | 35, 50, 59, 72번째 줄 | `alert()` | 4 |

**총 교체 대상**: 8곳

### 사용자 피드백 일관성 문제

**현재 상태**:
```typescript
// ❌ Bad: alert()로 인한 UX 문제
alert('보호자 등록 요청을 보냈습니다!'); // 브라우저 네이티브 다이얼로그
alert('메시지 전송에 실패했습니다'); // 일관성 없는 메시지 스타일
```

**목표 상태**:
```typescript
// ✅ Good: Toast로 통일
toast.success('보호자 등록 요청을 보냈습니다!');
toast.error('메시지 전송에 실패했습니다');
```

---

## 최소 구현 원칙

### 1. Toast는 Zustand 기반 상태 관리

**이유**:
- ✅ 여러 컴포넌트에서 Toast 호출 가능
- ✅ Portal로 body에 렌더링 (z-index 문제 해결)
- ✅ 간단한 API: `toast.success()`, `toast.error()`, `toast.info()`

```typescript
// ✅ Good: Zustand store
interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

// ❌ Bad: Context API (과도한 복잡성)
// ❌ Bad: Props drilling (불편함)
```

### 2. Modal은 재사용 가능한 Headless 스타일

```typescript
// ✅ Good: 유연한 API
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="보호자 등록"
>
  <p>김영희님을 보호자로 등록할까요?</p>
</Modal>

// ❌ Bad: 너무 많은 props
<Modal
  confirmText="등록하기"
  cancelText="취소"
  onConfirm={...}
  onCancel={...}
  variant="primary"
  ... // 10개 이상의 props
/>
```

### 3. NavigationBar는 Layout과 분리

```typescript
// ✅ Good: Layout은 Header만, NavigationBar는 별도
<Layout title="대시보드">
  <div>콘텐츠</div>
  <NavigationBar /> {/* 각 페이지에서 선택적 사용 */}
</Layout>

// ❌ Bad: Layout에 NavigationBar 강제 포함
<Layout title="대시보드" showNav={true}> {/* 복잡성 증가 */}
```

**이유**:
- ✅ 로그인 페이지 등 NavigationBar 불필요한 페이지 존재
- ✅ 페이지별로 NavigationBar 표시 여부 제어 가능

### 4. EmptyState는 단순하게

```typescript
// ✅ Good: 이모지 + 텍스트 + 버튼 (선택)
<EmptyState
  emoji="📭"
  title="받은 요청이 없습니다"
  description="보호자 요청을 받으면 여기에 표시됩니다"
/>

// ❌ Bad: 과도한 커스터마이징
<EmptyState
  icon={<CustomIcon />}
  titleColor="blue"
  descriptionSize="lg"
  ... // 불필요한 props
/>
```

---

## 기술 부채 해결

### Phase 3-1 ~ 3-4에서 남긴 TODO 주석

**TODO 주석 형식**:
```typescript
// TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
alert('메시지');
```

**해결 계획**:

#### 1. ConversationPage.tsx (1곳)

**Before**:
```typescript
const handleSend = async (content: string) => {
  try {
    await sendMessage(content);
  } catch {
    // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
    alert('메시지 전송에 실패했습니다');
  }
};
```

**After**:
```typescript
import { useToast } from '@/shared/hooks/useToast';

const handleSend = async (content: string) => {
  const toast = useToast();
  try {
    await sendMessage(content);
  } catch {
    toast.error('메시지 전송에 실패했습니다');
  }
};
```

#### 2. GuardianSearchPage.tsx (2곳 alert, 1곳 임시 Modal)

**Before (alert)**:
```typescript
try {
  await requestGuardian({ guardianId: selectedGuardian.id });
  // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
  alert('보호자 등록 요청을 보냈습니다!');
  navigate(ROUTES.GUARDIANS);
} catch (error) {
  // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
  alert('요청에 실패했습니다');
}
```

**After (Toast)**:
```typescript
const toast = useToast();

try {
  await requestGuardian({ guardianId: selectedGuardian.id });
  toast.success('보호자 등록 요청을 보냈습니다!');
  navigate(ROUTES.GUARDIANS);
} catch (error) {
  toast.error('요청에 실패했습니다');
}
```

**Before (임시 Modal)**:
```typescript
{/* TODO: Phase 3-7에서 공통 Modal 컴포넌트로 교체 예정 */}
{showConfirmDialog && selectedGuardian && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <Card padding="large" className="max-w-md w-full space-y-4">
      <h2>보호자 등록</h2>
      {/* ... */}
    </Card>
  </div>
)}
```

**After (Modal 컴포넌트)**:
```typescript
<Modal
  isOpen={showConfirmDialog}
  onClose={() => setShowConfirmDialog(false)}
  title="보호자 등록"
>
  <div className="space-y-4">
    <p className="text-lg">
      <span className="font-semibold">{selectedGuardian?.name}</span>님을
      보호자로 등록할까요?
    </p>
    <div className="text-base text-gray-600 space-y-1">
      <p>• 이상 징후 발생 시 알림</p>
      <p>• 대화 내역 공유</p>
    </div>
    <div className="flex gap-3">
      <Button
        variant="secondary"
        size="large"
        fullWidth
        onClick={() => setShowConfirmDialog(false)}
      >
        취소
      </Button>
      <Button
        variant="primary"
        size="large"
        fullWidth
        onClick={handleConfirmRequest}
      >
        등록하기
      </Button>
    </div>
  </div>
</Modal>
```

#### 3. GuardianRequestsPage.tsx (4곳)

**Before**:
```typescript
// TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
alert('보호자 요청을 수락했습니다!');
alert('수락에 실패했습니다');
alert('보호자 요청을 거절했습니다');
alert('거절에 실패했습니다');
```

**After**:
```typescript
toast.success('보호자 요청을 수락했습니다!');
toast.error('수락에 실패했습니다');
toast.info('보호자 요청을 거절했습니다');
toast.error('거절에 실패했습니다');
```

---

## 작업 분해

### Task 1: Toast 컴포넌트 및 훅 구현 (2-3시간)

**목표**: 성공/에러/정보 메시지를 표시하는 Toast 시스템 구축

**파일 구조**:
```
src/shared/
├── components/ui/Toast/
│   ├── Toast.tsx
│   ├── Toast.types.ts
│   ├── ToastContainer.tsx
│   └── index.ts
└── hooks/
    └── useToast.ts
```

**체크리스트**:
- [ ] Toast 타입 정의 (success, error, info)
- [ ] Toast 컴포넌트 구현 (fade-in/out 애니메이션)
- [ ] ToastContainer 구현 (Portal, 상단 중앙 고정)
- [ ] useToast 훅 구현 (Zustand 기반)
- [ ] App.tsx에 ToastContainer 추가

---

### Task 2: Modal 컴포넌트 구현 (2시간)

**목표**: 재사용 가능한 확인 다이얼로그 컴포넌트

**파일 구조**:
```
src/shared/components/ui/Modal/
├── Modal.tsx
├── Modal.types.ts
└── index.ts
```

**체크리스트**:
- [ ] Modal 타입 정의 (isOpen, onClose, title, children)
- [ ] Modal 컴포넌트 구현 (Portal, ESC 키, 배경 클릭)
- [ ] focus-trap으로 키보드 접근성 개선
- [ ] backdrop-blur 스타일링

---

### Task 3: EmptyState 컴포넌트 구현 (1시간)

**목표**: 빈 상태 UI 통일

**파일 구조**:
```
src/shared/components/ui/EmptyState/
├── EmptyState.tsx
├── EmptyState.types.ts
└── index.ts
```

**체크리스트**:
- [ ] EmptyState 타입 정의
- [ ] 이모지 + 제목 + 설명 + 버튼 레이아웃
- [ ] 노인 친화적 스타일링

---

### Task 4: NavigationBar 구현 (2-3시간)

**목표**: 하단 네비게이션 바 ([홈] [대화] [알림] [설정])

**파일 구조**:
```
src/shared/components/layout/NavigationBar/
├── NavigationBar.tsx
├── NavigationBar.types.ts
└── index.ts
```

**체크리스트**:
- [ ] 4개 탭 정의 (홈, 대화, 알림, 설정)
- [ ] Lucide 아이콘 사용 (Home, MessageCircle, Bell, Settings)
- [ ] 현재 페이지 하이라이트 (useLocation)
- [ ] 고정 하단 (fixed bottom-0)
- [ ] 노인 친화적 크기 (72px 높이)

---

### Task 5: alert() → Toast 교체 (2시간)

**목표**: 7개 파일의 alert() 호출을 useToast()로 교체

**파일 목록**:
- [ ] `ConversationPage.tsx`: 1곳
- [ ] `GuardianSearchPage.tsx`: 2곳
- [ ] `GuardianRequestsPage.tsx`: 4곳

---

### Task 6: 임시 Modal → Modal 컴포넌트 교체 (1시간)

**목표**: GuardianSearchPage의 임시 Modal을 공통 컴포넌트로 교체

**파일**:
- [ ] `GuardianSearchPage.tsx`: 확인 다이얼로그

---

## Task별 구현 가이드

### Task 1: Toast 컴포넌트 구현

#### 1.1 Toast 타입 정의 (`Toast.types.ts`)

```typescript
/**
 * Toast 메시지 타입
 */
export type ToastType = 'success' | 'error' | 'info';

/**
 * Toast 객체
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ms, default 3000
}

/**
 * Toast 컴포넌트 Props
 */
export interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

/**
 * ToastContainer Props
 */
export interface ToastContainerProps {
  // Portal로 렌더링되므로 props 불필요
}
```

#### 1.2 Toast 컴포넌트 (`Toast.tsx`)

```typescript
import { useEffect } from 'react';
import type { ToastProps } from './Toast.types';

const TOAST_STYLES = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

const TOAST_ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

/**
 * Toast 메시지 컴포넌트
 * - 노인 친화적 큰 폰트 (text-xl)
 * - 자동 사라짐 (3초 default)
 * - fade-in/out 애니메이션
 */
export function Toast({ toast, onRemove }: ToastProps) {
  const { id, message, type, duration = 3000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <div
      className={`
        ${TOAST_STYLES[type]}
        rounded-2xl px-6 py-4 shadow-lg
        flex items-center gap-4
        animate-fade-in
        min-w-[320px] max-w-md
      `}
      role="alert"
      aria-live="polite"
    >
      {/* 아이콘 */}
      <span className="text-3xl font-bold">{TOAST_ICONS[type]}</span>

      {/* 메시지 */}
      <p className="text-xl font-medium flex-1">{message}</p>

      {/* 닫기 버튼 */}
      <button
        onClick={() => onRemove(id)}
        className="text-2xl hover:opacity-80 transition-opacity"
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
}
```

#### 1.3 ToastContainer (`ToastContainer.tsx`)

```typescript
import { createPortal } from 'react-dom';
import { useToastStore } from '@/shared/hooks/useToast';
import { Toast } from './Toast';

/**
 * Toast 컨테이너 (Portal로 body에 렌더링)
 * - 위치: 화면 상단 중앙
 * - z-index: 9999 (최상위)
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] space-y-3"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
}
```

#### 1.4 useToast 훅 (`hooks/useToast.ts`)

```typescript
import { create } from 'zustand';
import type { Toast, ToastType } from '@/shared/components/ui/Toast/Toast.types';

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

/**
 * Toast 상태 관리 (Zustand)
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (message, type, duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, message, type, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

/**
 * Toast 편의 함수 훅
 *
 * @example
 * const toast = useToast();
 * toast.success('성공했습니다!');
 * toast.error('오류가 발생했습니다');
 * toast.info('알림 메시지');
 */
export function useToast() {
  const { addToast } = useToastStore();

  return {
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
  };
}
```

#### 1.5 Tailwind 애니메이션 추가 (`tailwind.config.js`)

```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
      },
    },
  },
};
```

#### 1.6 App.tsx에 ToastContainer 추가

```typescript
import { ToastContainer } from '@/shared/components/ui/Toast';

export function App() {
  return (
    <div>
      {/* 기존 라우터 */}
      <RouterProvider router={router} />

      {/* Toast Container 추가 */}
      <ToastContainer />
    </div>
  );
}
```

---

### Task 2: Modal 컴포넌트 구현

#### 2.1 Modal 타입 정의 (`Modal.types.ts`)

```typescript
import type { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeOnBackdrop?: boolean; // default true
  closeOnEsc?: boolean; // default true
}
```

#### 2.2 Modal 컴포넌트 (`Modal.tsx`)

```typescript
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps } from './Modal.types';

/**
 * 재사용 가능한 Modal 컴포넌트
 * - ESC 키로 닫기
 * - 배경 클릭 시 닫기 (옵션)
 * - 노인 친화적 큰 텍스트
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
}: ModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[9998]"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // 배경 클릭 시 닫기 방지
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* 제목 */}
        {title && (
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
            {title}
          </h2>
        )}

        {/* 내용 */}
        <div className="text-lg text-gray-700">{children}</div>
      </div>
    </div>,
    document.body
  );
}
```

---

### Task 3: EmptyState 컴포넌트 구현

#### 3.1 EmptyState 타입 정의 (`EmptyState.types.ts`)

```typescript
export interface EmptyStateProps {
  emoji: string;
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}
```

#### 3.2 EmptyState 컴포넌트 (`EmptyState.tsx`)

```typescript
import type { EmptyStateProps } from './EmptyState.types';

/**
 * 빈 상태 UI 컴포넌트
 * - 노인 친화적 큰 이모지 + 텍스트
 * - 선택적 액션 버튼
 */
export function EmptyState({ emoji, title, description, actionButton }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* 이모지 */}
      <div className="text-6xl mb-4">{emoji}</div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

      {/* 설명 */}
      {description && <p className="text-lg text-gray-600 mb-6">{description}</p>}

      {/* 액션 버튼 */}
      {actionButton}
    </div>
  );
}
```

---

### Task 4: NavigationBar 구현

#### 4.1 NavigationBar 타입 정의 (`NavigationBar.types.ts`)

```typescript
export interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}
```

#### 4.2 NavigationBar 컴포넌트 (`NavigationBar.tsx`)

```typescript
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Bell, Settings } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import type { NavigationItem } from './NavigationBar.types';

const NAV_ITEMS: NavigationItem[] = [
  {
    path: ROUTES.DASHBOARD,
    label: '홈',
    icon: <Home size={32} />,
  },
  {
    path: ROUTES.CONVERSATION,
    label: '대화',
    icon: <MessageCircle size={32} />,
  },
  {
    path: '/alerts', // Phase 3-6에서 추가
    label: '알림',
    icon: <Bell size={32} />,
  },
  {
    path: '/settings', // Phase 3-5에서 추가
    label: '설정',
    icon: <Settings size={32} />,
  },
];

/**
 * 하단 네비게이션 바
 * - [홈] [대화] [알림] [설정] 4개 탭
 * - 현재 페이지 하이라이트
 * - Lucide 아이콘 사용 (CLAUDE.md 준수)
 */
export function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      role="navigation"
      aria-label="메인 네비게이션"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-[72px] px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center
                w-full h-full
                transition-colors
                ${isActive ? 'text-blue-600' : 'text-gray-500'}
                hover:text-blue-600
                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
              `}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* 아이콘 */}
              <div className="mb-1">{item.icon}</div>

              {/* 라벨 */}
              <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>

              {/* 활성 표시 */}
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-blue-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

---

## 테스트 계획

### 컴포넌트 단위 테스트

#### Toast 테스트
1. ✅ `toast.success()` 호출 시 녹색 Toast 표시
2. ✅ `toast.error()` 호출 시 빨간색 Toast 표시
3. ✅ 3초 후 자동으로 사라짐
4. ✅ 닫기 버튼 클릭 시 즉시 사라짐
5. ✅ 여러 Toast 동시 표시 가능 (Stack)

#### Modal 테스트
1. ✅ `isOpen={true}` 시 Modal 표시
2. ✅ ESC 키로 닫기
3. ✅ 배경 클릭 시 닫기
4. ✅ Modal 내부 클릭 시 닫히지 않음
5. ✅ body 스크롤 방지

#### NavigationBar 테스트
1. ✅ 현재 페이지 하이라이트 (파란색)
2. ✅ 탭 클릭 시 페이지 이동
3. ✅ 비활성 탭은 회색
4. ✅ 키보드 접근 가능 (Tab 키)

### 통합 테스트 시나리오

#### 시나리오 1: 보호자 등록 플로우 (Toast + Modal)

1. 김순자 로그인
2. 보호자 관리 → 보호자 찾기
3. "younghee@example.com" 검색
4. 김영희 선택 → **Modal 표시** (공통 Modal 사용)
5. "등록하기" 클릭 → **Toast 표시** (성공 메시지)
6. /guardians로 돌아옴

**예상 결과**:
- ✅ Modal이 중앙에 표시됨 (ESC로 닫기 가능)
- ✅ Toast가 상단에 표시됨 (3초 후 사라짐)
- ✅ alert() 없음

#### 시나리오 2: 네트워크 에러 (Toast)

1. 대화 페이지 진입
2. "안녕하세요 [error]" 입력 후 전송
3. 에러 발생 → **Toast 표시** (에러 메시지)

**예상 결과**:
- ✅ 빨간색 Toast 표시
- ✅ "메시지 전송에 실패했습니다" 메시지
- ✅ alert() 없음

#### 시나리오 3: NavigationBar 이동

1. 대시보드 접근 → [홈] 탭 파란색
2. [대화] 탭 클릭 → /conversation 이동
3. [대화] 탭 파란색으로 변경
4. [알림] 탭 클릭 → /alerts 이동 (Phase 3-6에서 구현)

**예상 결과**:
- ✅ 현재 페이지 탭만 파란색
- ✅ 다른 탭은 회색
- ✅ NavigationBar 고정 하단

---

## 완료 체크리스트

### 기능 완성도

- [ ] Toast 컴포넌트 구현 완료
- [ ] Modal 컴포넌트 구현 완료
- [ ] EmptyState 컴포넌트 구현 완료
- [ ] NavigationBar 구현 완료
- [ ] alert() → Toast 교체 완료 (7곳)
- [ ] 임시 Modal → Modal 컴포넌트 교체 완료 (1곳)
- [ ] App.tsx에 ToastContainer 추가
- [ ] Tailwind 애니메이션 설정

### 코드 품질

- [ ] TypeScript 빌드 에러 0건
- [ ] ESLint 경고 0건
- [ ] 모든 컴포넌트 타입 정의 완료
- [ ] TODO 주석 제거 (Phase 3-7 관련)

### 사용자 경험

- [ ] Toast 노인 친화적 크기 (text-xl)
- [ ] Modal ESC 키로 닫기 작동
- [ ] NavigationBar 터치 영역 충분 (72px)
- [ ] 모든 컴포넌트 키보드 접근 가능

### 테스트

- [ ] Toast 단위 테스트 통과
- [ ] Modal 단위 테스트 통과
- [ ] NavigationBar 단위 테스트 통과
- [ ] 시나리오 1 (보호자 등록) 통과
- [ ] 시나리오 2 (네트워크 에러) 통과
- [ ] 시나리오 3 (NavigationBar 이동) 통과
- [ ] 빌드 성공 (npm run build)

### 문서화

- [ ] Phase 3-7 세부 계획서 작성 완료
- [ ] PHASE3_EXECUTION_PLAN.md 업데이트
- [ ] 컴포넌트 JSDoc 주석 작성

---

## 마무리

Phase 3-7 (공통 기능 보완) 완료 시:

1. **PHASE3_EXECUTION_PLAN.md 업데이트**
   - Phase 3-7 상태를 "완료"로 변경
   - 진행률 업데이트 (57% → 71%)

2. **다음 Phase 준비**
   - Phase 3-5 (설정 관리): Toast, Modal 재사용
   - Phase 3-6 (알림 기능): NavigationBar, EmptyState 재사용

3. **공통 컴포넌트 export 확인**
   ```typescript
   // src/shared/components/index.ts
   export { Toast, ToastContainer } from './ui/Toast';
   export { Modal } from './ui/Modal';
   export { EmptyState } from './ui/EmptyState';
   export { NavigationBar } from './layout/NavigationBar';
   ```

4. **기술 부채 해결 완료**
   - ✅ alert() 7곳 제거
   - ✅ 임시 Modal 1곳 제거
   - ✅ 일관된 사용자 피드백 시스템 확립

---

**📅 작성일**: 2025-10-19
**✏️ 작성자**: Claude Code
**🔄 버전**: 1.0.0
**📍 Phase**: 3-7 (공통 기능 보완)
**✅ 의존성**: Phase 3-1 ~ 3-4 완료 (기술 부채 TODO 주석 존재)
**🎯 목표**: 공통 컴포넌트 구축 및 Phase 3-5, 3-6에서 재사용
