# MARUNI Client - 노인 돌봄 PWA

> **마음이 닿는 안부** - 노인 돌봄을 위한 AI 기반 소통 서비스 클라이언트

## 📱 프로젝트 개요

MARUNI는 노인분들의 일상적인 안부 확인과 감정 소통을 지원하는 Progressive Web App입니다.
단순하고 직관적인 UI로 노인분들도 쉽게 사용할 수 있도록 설계되었습니다.

### 🎯 주요 특징

- **노인 친화적 UI**: 큰 버튼(60px+), 큰 폰트(18px+), 높은 색상 대비
- **접근성 우선**: WCAG 2.1 AA 기준 준수, 키보드 네비게이션 지원
- **PWA 기술**: 오프라인 지원, 네이티브 앱과 유사한 사용자 경험
- **반응형 디자인**: 모바일 우선, 다양한 기기에서 최적화

### 💻 기술 스택

- **프레임워크**: React 19.1.1 + TypeScript
- **빌드 도구**: Vite 7.1.7
- **스타일링**: Tailwind CSS v4.1.13
- **상태 관리**: TanStack Query 5.90.2 + Zustand 5.0.8
- **라우팅**: React Router v7.9.3
- **HTTP 클라이언트**: Axios 1.12.2
- **PWA**: vite-plugin-pwa 1.0.3

## 🚀 빠른 시작

### 개발 환경 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 빌드
npm run build

# 빌드 결과 프리뷰
npm run preview

# 린트 검사
npm run lint
```

## 📂 프로젝트 구조

```
src/
├── shared/                    # 공유 리소스
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── ui/               # 기본 UI 컴포넌트
│   │   │   ├── Button/       ✅ Button 컴포넌트
│   │   │   ├── Input/        ✅ Input 컴포넌트
│   │   │   └── Card/         ✅ Card 컴포넌트
│   │   └── layout/           # 레이아웃 컴포넌트
│   │       └── Layout/       ✅ Layout 컴포넌트
│   ├── constants/            # 상수 정의
│   ├── types/               # TypeScript 타입
│   └── utils/               # 유틸리티 함수
├── features/                # 기능별 모듈 (향후 확장)
├── pages/                   # 페이지 컴포넌트 (향후 확장)
├── App.tsx                  # 메인 앱 (현재: 컴포넌트 테스트)
└── main.tsx                 # React 19 엔트리 포인트
```

## 🎨 구현된 컴포넌트

### ✅ Phase 1 완료 (핵심 UI 컴포넌트)

#### Button 컴포넌트

```tsx
<Button variant="primary" size="large">확인</Button>
<Button variant="secondary" size="extra-large" fullWidth>로그인</Button>
```

#### Layout 컴포넌트

```tsx
<Layout title='페이지 제목' showBack onBack={handleBack}>
  <div>페이지 내용</div>
</Layout>
```

#### Input 컴포넌트

```tsx
<Input label="이름" required placeholder="이름을 입력하세요" />
<Input label="이메일" type="email" error="올바른 이메일을 입력하세요" />
```

#### Card 컴포넌트

```tsx
<Card padding="large">
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</Card>
<Card clickable onClick={handleClick}>클릭 가능한 카드</Card>
```

## 📋 현재 개발 현황

### ✅ 완료된 작업 (Progress: 40%)

1. **프로젝트 초기 설정** (100%)

   - React 19 + TypeScript + Vite 환경 구성
   - PWA 기본 설정 (서비스 워커, 매니페스트)
   - ESLint + Prettier 코드 품질 도구

2. **핵심 UI 컴포넌트** (100%)

   - Button, Layout, Input, Card 컴포넌트 완성
   - 노인 친화적 디자인 시스템 적용
   - 접근성 기준 충족 (WCAG 2.1 AA)

3. **개발 환경** (100%)
   - TypeScript strict 모드 적용
   - 빌드/개발 서버 안정화
   - 컴포넌트 테스트 앱 구현

### 🎯 다음 단계 (Phase 2)

1. **서버 연동 준비**

   - API 클라이언트 설정 (Axios 인터셉터)
   - 인증 시스템 구축 (JWT 토큰 관리)
   - TanStack Query + Zustand Provider 설정

2. **실제 페이지 개발**
   - 로그인 페이지
   - 홈 페이지 (대시보드)
   - 안부 확인 페이지

## 🎯 노인 친화적 설계 원칙

### 접근성 (Accessibility)

- **터치 영역**: 최소 60px, 권장 72px
- **폰트 크기**: 최소 18px, 버튼 텍스트 20px+
- **색상 대비**: WCAG 2.1 AA 기준 (4.5:1) 이상
- **키보드 네비게이션**: Tab, Enter, Space 키 지원

### 사용성 (Usability)

- **단순한 구조**: 한 화면에 핵심 기능만
- **직관적 아이콘**: 설명 없이도 이해 가능
- **명확한 피드백**: 포커스 상태, 로딩 표시
- **에러 처리**: 친화적인 에러 메시지

## 📚 문서

상세한 개발 가이드는 `docs/` 디렉토리에서 확인할 수 있습니다:

- [현재 상태 보고서](./docs/project/CURRENT_STATUS.md) - 프로젝트 진행 현황
- [컴포넌트 설계 가이드](./docs/development/COMPONENT_DESIGN_GUIDE.md) - 컴포넌트 개발 가이드라인
- [기술 스택](./docs/TECH_STACK.md) - 기술 선택과 설정
- [디자인 시스템](./docs/architecture/DESIGN_SYSTEM.md) - 노인 친화적 디자인 가이드

## 🧪 테스트

현재 컴포넌트 테스트는 `App.tsx`에서 확인할 수 있습니다:

```bash
npm run dev
# http://localhost:3000에서 모든 컴포넌트 테스트 가능
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**📅 마지막 업데이트**: 2025-09-30
**📈 현재 진행률**: Phase 1 완료 (40%)
**🎯 다음 단계**: Phase 2 - 서버 연동 준비
