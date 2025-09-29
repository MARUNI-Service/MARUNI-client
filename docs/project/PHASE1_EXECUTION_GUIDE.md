# Phase 1 실행 가이드: 핵심 컴포넌트 구축

> **MARUNI 클라이언트 Phase 1 상세 실행 계획서**
> **목표**: 노인 친화적 기본 UI 컴포넌트 완성 (1주 완료)
> **진행률**: 0% → 30%

## 🎯 Phase 1 개요

### 핵심 목표
- **재사용 가능한 기본 UI 컴포넌트** 4개 완성
- **노인 친화적 설계 원칙** 적용 및 검증
- **타입 안전성과 접근성** 보장
- **디자인 시스템 기반** 확립

### 완료 시 달성 결과
- Button, Layout, Input, Card 컴포넌트 완성
- 모든 컴포넌트가 노인 친화적 기준 충족
- TypeScript 타입 에러 0개
- 모바일/데스크톱 반응형 동작 확인

---

## ✅ 시작 전 준비사항 체크리스트

### 개발 환경 확인
- [ ] Node.js 설치 확인 (`node --version`)
- [ ] 프로젝트 의존성 설치 완료 (`npm install`)
- [ ] 개발 서버 정상 동작 (`npm run dev`)
- [ ] TypeScript 컴파일 정상 (`npm run type-check`)
- [ ] ESLint 검사 통과 (`npm run lint`)

### 필수 문서 숙지
- [ ] [컴포넌트 설계 가이드](../development/COMPONENT_DESIGN_GUIDE.md) 읽기
- [ ] [디자인 시스템](../architecture/DESIGN_SYSTEM.md) 확인
- [ ] [코딩 컨벤션](../development/CODING_CONVENTIONS.md) 숙지

### 개발 도구 준비
- [ ] VSCode 및 필수 확장 설치
- [ ] 브라우저 개발자 도구 준비
- [ ] 접근성 테스트 도구 설치 (axe DevTools 등)

---

## 📅 7일간 상세 실행 계획

### Day 1-2: 기본 UI 컴포넌트 (Button, Layout)

#### Day 1: Button 컴포넌트 구현

**⏰ 예상 소요 시간**: 4-6시간

**🎯 목표**: 노인 친화적 Button 컴포넌트 완성

**📋 상세 작업**:
1. **파일 생성** (30분)
   ```
   src/shared/components/ui/Button/
   ├── index.ts
   ├── Button.tsx
   └── Button.types.ts
   ```

2. **타입 정의** (1시간)
   - ButtonProps 인터페이스 정의
   - variant, size, fullWidth 등 속성
   - 접근성 속성 포함

3. **컴포넌트 구현** (2-3시간)
   - 기본 Button 컴포넌트 구조
   - Tailwind CSS 클래스 적용
   - 노인 친화적 크기 및 색상

4. **테스트 및 검증** (1시간)
   - App.tsx에서 다양한 variant 테스트
   - 터치 영역 48px+ 확인
   - 포커스 상태 확인

5. **접근성 검증** (30분)
   - 키보드 네비게이션 테스트
   - 스크린 리더 호환성 확인
   - 색상 대비 검증

**✅ Day 1 완료 기준**:
- [ ] Button 컴포넌트 정상 렌더링
- [ ] 모든 variant (primary, secondary) 동작
- [ ] 터치 영역 60px 이상
- [ ] TypeScript 컴파일 에러 없음

#### Day 2: Layout 컴포넌트 구현

**⏰ 예상 소요 시간**: 4-6시간

**🎯 목표**: 페이지 레이아웃 구조 컴포넌트 완성

**📋 상세 작업**:
1. **파일 생성** (30분)
   ```
   src/shared/components/layout/Layout/
   ├── index.ts
   ├── Layout.tsx
   └── Layout.types.ts
   ```

2. **레이아웃 구조 설계** (1시간)
   - Header, Main, Footer 영역 정의
   - 노인 친화적 네비게이션 구조
   - 반응형 레이아웃 고려

3. **컴포넌트 구현** (2-3시간)
   - Header (제목, 뒤로가기 버튼)
   - Main (콘텐츠 영역, 적절한 패딩)
   - Navigation (큰 버튼, 명확한 아이콘)

4. **테스트 및 검증** (1시간)
   - 다양한 화면 크기에서 테스트
   - 네비게이션 동작 확인
   - Button 컴포넌트와 연동 테스트

**✅ Day 2 완료 기준**:
- [ ] Layout 컴포넌트 정상 렌더링
- [ ] Header/Main 영역 적절한 간격
- [ ] 모바일/데스크톱 반응형 동작
- [ ] Button과 Layout 연동 확인

### Day 3-4: 입력 및 콘텐츠 컴포넌트 (Input, Card)

#### Day 3: Input 컴포넌트 구현

**⏰ 예상 소요 시간**: 5-7시간

**🎯 목표**: 노인 친화적 Input 컴포넌트 완성

**📋 상세 작업**:
1. **파일 생성** (30분)
   ```
   src/shared/components/ui/Input/
   ├── index.ts
   ├── Input.tsx
   └── Input.types.ts
   ```

2. **타입 정의** (1시간)
   - InputProps 인터페이스
   - label, placeholder, error 등
   - 다양한 input type 지원

3. **컴포넌트 구현** (3-4시간)
   - 큰 폰트 크기 (18px+)
   - 명확한 라벨과 플레이스홀더
   - 에러 상태 표시
   - 포커스 상태 강조

4. **검증 로직 구현** (1시간)
   - 기본적인 유효성 검사
   - 에러 메시지 표시
   - 실시간 피드백

**✅ Day 3 완료 기준**:
- [ ] Input 컴포넌트 정상 동작
- [ ] 라벨, 에러 상태 표시
- [ ] 포커스 상태 명확함
- [ ] 키보드 접근성 지원

#### Day 4: Card 컴포넌트 구현

**⏰ 예상 소요 시간**: 3-5시간

**🎯 목표**: 콘텐츠 그룹핑 Card 컴포넌트 완성

**📋 상세 작업**:
1. **파일 생성** (30분)
   ```
   src/shared/components/ui/Card/
   ├── index.ts
   ├── Card.tsx
   └── Card.types.ts
   ```

2. **컴포넌트 구현** (2-3시간)
   - 그림자와 둥근 모서리
   - 적절한 패딩과 여백
   - 클릭 가능한 카드 변형
   - 호버/포커스 상태

3. **테스트 및 통합** (1-2시간)
   - 다른 컴포넌트와 조합 테스트
   - Button, Input과 Card 내부 배치
   - 전체적인 디자인 일관성 확인

**✅ Day 4 완료 기준**:
- [ ] Card 컴포넌트 정상 렌더링
- [ ] 다른 컴포넌트와 조합 확인
- [ ] 클릭 상태 동작 (해당하는 경우)
- [ ] 디자인 일관성 유지

### Day 5-6: 보조 컴포넌트 및 통합

#### Day 5: LoadingSpinner & ErrorBoundary

**⏰ 예상 소요 시간**: 4-5시간

**🎯 목표**: 사용자 피드백 컴포넌트 완성

**📋 상세 작업**:
1. **LoadingSpinner 구현** (2시간)
   - 명확한 로딩 표시
   - 접근성 고려 (aria-label)
   - 다양한 크기 지원

2. **ErrorBoundary 구현** (2-3시간)
   - 에러 캐치 및 표시
   - 새로고침 버튼
   - 사용자 친화적 메시지

**✅ Day 5 완료 기준**:
- [ ] 로딩 상태 명확히 표시
- [ ] 에러 발생 시 적절한 처리
- [ ] 접근성 속성 적용

#### Day 6: 컴포넌트 통합 및 문서화

**⏰ 예상 소요 시간**: 4-6시간

**🎯 목표**: 모든 컴포넌트 통합 및 사용 예제 완성

**📋 상세 작업**:
1. **index.ts 업데이트** (30분)
   - 모든 컴포넌트 export
   - 타입 export 포함

2. **App.tsx 데모 페이지** (2-3시간)
   - 모든 컴포넌트 사용 예제
   - 다양한 상태 및 조합 시연
   - 노인 친화적 레이아웃 구성

3. **컴포넌트 문서 업데이트** (1-2시간)
   - 각 컴포넌트 사용 예제
   - Props 문서화
   - 접근성 가이드라인

**✅ Day 6 완료 기준**:
- [ ] 모든 컴포넌트 통합 완료
- [ ] App.tsx 데모 페이지 동작
- [ ] 컴포넌트 문서화 완료

### Day 7: 최종 검증 및 품질 확인

**⏰ 예상 소요 시간**: 4-5시간

**🎯 목표**: 품질 기준 충족 및 Phase 1 완성

**📋 상세 작업**:
1. **접근성 최종 검증** (1-2시간)
   - axe DevTools 검사
   - 키보드 네비게이션 테스트
   - 스크린 리더 테스트

2. **성능 테스트** (1시간)
   - 렌더링 성능 확인
   - 번들 크기 검토
   - 메모리 사용량 체크

3. **코드 품질 확인** (1시간)
   - ESLint 검사 통과
   - TypeScript strict 모드 적용
   - 코드 리뷰 체크리스트

4. **크로스 브라우저 테스트** (1시간)
   - Chrome, Firefox, Safari 테스트
   - 모바일 브라우저 확인

**✅ Day 7 완료 기준**:
- [ ] 접근성 기준 AAA 충족
- [ ] 성능 지표 만족
- [ ] 모든 브라우저에서 동작
- [ ] Phase 1 완료 기준 충족

---

## 🏗️ 컴포넌트별 상세 구현 가이드

### 1. Button 컴포넌트 구현

#### 파일 구조
```
src/shared/components/ui/Button/
├── index.ts           # Export
├── Button.tsx         # 메인 컴포넌트
└── Button.types.ts    # 타입 정의
```

#### 코드 템플릿

**Button.types.ts**:
```typescript
import { ComponentProps } from 'react';

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'className'> {
  variant?: 'primary' | 'secondary';
  size?: 'large' | 'extra-large';
  fullWidth?: boolean;
  children: React.ReactNode;
}
```

**Button.tsx**:
```typescript
import { ButtonProps } from './Button.types';

export function Button({
  variant = 'primary',
  size = 'large',
  fullWidth = false,
  children,
  disabled = false,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'font-semibold',
    'rounded-lg',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-4',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ];

  const sizeClasses = {
    large: ['py-4', 'px-6', 'text-xl', 'min-h-[60px]'],
    'extra-large': ['py-5', 'px-8', 'text-2xl', 'min-h-[72px]']
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

### 2. Layout 컴포넌트 구현

#### 파일 구조
```
src/shared/components/layout/Layout/
├── index.ts
├── Layout.tsx
└── Layout.types.ts
```

#### 코드 템플릿

**Layout.types.ts**:
```typescript
import { ReactNode } from 'react';

export interface LayoutProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  children: ReactNode;
  className?: string;
}
```

**Layout.tsx**:
```typescript
import { LayoutProps } from './Layout.types';
import { Button } from '../../ui/Button';

export function Layout({
  title,
  showBack = false,
  onBack,
  children,
  className = ''
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
```

### 3. Input 컴포넌트 구현

#### 코드 템플릿

**Input.types.ts**:
```typescript
import { ComponentProps } from 'react';

export interface InputProps extends Omit<ComponentProps<'input'>, 'className'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}
```

**Input.tsx**:
```typescript
import { InputProps } from './Input.types';

export function Input({
  label,
  error,
  fullWidth = true,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = [
    'text-lg',
    'py-4',
    'px-6',
    'border-2',
    'rounded-lg',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-4',
    'min-h-[60px]',
    error ? 'border-red-500 focus:border-red-500 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-300',
    fullWidth ? 'w-full' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-lg font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-red-600 text-base font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
```

### 4. Card 컴포넌트 구현

#### 코드 템플릿

**Card.types.ts**:
```typescript
import { ReactNode, ComponentProps } from 'react';

export interface CardProps extends Omit<ComponentProps<'div'>, 'className'> {
  children: ReactNode;
  clickable?: boolean;
  padding?: 'small' | 'medium' | 'large';
}
```

**Card.tsx**:
```typescript
import { CardProps } from './Card.types';

export function Card({
  children,
  clickable = false,
  padding = 'medium',
  ...props
}: CardProps) {
  const baseClasses = [
    'bg-white',
    'border',
    'border-gray-200',
    'rounded-xl',
    'shadow-sm',
    'transition-shadow',
  ];

  const paddingClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const interactiveClasses = clickable ? [
    'cursor-pointer',
    'hover:shadow-md',
    'focus:outline-none',
    'focus:ring-4',
    'focus:ring-blue-300'
  ] : [];

  const allClasses = [
    ...baseClasses,
    paddingClasses[padding],
    ...interactiveClasses
  ].join(' ');

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={allClasses}
      {...(clickable && { role: 'button', tabIndex: 0 })}
      {...props}
    >
      {children}
    </Component>
  );
}
```

---

## 🧪 테스트 및 검증 방법

### 1. 개발 중 테스트

#### App.tsx 테스트 페이지
```typescript
import { Button } from '@/shared/components/ui/Button';
import { Layout } from '@/shared/components/layout/Layout';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';

function App() {
  return (
    <Layout title="MARUNI 컴포넌트 테스트">
      <div className="space-y-6">
        {/* Button 테스트 */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Button 컴포넌트</h2>
          <div className="space-y-4">
            <Button variant="primary" size="large">
              기본 버튼
            </Button>
            <Button variant="secondary" size="large">
              보조 버튼
            </Button>
            <Button variant="primary" size="extra-large" fullWidth>
              전체 너비 버튼
            </Button>
          </div>
        </Card>

        {/* Input 테스트 */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Input 컴포넌트</h2>
          <div className="space-y-4">
            <Input label="이름" placeholder="이름을 입력하세요" />
            <Input label="전화번호" type="tel" placeholder="010-0000-0000" />
            <Input label="에러 예시" error="필수 입력 항목입니다" />
          </div>
        </Card>

        {/* Card 테스트 */}
        <Card clickable padding="large">
          <h3 className="text-lg font-semibold">클릭 가능한 카드</h3>
          <p className="text-gray-600 mt-2">이 카드는 클릭할 수 있습니다</p>
        </Card>
      </div>
    </Layout>
  );
}

export default App;
```

### 2. 접근성 테스트 체크리스트

#### 키보드 네비게이션
- [ ] Tab 키로 모든 상호작용 요소 접근 가능
- [ ] Enter/Space 키로 버튼 활성화 가능
- [ ] 포커스 상태가 시각적으로 명확함
- [ ] 포커스 순서가 논리적임

#### 스크린 리더 호환성
- [ ] 모든 버튼에 적절한 aria-label
- [ ] 폼 요소에 label 연결됨
- [ ] 에러 메시지가 role="alert"로 표시
- [ ] 의미있는 heading 구조

#### 색상 및 대비
- [ ] 색상 대비 4.5:1 이상 (WCAG AA)
- [ ] 색상에 의존하지 않는 정보 전달
- [ ] 포커스 표시가 명확함

### 3. 성능 테스트

#### 렌더링 성능
```bash
# 번들 크기 확인
npm run build
npm run preview

# Lighthouse 성능 측정
# Chrome DevTools > Lighthouse 탭에서 측정
```

#### 메모리 사용량
```bash
# Chrome DevTools > Memory 탭에서 측정
# Heap Snapshot으로 메모리 누수 확인
```

### 4. 크로스 브라우저 테스트

#### 테스트 브라우저 목록
- [ ] Chrome (최신 버전)
- [ ] Firefox (최신 버전)
- [ ] Safari (최신 버전)
- [ ] Edge (최신 버전)
- [ ] 모바일 Chrome (Android)
- [ ] 모바일 Safari (iOS)

#### 테스트 항목
- [ ] 모든 컴포넌트 정상 렌더링
- [ ] 터치/클릭 이벤트 정상 동작
- [ ] CSS 스타일 일관성
- [ ] JavaScript 기능 정상 동작

---

## 🚨 문제 해결 가이드

### 1. 개발 환경 문제

#### TypeScript 컴파일 에러
```bash
# 일반적인 해결 방법
npm run type-check

# 타입 캐시 초기화
rm -rf node_modules/.cache
npm install
```

#### ESLint 에러
```bash
# 자동 수정 시도
npm run lint:fix

# 수동 수정이 필요한 경우
npm run lint
```

#### 스타일 적용 안됨
```bash
# Tailwind CSS 빌드 확인
npm run dev

# 브라우저 캐시 초기화
Ctrl+Shift+R (Chrome)
```

### 2. 컴포넌트 구현 문제

#### 버튼 터치 영역 부족
```typescript
// 해결방법: min-h 클래스 추가
const sizeClasses = {
  large: ['py-4', 'px-6', 'text-xl', 'min-h-[60px]'], // 최소 60px
  'extra-large': ['py-5', 'px-8', 'text-2xl', 'min-h-[72px]'] // 최소 72px
};
```

#### 포커스 상태 표시 안됨
```typescript
// 해결방법: focus:ring 클래스 확인
const baseClasses = [
  'focus:outline-none',
  'focus:ring-4', // 포커스 링 두께
  'focus:ring-blue-300' // 포커스 링 색상
];
```

#### 접근성 속성 누락
```typescript
// 해결방법: 필수 aria 속성 추가
<button
  aria-label={typeof children === 'string' ? children : undefined}
  aria-disabled={disabled}
  {...props}
>
  {children}
</button>
```

### 3. 성능 문제

#### 렌더링 지연
```typescript
// 해결방법: React.memo 적용
import { memo } from 'react';

export const Button = memo<ButtonProps>(({ ... }) => {
  // 컴포넌트 구현
});
```

#### 번들 크기 증가
```typescript
// 해결방법: 불필요한 import 제거
// ❌ 잘못된 예
import * as React from 'react';

// ✅ 올바른 예
import { ComponentProps } from 'react';
```

### 4. 브라우저 호환성 문제

#### CSS Grid/Flexbox 문제
```css
/* 해결방법: Tailwind의 호환성 클래스 사용 */
.grid { display: grid; } /* 모던 브라우저 */
.flex { display: flex; } /* IE11+ */
```

#### 터치 이벤트 문제
```typescript
// 해결방법: 터치와 마우스 이벤트 모두 지원
const handleInteraction = useCallback(() => {
  // 공통 처리 로직
}, []);

return (
  <button
    onClick={handleInteraction}
    onTouchEnd={handleInteraction}
  >
    {children}
  </button>
);
```

---

## ✅ Phase 1 완료 기준 및 검증

### 필수 완료 기준

#### 컴포넌트 기능
- [ ] Button, Layout, Input, Card 컴포넌트 구현 완료
- [ ] 모든 컴포넌트가 예상대로 렌더링됨
- [ ] Props를 통한 커스터마이징 가능
- [ ] TypeScript 타입 에러 0개

#### 노인 친화적 설계
- [ ] 터치 영역 최소 48px, 권장 60px 이상
- [ ] 폰트 크기 최소 18px, 버튼 텍스트 20px 이상
- [ ] 색상 대비 WCAG AA 기준 (4.5:1) 충족
- [ ] 포커스 상태가 시각적으로 명확함

#### 접근성
- [ ] 키보드 네비게이션 완전 지원
- [ ] 스크린 리더 호환성 확인
- [ ] 적절한 aria 속성 적용
- [ ] 에러 상태 명확히 표시

#### 기술적 품질
- [ ] ESLint 규칙 통과
- [ ] Prettier 포맷팅 적용
- [ ] 모바일/데스크톱 반응형 동작
- [ ] 크로스 브라우저 호환성

### 선택 완료 기준

#### 문서화
- [ ] 각 컴포넌트 사용 예제 작성
- [ ] Props 및 타입 문서화
- [ ] 접근성 가이드라인 문서화

#### 성능
- [ ] 렌더링 성능 최적화
- [ ] 번들 크기 최적화
- [ ] 메모리 사용량 체크

### 최종 검증 체크리스트

#### 1단계: 기능 테스트
```bash
# 개발 서버 실행
npm run dev

# 모든 컴포넌트 동작 확인
# 브라우저에서 localhost:3000 접속
```

#### 2단계: 코드 품질 검사
```bash
# TypeScript 타입 체크
npm run type-check

# ESLint 검사
npm run lint

# 빌드 테스트
npm run build
```

#### 3단계: 접근성 검사
- Chrome DevTools > Lighthouse 접근성 점수 90+
- axe DevTools로 접근성 이슈 0개
- 키보드만으로 모든 기능 사용 가능

#### 4단계: 성능 검사
- Lighthouse 성능 점수 90+
- 번들 크기 적정 수준 유지
- 메모리 누수 없음

---

## 🎯 Phase 1 완료 후 다음 단계

### Phase 2 준비사항
Phase 1 완료 후 다음 단계인 **Phase 2: 인증 및 라우팅** 준비를 위해:

1. **React Router 설정 준비**
   - 라우팅 구조 설계 확인
   - 페이지 컴포넌트 구조 계획

2. **상태 관리 준비**
   - Zustand store 설계
   - API 클라이언트 설계 확인

3. **서버 연동 준비**
   - API 엔드포인트 확인
   - 인증 플로우 재검토

### 지속적인 개선
Phase 1 완료 후에도 컴포넌트의 지속적인 개선이 필요합니다:

- 사용자 피드백 반영
- 성능 최적화
- 접근성 개선
- 새로운 요구사항 추가

---

**🚀 Phase 1 성공적 완료를 위해 이 가이드를 단계별로 따라 진행하세요!**

**📞 문제 발생 시**: 문제 해결 가이드를 참조하거나, 각 Day별 완료 기준을 다시 확인해보세요.

**📝 진행 상황 추적**: 각 체크리스트 항목을 완료할 때마다 체크 표시하여 진행 상황을 관리하세요.