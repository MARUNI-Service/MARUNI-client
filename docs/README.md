# MARUNI 클라이언트 문서 가이드

> 노인 돌봄 AI 서비스 **MARUNI** 클라이언트 프로젝트의 문서 디렉토리입니다.

## 📁 문서 구조

### 📐 Architecture (아키텍처)
시스템 설계와 UI/UX 설계 관련 문서들

- **[DESIGN_SYSTEM.md](./architecture/DESIGN_SYSTEM.md)**
  - 노인 친화적 디자인 시스템
  - 색상, 타이포그래피, 컴포넌트 스타일 가이드
  - 접근성 가이드라인 (WCAG 2.1 AA 준수)

- **[TECHNICAL_ARCHITECTURE.md](./architecture/TECHNICAL_ARCHITECTURE.md)**
  - 기술 스택 및 시스템 아키텍처
  - API 클라이언트 설계
  - PWA 및 오프라인 전략
  - 성능 최적화 방안

- **[USER_FLOW_DESIGN.md](./architecture/USER_FLOW_DESIGN.md)**
  - 노인 사용자 페르소나
  - 온보딩 플로우 (7단계)
  - 일상적 사용 플로우
  - 긴급상황 처리 플로우

### 🛠️ Development (개발)
개발 가이드라인과 코딩 규칙 관련 문서들

- **[CODING_CONVENTIONS.md](./development/CODING_CONVENTIONS.md)**
  - 파일 및 폴더 네이밍 규칙
  - TypeScript 컨벤션
  - React 컨벤션 (컴포넌트 구조, Props 네이밍)
  - CSS/Tailwind 컨벤션
  - 임포트 순서 및 경로 규칙

- **[PACKAGE_STRUCTURE.md](./development/PACKAGE_STRUCTURE.md)**
  - 4계층 패키지 구조 설계 (App/Pages/Features/Shared)
  - Feature 모듈 설계 (서버 도메인 기반)
  - 의존성 관리 규칙
  - 확장성 고려사항

### 📊 Project (프로젝트)
프로젝트 진행 상황과 로드맵 관련 문서들

- **[PROJECT_PROGRESS.md](./project/PROJECT_PROGRESS.md)**
  - 현재 프로젝트 진행 상황 (25% 완료)
  - 완료된 작업 현황
  - 기술 스택 현황
  - 핵심 성과 및 인사이트

- **[DEVELOPMENT_ROADMAP.md](./project/DEVELOPMENT_ROADMAP.md)**
  - 5단계 개발 로드맵 (5주 계획)
  - Phase 2 상세 일일 계획
  - 성공 지표 및 위험 관리
  - 마일스톤 및 검증 포인트

## 📋 문서 사용 가이드

### 🔰 새로운 팀원을 위한 필독 순서
1. **[PROJECT_PROGRESS.md](./project/PROJECT_PROGRESS.md)** - 현재 상황 파악
2. **[TECHNICAL_ARCHITECTURE.md](./architecture/TECHNICAL_ARCHITECTURE.md)** - 기술적 이해
3. **[CODING_CONVENTIONS.md](./development/CODING_CONVENTIONS.md)** - 코딩 규칙 숙지
4. **[USER_FLOW_DESIGN.md](./architecture/USER_FLOW_DESIGN.md)** - 사용자 관점 이해

### 🎯 목적별 문서 찾기

**UI/UX 작업할 때:**
- [DESIGN_SYSTEM.md](./architecture/DESIGN_SYSTEM.md) - 디자인 가이드라인
- [USER_FLOW_DESIGN.md](./architecture/USER_FLOW_DESIGN.md) - 사용자 플로우

**코드 작성할 때:**
- [CODING_CONVENTIONS.md](./development/CODING_CONVENTIONS.md) - 코딩 규칙
- [PACKAGE_STRUCTURE.md](./development/PACKAGE_STRUCTURE.md) - 구조 가이드
- [TECHNICAL_ARCHITECTURE.md](./architecture/TECHNICAL_ARCHITECTURE.md) - 기술적 구현 방법

**프로젝트 계획 세울 때:**
- [DEVELOPMENT_ROADMAP.md](./project/DEVELOPMENT_ROADMAP.md) - 개발 계획
- [PROJECT_PROGRESS.md](./project/PROJECT_PROGRESS.md) - 현재 진행 상황

### 🔄 문서 업데이트 규칙

- **PROJECT_PROGRESS.md**: 주요 작업 완료시마다 업데이트
- **DEVELOPMENT_ROADMAP.md**: 주간 단위로 검토 및 조정
- **기타 문서**: 관련 작업 수행시 함께 업데이트

## 🎨 MARUNI 프로젝트 특징

### 👥 타겟 사용자
- **주 사용자**: 노인분들 (60세 이상)
- **핵심 니즈**: 간단하고 직관적인 소통 도구

### 🏗️ 기술적 특징
- **React 19** + TypeScript 기반
- **PWA** - 네이티브 앱과 유사한 경험
- **노인 친화적 UI** - 큰 터치 영역, 높은 대비
- **오프라인 지원** - 기본적인 오프라인 기능

### 📱 핵심 기능
- 매일 안부 확인 메시지
- AI와의 자연스러운 대화
- 보호자와의 실시간 소통
- 긴급상황 알림 시스템

---

## 📞 문의 및 지원

프로젝트 관련 문의사항이 있으시면 다음 문서들을 먼저 확인해주세요:
- 기술적 질문: [TECHNICAL_ARCHITECTURE.md](./architecture/TECHNICAL_ARCHITECTURE.md)
- 개발 관련: [CODING_CONVENTIONS.md](./development/CODING_CONVENTIONS.md)
- 진행 상황: [PROJECT_PROGRESS.md](./project/PROJECT_PROGRESS.md)

---

**📅 마지막 업데이트**: 2025-09-29
**📈 현재 진행률**: Phase 1 완료 (25%)
**🎯 다음 단계**: Phase 2 - 기본 기능 구현