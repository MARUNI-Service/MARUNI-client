# MARUNI Client - Claude Assistant Guide

## Development Guidelines for Claude Assistant

### Planning and Implementation
- When asked for a plan, always ask if you should implement the code.
- Don't write more code than requested.
- Don't start the server after implementation.
- Don't use emojis in design. Use Lucide icons instead.
- Always run TypeScript check after code generation.
- Don't write excessive code examples in CLAUDE.md files.
- Always prefer Korean over English in responses.
- Always create files with UTF-8 encoding.
- After code updates, always access the appropriate page and check for errors. If errors exist, resolve them.
- When problems are found, always approach solutions fundamentally, not as temporary fixes.

### Elderly-Friendly Development Guidelines
- Ensure all UI components have minimum touch area of 48x48px.
- Use minimum font size of 18px, button text should be 20px or larger.
- Maintain color contrast above WCAG 2.1 AA standards.
- Minimize complex interactions or multi-step flows.

### PWA Related
- When working on PWA features, check manifest and service worker settings.
- Always consider offline functionality possibilities.

### API Communication
- Always include error handling and loading states for API calls.
- Use TanStack Query for server state, Zustand for client state.

### Testing and Quality
- Always verify actual functionality in browser after component creation.
- Test in mobile viewport as well.

### Technology Stack Compliance
- Use Tailwind CSS v4 syntax (@import "tailwindcss").
- Check if existing stack can solve the problem before adding new dependencies.

## 프로젝트 개요
- **프로젝트명**: MARUNI (마음이 닿는 안부)
- **설명**: 노인 돌봄을 위한 AI 기반 소통 서비스 - PWA 클라이언트
- **타겟 사용자**: 노인층 (단순하고 직관적인 UI 필요)
- **개발 기간**: MVP 2-3주

## 기술 스택
- **프레임워크**: React 19.1.1 + TypeScript
- **빌드 도구**: Vite 7.1.7
- **스타일링**: Tailwind CSS v4.1.13
- **상태 관리**:
  - TanStack Query (서버 상태)
  - Zustand (클라이언트 상태)
- **라우팅**: React Router v7.9.3
- **HTTP 클라이언트**: Axios 1.12.2
- **UI 컴포넌트**: Headless UI
- **PWA**: vite-plugin-pwa 1.0.3

## 개발 명령어
```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 타입 체크
npm run build  # TypeScript 컴파일 포함

# 린트
npm run lint

# 프리뷰
npm run preview
```

## 중요 설정 파일들
- `vite.config.ts`: PWA 설정 포함, Tailwind v4 공식 플러그인 사용
- `src/index.css`: Tailwind import + 노인 친화적 기본 스타일
- `package.json`: 모든 필수 의존성 정의

## PWA 설정
- **매니페스트**: vite.config.ts에서 정의
- **서비스 워커**: 자동 업데이트 설정
- **아이콘**: `public/icons/` 디렉토리 (192x192, 512x512)

## 백엔드 API
- **서버 주소**: (환경변수로 설정 예정)
- **인증**: JWT 토큰 기반
- **API 문서**: ../maruni-server/docs/README.md 참조

## 노인 친화적 UI 가이드라인
- **폰트 크기**: 최소 18px (기본), 버튼은 20px+
- **터치 영역**: 최소 48x48px, 권장 60px+
- **대비**: 높은 명도 대비 사용
- **색상**: 단순하고 명확한 색상 팔레트
- **레이아웃**: 단순하고 직관적인 구조

## 커스텀 CSS 클래스
```css
.btn-primary      # 주 버튼 (60px 높이, 큰 텍스트)
.btn-secondary    # 보조 버튼
.touch-target     # 터치 영역 최소 크기
.text-high-contrast # 고대비 텍스트
```

## 개발 시 주의사항
1. **접근성**: 스크린 리더, 키보드 네비게이션 고려
2. **성능**: PWA이므로 번들 크기 최적화 필요
3. **오프라인**: 서비스 워커로 기본 오프라인 기능 제공
4. **반응형**: 모바일 우선 설계
5. **노인 친화적**: 복잡한 상호작용 최소화

## Git 정보
- **브랜치 전략**: (프로젝트 진행 시 정의)
- **커밋 컨벤션**: (프로젝트 진행 시 정의)

## 환경 변수
```bash
# .env.local 예시
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=MARUNI
```

---
*마지막 업데이트: 2025-09-29*