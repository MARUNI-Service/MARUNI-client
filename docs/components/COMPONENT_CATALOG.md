# MARUNI 컴포넌트 카탈로그

> **Phase 1 완료**: 노인 친화적 핵심 UI 컴포넌트 6개 완성

## 📚 완성된 컴포넌트 목록

---

### 🔘 Button

**경로**: `src/shared/components/ui/Button/`

**Props**:
- `variant`: 'primary' | 'secondary' (기본값: 'primary')
- `size`: 'large' | 'extra-large' (기본값: 'large')
- `fullWidth`: boolean (기본값: false)
- `disabled`: boolean (기본값: false)

**사용 예제**:
```typescript
// Primary 버튼
<Button variant="primary" size="large">
  확인
</Button>

// 전체 너비 버튼
<Button variant="primary" size="extra-large" fullWidth>
  로그인
</Button>

// 비활성 버튼
<Button variant="secondary" disabled>
  비활성
</Button>
```

**노인 친화적 특징**:
- ✅ 터치 영역: Large 60px, Extra-large 72px
- ✅ 명확한 포커스 링 (4px)
- ✅ 접근성: aria-label 자동 설정
- ✅ 큰 폰트 크기 (20px/24px)

---

### 🏗️ Layout

**경로**: `src/shared/components/layout/Layout/`

**Props**:
- `title`: string (선택)
- `showBack`: boolean (기본값: false)
- `onBack`: () => void (선택)
- `children`: ReactNode

**사용 예제**:
```typescript
// 기본 레이아웃
<Layout title="페이지 제목">
  <div>콘텐츠</div>
</Layout>

// 뒤로가기 버튼이 있는 레이아웃
<Layout title="상세 페이지" showBack onBack={() => navigate(-1)}>
  <div>콘텐츠</div>
</Layout>
```

**특징**:
- ✅ 모바일 최적화 (max-width: 480px)
- ✅ Header/Main 명확한 구조
- ✅ 중앙 정렬 제목
- ✅ 노인 친화적 여백

---

### 📝 Input

**경로**: `src/shared/components/ui/Input/`

**Props**:
- `label`: string (선택)
- `error`: string (선택)
- `helperText`: string (선택)
- `required`: boolean (기본값: false)
- `disabled`: boolean (기본값: false)
- `type`: string (기본값: 'text')

**사용 예제**:
```typescript
// 기본 입력 필드
<Input
  label="이름"
  placeholder="이름을 입력하세요"
  required
/>

// 에러 상태
<Input
  label="전화번호"
  type="tel"
  error="올바른 전화번호를 입력하세요"
/>

// 도움말 텍스트
<Input
  label="이메일"
  type="email"
  helperText="예: example@email.com"
/>
```

**노인 친화적 특징**:
- ✅ 높이: 60px
- ✅ 폰트 크기: 18px
- ✅ 명확한 라벨-입력 연결
- ✅ 에러 메시지 aria-describedby 연결

---

### 🃏 Card

**경로**: `src/shared/components/ui/Card/`

**Props**:
- `clickable`: boolean (기본값: false)
- `padding`: 'small' | 'medium' | 'large' (기본값: 'medium')
- `shadow`: 'none' | 'small' | 'medium' | 'large' (기본값: 'small')
- `rounded`: 'small' | 'medium' | 'large' (기본값: 'medium')
- `onClick`: () => void (clickable일 때)

**사용 예제**:
```typescript
// 기본 카드
<Card padding="large">
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</Card>

// 클릭 가능한 카드
<Card
  clickable
  padding="medium"
  shadow="medium"
  onClick={() => navigate('/detail')}
>
  <h3>클릭하세요</h3>
</Card>
```

**특징**:
- ✅ 클릭 가능/불가능 모드 자동 전환
- ✅ 호버 효과 및 포커스 링
- ✅ 다양한 스타일 옵션
- ✅ 키보드 접근성 (Tab, Enter, Space)

---

### ⏳ LoadingSpinner

**경로**: `src/shared/components/ui/LoadingSpinner/`

**Props**:
- `size`: 'small' | 'medium' | 'large' (기본값: 'medium')
- `label`: string (기본값: '로딩 중...')
- `className`: string (선택)

**사용 예제**:
```typescript
// 기본 스피너
<LoadingSpinner />

// 큰 스피너
<LoadingSpinner
  size="large"
  label="데이터를 불러오는 중..."
/>

// 레이블 없는 스피너
<LoadingSpinner size="small" label="" />
```

**접근성 특징**:
- ✅ role="status"
- ✅ aria-live="polite"
- ✅ aria-busy="true"
- ✅ 명확한 로딩 메시지

---

### 🚨 ErrorBoundary

**경로**: `src/shared/components/ui/ErrorBoundary/`

**Props**:
- `children`: ReactNode
- `fallback`: ReactNode (선택)
- `onError`: (error, errorInfo) => void (선택)

**사용 예제**:
```typescript
// 기본 사용법 (main.tsx)
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Error caught:', error, errorInfo);
  }}
>
  <App />
</ErrorBoundary>

// 커스텀 fallback UI
<ErrorBoundary
  fallback={
    <div>
      <h1>앗, 문제가 발생했어요</h1>
      <button onClick={() => window.location.reload()}>
        새로고침
      </button>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

**특징**:
- ✅ React Error Boundary 패턴
- ✅ 노인 친화적 에러 UI
- ✅ "다시 시도" 버튼으로 복구
- ✅ "홈으로 가기" 버튼
- ✅ 개발 환경에서 에러 상세 표시

---

## 🎨 통합 Import

모든 컴포넌트는 한 곳에서 import할 수 있습니다:

```typescript
import {
  Button,
  Input,
  Card,
  Layout,
  LoadingSpinner,
  ErrorBoundary,
} from './shared/components';

// 타입도 함께 import 가능
import type {
  ButtonProps,
  InputProps,
  CardProps,
  LayoutProps,
  LoadingSpinnerProps,
  ErrorBoundaryProps,
} from './shared/components';
```

---

## ✅ Phase 1 품질 달성 현황

### 필수 요구사항
- ✅ TypeScript 타입 완전 정의 (모든 Props 인터페이스)
- ✅ 노인 친화적 크기 (터치 영역 60px+ 확보)
- ✅ 접근성 속성 (aria-label, role, aria-describedby 등)
- ✅ 에러/로딩 상태 처리 (Input 에러, Button disabled)
- ✅ 키보드 네비게이션 지원 (Tab, Enter, Space 키)

### 권장 사항
- ✅ 사용 예제 주석 (모든 컴포넌트에 JSDoc 포함)
- ✅ Props 기본값 설정 (적절한 default values)
- ✅ 일관된 네이밍 규칙 (ButtonProps, LayoutProps 등)
- ✅ 재사용 가능한 구조 (variant, size, padding 시스템)
- 🔄 성능 최적화 (memo 등) - Phase 2에서 적용 예정

---

## 📊 컴포넌트 메트릭스

| 컴포넌트 | 파일 수 | 최소 터치 영역 | 접근성 | 테스트 |
|---------|--------|--------------|--------|-------|
| Button | 3 | 60px | ✅ | ✅ |
| Layout | 3 | 60px (뒤로가기) | ✅ | ✅ |
| Input | 3 | 60px | ✅ | ✅ |
| Card | 3 | 48px+ | ✅ | ✅ |
| LoadingSpinner | 3 | N/A | ✅ | ✅ |
| ErrorBoundary | 3 | 60px (버튼) | ✅ | ✅ |

---

## 🚀 다음 단계

Phase 1 완료 후 다음 단계:

### Phase 2: 보조 컴포넌트 (선택)
- Modal (모달 대화상자)
- Toast (알림 메시지)
- Badge (상태 표시 배지)
- Select (드롭다운 선택)

### Phase 3: 비즈니스 컴포넌트
- ChatMessage (AI 대화 메시지)
- DailyCheckCard (안부 확인 카드)
- GuardianCard (보호자 정보 카드)
- NavigationBar (하단 네비게이션)

---

**✅ Phase 1 완료: 모든 핵심 컴포넌트가 품질 기준을 충족하며 실제 사용 가능한 상태입니다.**

**📅 마지막 업데이트**: 2025-09-30
**🎯 완성도**: Phase 1 완료 (100%)