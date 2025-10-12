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
**예시**: Button, Input, Card, Badge

### 2. 레이아웃 컴포넌트 (Layout)
**위치**: `src/shared/components/layout/`
**특징**: 페이지 구조를 담당, 기본 UI 조합
**예시**: Header, Footer, Sidebar, Layout

### 3. 폼 컴포넌트 (Forms)
**위치**: `src/shared/components/forms/`
**특징**: 사용자 입력 관련, 유효성 검사 포함
**예시**: LoginForm, ProfileForm, SearchForm

### 4. 비즈니스 컴포넌트 (Business)
**위치**: `src/features/{domain}/components/`
**특징**: 특정 도메인 로직 포함
**예시**: ChatMessage, DailyCheckCard, GuardianList

---

## 🏗️ 컴포넌트 개발 가이드

### Props 인터페이스 정의
- **타입 정의**: 모든 Props는 interface 또는 type으로 명시
- **필수/선택**: 필수 Props와 선택적 Props 명확히 구분
- **기본값**: 선택적 Props는 적절한 기본값 제공

### 노인 친화적 스타일링
- **큰 터치 영역**: 최소 60px
- **명확한 상태**: 호버, 포커스, 활성 상태 시각적 구분
- **높은 대비**: 텍스트와 배경 명도 대비 4.5:1 이상
- **일관된 간격**: 8px 기준 간격 시스템

### 접근성 속성
- **aria-label**: 버튼, 링크 등 인터랙티브 요소
- **role**: 의미적 역할 명시
- **aria-describedby**: 도움말, 에러 메시지 연결
- **키보드 네비게이션**: Tab, Enter, Space 키 지원

---

## 🎨 스타일링 가이드라인

### Tailwind CSS 사용 규칙
- **명확한 클래스**: 의미가 명확한 클래스 조합
- **중복 제거**: 반복되는 스타일은 컴포넌트로 추출
- **노인 친화적 크기**: text-lg (20px) 이상, py-4 (16px) 이상

### 색상 사용 가이드
- **Primary**: 파란색 (#2563eb) - 주요 액션
- **Success**: 초록색 (#22c55e) - 긍정적 피드백
- **Warning**: 주황색 (#f59e0b) - 주의 필요
- **Danger**: 빨간색 (#ef4444) - 긴급/위험

### 타이포그래피 규칙
- **기본 텍스트**: 18px (text-base)
- **버튼 텍스트**: 24px (text-xl)
- **제목**: 30px (text-2xl) 이상
- **행간**: 1.5 (leading-normal) 이상

---

## 🔧 컴포넌트 개발 워크플로우

### 1. 컴포넌트 생성 순서
```
1. 파일 생성 (ComponentName/index.ts, ComponentName.tsx, ComponentName.types.ts)
2. 타입 정의 (interface Props)
3. 컴포넌트 구현
4. index.ts 업데이트
5. 테스트 작성
```

### 2. 개발 체크리스트
- [ ] 터치 영역이 48px 이상인가?
- [ ] 폰트 크기가 18px 이상인가?
- [ ] 색상 대비가 4.5:1 이상인가?
- [ ] Tab 키로 접근 가능한가?
- [ ] aria-label이 적절한가?
- [ ] 직관적으로 사용법을 알 수 있는가?
- [ ] 에러 상태가 명확한가?
- [ ] TypeScript 타입 에러가 없는가?

### 3. 컴포넌트 문서화
- **JSDoc 주석**: 컴포넌트 설명, 사용 예시
- **Props 설명**: 각 Prop의 목적과 타입
- **특징 명시**: 노인 친화적 특징 (터치 영역, 접근성 등)

---

## 📚 컴포넌트 라이브러리 구조

### ✅ Phase 1 완료 (핵심 컴포넌트)
- Button ✅ - Primary/Secondary, 60px/72px 터치영역
- Layout ✅ - Header/Main, 뒤로가기 기능
- Input ✅ - 라벨/에러/도움말, 18px 폰트
- Card ✅ - 클릭가능/불가능, 다양한 스타일
- LoadingSpinner ✅ - 로딩 표시
- ErrorBoundary ✅ - 에러 처리

### 🎯 Phase 2 계획 (보조 컴포넌트)
- Modal - 팝업
- Toast - 알림
- FormField - 폼 요소 조합
- Badge - 상태/알림 배지

### 🚀 Phase 3 확장 계획 (비즈니스 컴포넌트)
- ChatMessage - AI 대화 메시지
- DailyCheckCard - 안부 확인 카드
- GuardianCard - 보호자 정보 카드
- NavigationBar - 하단 네비게이션

---

## 📋 구현된 컴포넌트 상세 정보

### Button 컴포넌트
- **경로**: `src/shared/components/ui/Button/`
- **기능**: Primary/Secondary 변형, Large/Extra-large 크기
- **특징**: 60px/72px 터치영역, 명확한 포커스 링

### Layout 컴포넌트
- **경로**: `src/shared/components/layout/Layout/`
- **기능**: Header/Main 구조, 뒤로가기 버튼 지원
- **특징**: 모바일 최적화(max-width 480px)

### Input 컴포넌트
- **경로**: `src/shared/components/ui/Input/`
- **기능**: 라벨, 에러 메시지, 도움말 텍스트
- **특징**: 60px 높이, 18px 폰트, 라벨-입력 연결

### Card 컴포넌트
- **경로**: `src/shared/components/ui/Card/`
- **기능**: 클릭 가능/불가능 모드
- **특징**: 호버 효과, 포커스 링, 키보드 접근성

### LoadingSpinner 컴포넌트
- **경로**: `src/shared/components/ui/LoadingSpinner/`
- **기능**: 로딩 상태 표시
- **특징**: aria-live, role="status"

### ErrorBoundary 컴포넌트
- **경로**: `src/shared/components/ui/ErrorBoundary/`
- **기능**: 에러 캐치 및 폴백 UI
- **특징**: 노인 친화적 에러 메시지

---

## ✅ Phase 1 컴포넌트 품질 달성 현황

### 달성된 필수 요구사항
- ✅ TypeScript 타입 완전 정의
- ✅ 노인 친화적 크기 (터치 영역 60px+)
- ✅ 접근성 속성 (aria-label, role 등)
- ✅ 에러/로딩 상태 처리
- ✅ 키보드 네비게이션 지원

### 달성된 권장 사항
- ✅ 사용 예제 주석 (JSDoc)
- ✅ Props 기본값 설정
- ✅ 일관된 네이밍 규칙
- ✅ 재사용 가능한 구조
- 🔄 성능 최적화 (Phase 2 예정)

---

**✅ Phase 1 완료: 모든 핵심 컴포넌트가 품질 기준을 충족하며 실제 사용 가능한 상태입니다.**

**🎯 다음 단계: Phase 3 - 비즈니스 컴포넌트 개발 (ChatMessage, DailyCheckCard 등)**

**📅 마지막 업데이트**: 2025-10-12
