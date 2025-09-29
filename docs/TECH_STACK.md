# MARUNI 클라이언트 기술 스택

> **MARUNI (마음이 닿는 안부)** 노인 돌봄 AI 서비스 클라이언트의 기술 스택 가이드

## 🎯 기술 선택 배경

### 서비스 특성에 따른 요구사항
- **주 사용자**: 65세 이상 노인 (단순하고 직관적한 UI 필요)
- **플랫폼**: 모바일 우선 (안드로이드 중심, PWA 방식)
- **핵심 기능**: 매일 안부 확인 + AI 대화 + 실시간 알림
- **개발 목표**: 2-3주 내 MVP 완성, 점진적 확장

### 기술적 목표
- ✅ **빠른 개발**: 검증된 기술 스택으로 개발 속도 최적화
- ✅ **PWA 경험**: 네이티브 앱과 유사한 사용자 경험
- ✅ **접근성 우선**: WCAG 2.1 AA 기준 준수
- ✅ **오프라인 지원**: 기본적인 오프라인 기능 제공

## 🛠️ 핵심 기술 스택

### Frontend 프레임워크
```json
{
  "프레임워크": "React 19.1.1",
  "언어": "TypeScript 5.8.3",
  "빌드도구": "Vite 7.1.7"
}
```

**선택 이유:**
- **React 19**: 최신 기능 (Concurrent Features, Suspense) 활용
- **TypeScript**: 타입 안전성으로 버그 예방, 개발 생산성 향상
- **Vite**: 빠른 개발 서버, HMR, 최적화된 빌드

**대안 검토:**
- Vue.js ❌ (React 생태계의 풍부함과 팀 경험 고려)
- Next.js ❌ (PWA 특성상 SPA가 더 적합)

### 스타일링
```json
{
  "CSS프레임워크": "Tailwind CSS 4.1.13",
  "UI라이브러리": "Headless UI 2.4.1"
}
```

**선택 이유:**
- **Tailwind CSS v4**: 노인 친화적 디자인 시스템 구축에 유연성 제공
- **Headless UI**: 접근성 기본 제공, 커스텀 스타일링 용이

**대안 검토:**
- Styled Components ❌ (번들 크기 및 성능 고려)
- Material-UI ❌ (노인 친화적 커스텀 디자인 필요)

### 상태 관리
```json
{
  "서버상태": "TanStack Query 5.90.2",
  "클라이언트상태": "Zustand 5.0.8"
}
```

**선택 이유:**
- **TanStack Query**: 서버 상태 캐싱, 자동 재검증, 오프라인 지원
- **Zustand**: 간단한 API, 작은 번들 크기, TypeScript 지원

**대안 검토:**
- Redux Toolkit ❌ (과도한 보일러플레이트)
- SWR ❌ (TanStack Query의 더 풍부한 기능)

### 라우팅 & HTTP
```json
{
  "라우팅": "React Router 7.9.3",
  "HTTP클라이언트": "Axios 1.12.2"
}
```

**선택 이유:**
- **React Router**: React와 완벽한 호환성, 중첩 라우팅 지원
- **Axios**: 인터셉터 기능으로 JWT 토큰 자동 관리 용이

### PWA & 도구
```json
{
  "PWA": "vite-plugin-pwa 1.0.3",
  "아이콘": "Lucide React 1.1.46",
  "린팅": "ESLint 9.16.0",
  "포맷팅": "Prettier 3.4.2"
}
```

**선택 이유:**
- **vite-plugin-pwa**: Workbox 기반 서비스 워커 자동 생성
- **Lucide**: 일관성 있고 접근성 좋은 아이콘 세트
- **ESLint + Prettier**: 코드 품질 및 일관성 확보

## 📱 PWA 설정

### Service Worker 전략
```javascript
// 네트워크 우선, 캐시 폴백
registerSW({
  onNeedRefresh() {
    // 앱 업데이트 알림
  },
  onOfflineReady() {
    // 오프라인 준비 완료
  }
});
```

### 매니페스트 설정
```json
{
  "name": "MARUNI - 마음이 닿는 안부",
  "short_name": "MARUNI",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait"
}
```

### 오프라인 지원
- **정적 자원**: 앱 쉘, 아이콘, 폰트 캐싱
- **API 응답**: 최근 대화 내역 캐싱
- **오프라인 표시**: 네트워크 상태 감지 및 안내

## 🔧 개발 도구 설정

### TypeScript 설정
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/shared/components/*"],
      "@/hooks/*": ["src/shared/hooks/*"],
      "@/utils/*": ["src/shared/utils/*"],
      "@/constants/*": ["src/shared/constants/*"],
      "@/types/*": ["src/shared/types/*"],
      "@/features/*": ["src/features/*"],
      "@/pages/*": ["src/pages/*"],
      "@/app/*": ["src/app/*"]
    }
  }
}
```

### Vite 설정 핵심
```javascript
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    port: 3000
  }
});
```

### ESLint 설정
```javascript
export default [
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    }
  }
];
```

## 🚀 성능 최적화 전략

### 번들 최적화
- **코드 스플리팅**: React.lazy()로 페이지별 분할
- **Tree Shaking**: 사용하지 않는 코드 자동 제거
- **Dynamic Import**: 필요시에만 라이브러리 로드

### 런타임 최적화
- **React 19 기능**: Concurrent Features 활용
- **TanStack Query**: 캐싱 및 백그라운드 업데이트
- **이미지 최적화**: WebP 포맷, 지연 로딩

## 📊 개발 명령어

> **상세한 개발 명령어**: [현재 상태 문서](./project/CURRENT_STATUS.md#개발-명령어) 참조

## 🔄 업데이트 로그

| 날짜 | 변경 내용 | 버전 |
|------|----------|------|
| 2025-09-29 | 초기 기술 스택 설정 | 1.0.0 |

## 🔗 관련 문서

- 📐 [기술 아키텍처](./architecture/TECHNICAL_ARCHITECTURE.md) - 시스템 구조 및 설계
- 📁 [패키지 구조](./development/PACKAGE_STRUCTURE.md) - 프로젝트 구조 가이드
- 📝 [코딩 컨벤션](./development/CODING_CONVENTIONS.md) - 개발 규칙
- 📊 [현재 상태](./project/CURRENT_STATUS.md) - 현재 구현 상태

---

**📅 마지막 업데이트**: 2025-09-29
**🎯 현재 상태**: Phase 1 완료 (환경 구축)
**📋 다음 작업**: Phase 2 기본 기능 구현