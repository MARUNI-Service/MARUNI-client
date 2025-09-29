# MARUNI 컴포넌트 설계 가이드라인

## 🎯 노인 친화적 컴포넌트 설계 원칙

### 1. 접근성 우선 (Accessibility First)
> 🎨 **디자인 세부 사항**: [디자인 시스템](../architecture/DESIGN_SYSTEM.md) 참조

- **터치 타겟**: 최소 48px, 권장 60px 이상
- **폰트 크기**: 최소 18px, 버튼 텍스트 20px 이상
- **색상 대비**: WCAG 2.1 AA 기준 (4.5:1) 이상
- **키보드 접근**: 모든 상호작용 요소 Tab 키로 접근 가능

### 2. 단순함 추구 (Simplicity)
- **한 가지 목적**: 컴포넌트당 하나의 명확한 역할
- **최소한의 상태**: 복잡한 상태 관리 지양
- **직관적 UI**: 설명 없이도 사용법을 알 수 있어야 함

### 3. 일관성 유지 (Consistency)
- **디자인 토큰**: UI_CONSTANTS 사용
- **네이밍 규칙**: 명확하고 일관된 Props 네이밍
- **동작 패턴**: 비슷한 컴포넌트는 동일한 동작

---

## 📋 컴포넌트 분류 체계

### 1. 기본 UI 컴포넌트 (Basic UI)
**위치**: `src/shared/components/ui/`
**특징**: 가장 원자적인 컴포넌트, 재사용성 높음

```typescript
// 예시: Button, Input, Card, Badge
// 의존성: 없음 (순수 컴포넌트)
// 스타일: Tailwind CSS 클래스
```

### 2. 레이아웃 컴포넌트 (Layout)
**위치**: `src/shared/components/layout/`
**특징**: 페이지 구조를 담당, 기본 UI 조합

```typescript
// 예시: Header, Footer, Sidebar, Layout
// 의존성: 기본 UI 컴포넌트
// 스타일: 구조적 스타일링
```

### 3. 폼 컴포넌트 (Forms)
**위치**: `src/shared/components/forms/`
**특징**: 사용자 입력 관련, 유효성 검사 포함

```typescript
// 예시: LoginForm, ProfileForm, SearchForm
// 의존성: 기본 UI + 상태 관리
// 기능: 유효성 검사, 에러 처리
```

### 4. 비즈니스 컴포넌트 (Business)
**위치**: `src/features/{domain}/components/`
**특징**: 특정 도메인 로직 포함

```typescript
// 예시: ChatMessage, DailyCheckCard, GuardianList
// 의존성: 모든 하위 컴포넌트 + API 호출
// 기능: 도메인 특화 로직
```

---

## 🏗️ 컴포넌트 구현 템플릿

### 기본 UI 컴포넌트 템플릿

```typescript
import { ComponentProps } from 'react';
import { UI_CONSTANTS } from '../../constants';

// Props 인터페이스
interface ButtonProps extends Omit<ComponentProps<'button'>, 'className'> {
  variant?: 'primary' | 'secondary';
  size?: 'large' | 'extra-large';
  fullWidth?: boolean;
  children: React.ReactNode;
}

// 컴포넌트 구현
export function Button({
  variant = 'primary',
  size = 'large',
  fullWidth = false,
  children,
  disabled = false,
  ...props
}: ButtonProps) {
  // 스타일 계산 (노인 친화적)
  const baseClasses = [
    'font-semibold',
    'rounded-lg',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-4', // 명확한 포커스 표시
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ];

  const sizeClasses = {
    large: [
      'py-4', 'px-6', 'text-xl',
      `min-h-[${UI_CONSTANTS.TOUCH_TARGET.COMFORT}]`
    ],
    'extra-large': [
      'py-5', 'px-8', 'text-2xl',
      `min-h-[${UI_CONSTANTS.TOUCH_TARGET.PRIMARY}]`
    ]
  };

  const variantClasses = {
    primary: [
      'bg-blue-600', 'text-white',
      'hover:bg-blue-700', 'focus:ring-blue-300'
    ],
    secondary: [
      'bg-gray-100', 'text-gray-700',
      'hover:bg-gray-200', 'focus:ring-gray-300'
    ]
  };

  const allClasses = [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
    fullWidth ? 'w-full' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={allClasses}
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 레이아웃 컴포넌트 템플릿

```typescript
import { ReactNode } from 'react';
import { Button } from '../ui/Button';

interface LayoutProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  children: ReactNode;
}

export function Layout({
  title,
  showBack = false,
  onBack,
  children
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - 노인 친화적 높이와 패딩 */}
      <header className="bg-blue-50 border-b border-blue-100 px-4 py-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {showBack && (
            <Button
              variant="secondary"
              size="large"
              onClick={onBack}
              aria-label="뒤로 가기"
            >
              ← 뒤로
            </Button>
          )}

          {title && (
            <h1 className="text-2xl font-bold text-gray-900 text-center flex-1">
              {title}
            </h1>
          )}
        </div>
      </header>

      {/* Main Content - 충분한 패딩 */}
      <main className="max-w-md mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
```

---

## 🎨 스타일링 가이드라인

### 1. Tailwind CSS 사용 규칙

```typescript
// ✅ 좋은 예: 명확한 의미의 클래스 조합
const classes = [
  'bg-blue-600',           // 명확한 색상
  'text-white',            // 명확한 텍스트 색상
  'py-4 px-6',            // 노인 친화적 패딩
  'text-xl',              // 큰 폰트
  'rounded-lg',           // 부드러운 모서리
  'hover:bg-blue-700',    // 명확한 호버 상태
  'focus:ring-4',         // 선명한 포커스
].join(' ');

// ❌ 나쁜 예: 복잡하고 불명확한 클래스
const classes = 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transform active:scale-95 transition-all duration-150';
```

### 2. 색상 사용 가이드

```typescript
// 노인 친화적 색상 팔레트
const COLORS = {
  // Primary (파란색 계열)
  primary: {
    50: '#eff6ff',   // 매우 밝은 배경
    100: '#dbeafe',  // 밝은 배경
    600: '#2563eb',  // 기본 파란색
    700: '#1d4ed8',  // 어두운 파란색
  },

  // Status Colors (상태 표시)
  success: '#16a34a',  // 성공 (녹색)
  warning: '#ca8a04',  // 경고 (노랑)
  danger: '#dc2626',   // 위험 (빨강)

  // Gray (회색 계열)
  gray: {
    50: '#f9fafb',   // 배경
    100: '#f3f4f6',  // 보조 배경
    700: '#374151',  // 텍스트
    900: '#111827',  // 진한 텍스트
  }
};
```

### 3. 타이포그래피 규칙

```typescript
// 노인 친화적 폰트 크기
const TYPOGRAPHY = {
  // 기본 텍스트
  'text-base': '18px',      // 최소 폰트 크기
  'text-lg': '20px',        // 일반 텍스트
  'text-xl': '24px',        // 버튼 텍스트
  'text-2xl': '30px',       // 제목
  'text-3xl': '36px',       // 메인 제목

  // 줄 간격 (가독성 향상)
  'leading-relaxed': '1.6', // 기본 줄 간격
  'leading-loose': '1.8',   // 여유로운 줄 간격
};
```

---

## 🔧 컴포넌트 개발 워크플로우

### 1. 컴포넌트 생성 순서

```bash
# 1. 파일 생성
src/shared/components/ui/Button.tsx

# 2. 타입 정의
interface ButtonProps { ... }

# 3. 컴포넌트 구현
export function Button({ ... }) { ... }

# 4. index.ts 업데이트
export { Button } from './Button';

# 5. 사용 예제 (App.tsx에서 테스트)
<Button variant="primary">클릭하세요</Button>
```

### 2. 테스트 체크리스트

```typescript
// 개발 완료 후 확인사항
const checklist = [
  // 접근성
  '터치 영역이 48px 이상인가?',
  '폰트 크기가 18px 이상인가?',
  '색상 대비가 4.5:1 이상인가?',
  'Tab 키로 접근 가능한가?',
  'aria-label이 적절한가?',

  // 사용성
  '직관적으로 사용법을 알 수 있는가?',
  '에러 상태가 명확한가?',
  '로딩 상태가 표시되는가?',

  // 기술적
  'TypeScript 타입 에러가 없는가?',
  'Props가 명확하게 정의되었는가?',
  '재사용 가능한 구조인가?',
];
```

### 3. 컴포넌트 문서화

```typescript
/**
 * 노인 친화적 버튼 컴포넌트
 *
 * @example
 * // 기본 사용법
 * <Button variant="primary" size="large">
 *   확인
 * </Button>
 *
 * // 전체 너비 버튼
 * <Button variant="primary" fullWidth>
 *   로그인
 * </Button>
 *
 * @features
 * - 최소 60px 터치 영역
 * - 명확한 포커스 표시
 * - 접근성 지원 (aria-label)
 * - 비활성 상태 지원
 */
export function Button({ ... }) { ... }
```

---

## 📚 컴포넌트 라이브러리 구조

### 현재 우선순위 (Phase 1)

```typescript
// 1순위: 필수 컴포넌트
- Button       // 모든 곳에서 사용
- Layout       // 페이지 구조
- Input        // 사용자 입력

// 2순위: 보조 컴포넌트
- Card         // 콘텐츠 그룹핑
- LoadingSpinner // 로딩 표시
- ErrorBoundary  // 에러 처리

// 3순위: 고급 컴포넌트
- Modal        // 팝업
- Toast        // 알림
- FormField    // 폼 요소 조합
```

### 확장 계획 (Phase 2-3)

```typescript
// 비즈니스 컴포넌트
- ChatMessage     // AI 대화
- DailyCheckCard  // 안부 확인
- GuardianCard    // 보호자 정보
- NavigationBar   // 하단 네비게이션

// 고급 UI 컴포넌트
- DatePicker      // 날짜 선택
- Select          // 선택 목록
- ProgressBar     // 진행률 표시
- Badge           // 상태 표시
```

---

## ✅ 컴포넌트 품질 기준

### 필수 요구사항
- [ ] TypeScript 타입 완전 정의
- [ ] 노인 친화적 크기 (터치 영역 48px+)
- [ ] 접근성 속성 (aria-label, role 등)
- [ ] 에러/로딩 상태 처리
- [ ] 키보드 네비게이션 지원

### 권장 사항
- [ ] 사용 예제 주석
- [ ] Props 기본값 설정
- [ ] 일관된 네이밍 규칙
- [ ] 재사용 가능한 구조
- [ ] 성능 최적화 (memo 등)

---

**🎯 다음 단계: 이 가이드라인을 바탕으로 Button 컴포넌트부터 구현 시작**