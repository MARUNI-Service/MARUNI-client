# MARUNI 클라이언트 문서 가이드

> 노인 돌봄 AI 서비스 **MARUNI** 클라이언트 프로젝트의 문서 센터입니다.

## 🚀 빠른 시작

### 📋 현재 상태 확인

- **[CURRENT_STATUS.md](./project/CURRENT_STATUS.md)** ⭐ **필독**
  - 현재 프로젝트 상태 (초기 설정 완료)
  - 완료된 작업 현황
  - 다음 단계 가이드

### 🎯 개발 계획

- **[DEVELOPMENT_PLAN.md](./project/DEVELOPMENT_PLAN.md)** ⭐ **필독**
  - 4단계 개발 로드맵 (4-6주 계획)
  - Phase별 상세 작업 내용
  - 성공 지표 및 마일스톤

### 🔌 API 연동 가이드

- **[API_REFERENCE.md](./api/API_REFERENCE.md)** ⭐ **API 작업 시 필수**

  - 서버 API 레퍼런스 및 클라이언트 구현 예제
  - 6개 도메인 API 문서 (Auth, Member, Conversation, Guardian, AlertRule, Notification)

- **[IMPLEMENTATION_FLOWS.md](./flows/IMPLEMENTATION_FLOWS.md)** ⭐ **API 작업 시 필수**
  - 주요 기능별 구현 플로우 가이드
  - 코드 템플릿 및 TanStack Query 패턴

### 🛠️ 개발 가이드

- **[COMPONENT_DESIGN_GUIDE.md](./development/COMPONENT_DESIGN_GUIDE.md)** ⭐ **개발 시 필수**
  - 노인 친화적 컴포넌트 설계 원칙
  - 컴포넌트 구현 템플릿
  - 접근성 체크리스트

---

## 📚 전체 문서 구조

### 📋 기술 스택

- **[TECH_STACK.md](./TECH_STACK.md)**
  - React 19 + TypeScript + PWA 기술 스택
  - Tailwind CSS v4, TanStack Query, Zustand
  - 개발 도구 및 환경 설정

### 📐 Architecture (아키텍처)

시스템 설계와 UI/UX 설계 관련 문서들

- **[DESIGN_SYSTEM.md](./architecture/DESIGN_SYSTEM.md)**

  - 노인 친화적 디자인 시스템
  - 색상, 타이포그래피, 컴포넌트 스타일 가이드
  - 접근성 가이드라인 (WCAG 2.1 AA 준수)

- **[TECHNICAL_ARCHITECTURE.md](./architecture/TECHNICAL_ARCHITECTURE.md)**

  - 고수준 시스템 아키텍처 설계
  - API 통신 및 상태 관리 아키텍처
  - 라우팅 및 PWA 전략
  - 보안 및 인증 아키텍처

- **[USER_FLOW_DESIGN.md](./architecture/USER_FLOW_DESIGN.md)**
  - 노인 사용자 페르소나
  - 온보딩 플로우 (7단계)
  - 일상적 사용 플로우
  - 긴급상황 처리 플로우

### 🔌 API & Flows (API 및 구현 플로우)

서버 API 연동 및 구현 가이드 문서들

- **[API_REFERENCE.md](./api/API_REFERENCE.md)** ⭐ **API 작업 시 필수**

  - 서버 API 레퍼런스 (Auth, Member, Conversation, Guardian, AlertRule)
  - TypeScript 코드 예제 및 클라이언트 구현 패턴
  - 에러 처리 및 공통 응답 형식

- **[IMPLEMENTATION_FLOWS.md](./flows/IMPLEMENTATION_FLOWS.md)** ⭐ **API 작업 시 필수**
  - 주요 기능별 단계별 구현 가이드
  - 인증 플로우, AI 대화, 보호자 관리, 알림 이력
  - TanStack Query + Zustand 패턴

### 🎨 Components (컴포넌트)

완성된 컴포넌트 라이브러리 문서

- **[COMPONENT_CATALOG.md](./components/COMPONENT_CATALOG.md)** ⭐ **Phase 1 완료**
  - 완성된 컴포넌트 6개 카탈로그
  - 각 컴포넌트 Props 및 사용 예제
  - 노인 친화적 특징 및 접근성
  - 통합 Import 가이드

### 🛠️ Development (개발)

개발 가이드라인과 코딩 규칙 관련 문서들

- **[COMPONENT_DESIGN_GUIDE.md](./development/COMPONENT_DESIGN_GUIDE.md)** ⭐

  - 노인 친화적 컴포넌트 설계 가이드라인
  - 컴포넌트 구현 템플릿 및 예제
  - 접근성 체크리스트 및 품질 기준

- **[CODING_CONVENTIONS.md](./development/CODING_CONVENTIONS.md)**

  - 파일 및 폴더 네이밍 규칙
  - TypeScript 컨벤션
  - React 컨벤션 (컴포넌트 구조, Props 네이밍)
  - CSS/Tailwind 컨벤션

- **[PACKAGE_STRUCTURE.md](./development/PACKAGE_STRUCTURE.md)**
  - 4계층 패키지 구조 설계
  - Feature 모듈 설계 (서버 도메인 기반)
  - 의존성 관리 규칙

### 📊 Project (프로젝트)

프로젝트 진행 상황과 로드맵 관련 문서들

- **[CURRENT_STATUS.md](./project/CURRENT_STATUS.md)** ⭐ **업데이트 (Phase 3 계획 완성)**

  - 실시간 프로젝트 상태 보고서
  - 완료된 작업 및 다음 단계 (Phase 2 완료, Phase 3 계획 완성)
  - 기술적 완성도 및 개발 준비 상태

- **[DEVELOPMENT_PLAN.md](./project/DEVELOPMENT_PLAN.md)** ⭐

  - 단계별 개발 계획 (Phase 1-4)
  - 상세 작업 일정 및 체크리스트
  - 위험 관리 및 성공 지표

- **[PHASE3_EXECUTION_GUIDE.md](./project/PHASE3_EXECUTION_GUIDE.md)** ⭐ **NEW (2025-10-05)**

  - Phase 3 상세 실행 계획 (14일)
  - AI 대화, 보호자 관리, 알림 이력, 회원 정보 구현 가이드
  - 일별 작업 내용 및 코드 템플릿

- **[PROJECT_PROGRESS.md](./project/PROJECT_PROGRESS.md)**
  - 전체적인 프로젝트 진행 상황
  - 핵심 성과 및 인사이트
  - 기술적 결정사항 기록

## 📋 문서 사용 가이드

### 🔰 처음 시작하는 경우 (필수 순서)

1. **[CURRENT_STATUS.md](./project/CURRENT_STATUS.md)** ⭐ - 현재 프로젝트 상황 파악
2. **[PHASE3_EXECUTION_GUIDE.md](./project/PHASE3_EXECUTION_GUIDE.md)** ⭐ **NEW** - Phase 3 실행 가이드 (14일 계획)
3. **[API_REFERENCE.md](./api/API_REFERENCE.md)** ⭐ - 서버 API 레퍼런스
4. **[IMPLEMENTATION_FLOWS.md](./flows/IMPLEMENTATION_FLOWS.md)** ⭐ - 구현 플로우 가이드
5. **[COMPONENT_CATALOG.md](./components/COMPONENT_CATALOG.md)** - 완성된 컴포넌트 카탈로그
6. **[COMPONENT_DESIGN_GUIDE.md](./development/COMPONENT_DESIGN_GUIDE.md)** - 컴포넌트 개발 가이드
7. **[TECH_STACK.md](./TECH_STACK.md)** - 기술 스택 상세 정보

### 🎯 상황별 문서 찾기

#### 🔌 **API 연동할 때**

- **[API_REFERENCE.md](./api/API_REFERENCE.md)** ⭐ **필수** - 서버 API 레퍼런스
- **[IMPLEMENTATION_FLOWS.md](./flows/IMPLEMENTATION_FLOWS.md)** ⭐ **필수** - 구현 플로우 가이드
- **[TECHNICAL_ARCHITECTURE.md](./architecture/TECHNICAL_ARCHITECTURE.md)** - API 통신 아키텍처

#### 📱 **컴포넌트 개발할 때**

- **[COMPONENT_CATALOG.md](./components/COMPONENT_CATALOG.md)** - 완성된 컴포넌트 참조
- **[COMPONENT_DESIGN_GUIDE.md](./development/COMPONENT_DESIGN_GUIDE.md)** - 컴포넌트 설계 가이드
- **[DESIGN_SYSTEM.md](./architecture/DESIGN_SYSTEM.md)** - 디자인 시스템
- **[CODING_CONVENTIONS.md](./development/CODING_CONVENTIONS.md)** - 코딩 규칙

#### 🏗️ **아키텍처 이해할 때**

- **[TECHNICAL_ARCHITECTURE.md](./architecture/TECHNICAL_ARCHITECTURE.md)** - 시스템 아키텍처
- **[PACKAGE_STRUCTURE.md](./development/PACKAGE_STRUCTURE.md)** - 패키지 구조
- **[TECH_STACK.md](./TECH_STACK.md)** - 기술 스택

#### 👥 **사용자 경험 설계할 때**

- **[USER_FLOW_DESIGN.md](./architecture/USER_FLOW_DESIGN.md)** - 사용자 플로우
- **[DESIGN_SYSTEM.md](./architecture/DESIGN_SYSTEM.md)** - 노인 친화적 디자인

#### 📊 **프로젝트 관리할 때**

- **[CURRENT_STATUS.md](./project/CURRENT_STATUS.md)** - 현재 상태
- **[PHASE3_EXECUTION_GUIDE.md](./project/PHASE3_EXECUTION_GUIDE.md)** ⭐ **NEW** - Phase 3 실행 계획
- **[COMPONENT_CATALOG.md](./components/COMPONENT_CATALOG.md)** - 완성된 컴포넌트 현황
- **[DEVELOPMENT_PLAN.md](./project/DEVELOPMENT_PLAN.md)** - 개발 계획

### 🔄 문서 업데이트 규칙

#### 매일 업데이트

- **[CURRENT_STATUS.md](./project/CURRENT_STATUS.md)** - 주요 작업 완료시

#### 주간 업데이트

- **[DEVELOPMENT_PLAN.md](./project/DEVELOPMENT_PLAN.md)** - 계획 변경시

#### 변경 발생시 업데이트

- **[TECH_STACK.md](./TECH_STACK.md)** - 기술 스택 변경시
- **[COMPONENT_DESIGN_GUIDE.md](./development/COMPONENT_DESIGN_GUIDE.md)** - 새 컴포넌트 패턴 추가시

---

## 🎨 MARUNI 프로젝트 소개

### 👥 타겟 사용자

- **주 사용자**: 노인분들 (60세 이상)
- **핵심 니즈**: 간단하고 직관적인 소통 도구
- **사용 환경**: 모바일 우선 (PWA)

### 🏗️ 기술적 특징

- **React 19 + TypeScript** - 최신 React 기반 타입 안전 개발
- **PWA (Progressive Web App)** - 네이티브 앱과 유사한 사용자 경험
- **Tailwind CSS v4** - 노인 친화적 디자인 시스템
- **TanStack Query + Zustand** - 효율적인 상태 관리
- **오프라인 지원** - 서비스 워커 기반 기본 오프라인 기능

### 📱 핵심 기능

- **매일 안부 확인** - 정시 알림을 통한 일상 체크
- **AI 대화** - 자연스러운 대화를 통한 감정 상태 파악
- **보호자 소통** - 실시간 상태 공유 및 알림
- **긴급상황 대응** - 이상징후 감지 및 즉시 알림

### 🎯 노인 친화적 설계 원칙

- **큰 터치 영역** (60px+ 권장)
- **큰 폰트 크기** (18px+ 최소)
- **높은 색상 대비** (WCAG 2.1 AA 준수)
- **단순한 상호작용** (복잡한 제스처 지양)
- **명확한 피드백** (선명한 포커스, 로딩 상태)

---

## 📞 문의 및 지원

### 🚀 빠른 문제 해결

프로젝트 관련 문의사항이 있으시면 **상황별 문서**를 먼저 확인해주세요:

**개발 관련:**

- [CURRENT_STATUS.md](./project/CURRENT_STATUS.md) - 현재 상태 및 다음 단계
- [COMPONENT_DESIGN_GUIDE.md](./development/COMPONENT_DESIGN_GUIDE.md) - 컴포넌트 개발 가이드
- [TECH_STACK.md](./TECH_STACK.md) - 기술 스택 및 설정

**설계 관련:**

- [DEVELOPMENT_PLAN.md](./project/DEVELOPMENT_PLAN.md) - 개발 계획 및 로드맵
- [TECHNICAL_ARCHITECTURE.md](./architecture/TECHNICAL_ARCHITECTURE.md) - 시스템 아키텍처

### 📋 개발 시작 체크리스트

- [ ] [CURRENT_STATUS.md](./project/CURRENT_STATUS.md) 읽기
- [ ] [DEVELOPMENT_PLAN.md](./project/DEVELOPMENT_PLAN.md) 읽기
- [ ] [COMPONENT_DESIGN_GUIDE.md](./development/COMPONENT_DESIGN_GUIDE.md) 가이드라인 숙지
- [ ] 개발 환경 설정 확인 (`npm run dev` 실행)

---

## 📊 프로젝트 현황 요약

> **상세한 현황**: [CURRENT_STATUS.md](./project/CURRENT_STATUS.md) 문서 참조

| 항목          | 상태         | 비고                                                  |
| ------------- | ------------ | ----------------------------------------------------- |
| **기술 스택** | ✅ 완료      | React 19, TypeScript, PWA 준비                        |
| **개발 환경** | ✅ 완료      | Vite, ESLint, Prettier 설정                           |
| **문서화**    | ✅ 완료      | 설계, 개발 가이드, API 레퍼런스, 구현 플로우 완비     |
| **컴포넌트**  | ✅ 완료      | Phase 1 - 6개 컴포넌트 완성                           |
| **API 문서**  | ✅ 완료      | 서버 API 레퍼런스 및 구현 플로우 가이드               |
| **기능 구현** | 🔄 다음 단계 | Phase 3 - 실제 기능 구현 (인증, AI 대화, 보호자 관리) |

**📅 마지막 업데이트**: 2025-10-05
**📈 현재 진행률**: Phase 2 완료 + Phase 3 계획 완성 (70%)
**🎯 다음 단계**: Phase 3 실행 - 핵심 기능 구현 (AI 대화, 보호자 관리, 알림 이력, 회원 정보)
**⏰ 예상 완료**: 2주 후 MVP 완성 (Phase 3: 14일)
