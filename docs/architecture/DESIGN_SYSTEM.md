# MARUNI 디자인 시스템

## 🎨 디자인 철학

### 핵심 원칙
1. **단순함 (Simplicity)**: 한 화면에 핵심 기능만 배치
2. **명확함 (Clarity)**: 모든 요소의 기능과 상태가 명확히 구분
3. **접근성 (Accessibility)**: 모든 연령과 능력의 사용자가 쉽게 사용
4. **일관성 (Consistency)**: 전체 앱에서 동일한 패턴과 규칙 적용
5. **친근함 (Friendliness)**: 따뜻하고 안전한 느낌의 디자인

### 노인 친화적 디자인 고려사항
- **시각적 명확성**: 높은 대비, 큰 폰트, 충분한 여백
- **운동 능력**: 큰 터치 영역, 쉬운 제스처
- **인지 부담 최소화**: 직관적 아이콘, 단순한 구조
- **실수 방지**: 실행 취소 기능, 확인 단계

## 🎨 색상 시스템

### 주 색상 (Primary Colors)
```css
/* 신뢰감과 안정감을 주는 파란색 계열 */
--primary-50: #eff6ff;   /* 매우 연한 배경 */
--primary-100: #dbeafe;  /* 연한 배경 */
--primary-200: #bfdbfe;  /* 비활성 상태 */
--primary-300: #93c5fd;  /* 보조 요소 */
--primary-400: #60a5fa;  /* 호버 상태 */
--primary-500: #3b82f6;  /* 기본 주 색상 */
--primary-600: #2563eb;  /* 클릭 상태 */
--primary-700: #1d4ed8;  /* 진한 주 색상 */
--primary-800: #1e40af;  /* 매우 진한 */
--primary-900: #1e3a8a;  /* 가장 진한 */
```

### 보조 색상 (Secondary Colors)
```css
/* 차분하고 중립적인 회색 계열 */
--gray-50: #f9fafb;     /* 배경 */
--gray-100: #f3f4f6;    /* 연한 배경 */
--gray-200: #e5e7eb;    /* 구분선 */
--gray-300: #d1d5db;    /* 비활성 텍스트 */
--gray-400: #9ca3af;    /* 보조 텍스트 */
--gray-500: #6b7280;    /* 일반 텍스트 */
--gray-600: #4b5563;    /* 진한 텍스트 */
--gray-700: #374151;    /* 제목 텍스트 */
--gray-800: #1f2937;    /* 매우 진한 텍스트 */
--gray-900: #111827;    /* 가장 진한 텍스트 */
```

### 상태 색상 (Status Colors)
```css
/* 성공 - 초록색 */
--success-50: #f0fdf4;
--success-500: #22c55e;  /* 긍정적 피드백 */
--success-600: #16a34a;

/* 경고 - 주황색 */
--warning-50: #fffbeb;
--warning-500: #f59e0b;  /* 주의 필요 */
--warning-600: #d97706;

/* 위험 - 빨간색 */
--danger-50: #fef2f2;
--danger-500: #ef4444;   /* 긴급 상황 */
--danger-600: #dc2626;

/* 정보 - 하늘색 */
--info-50: #f0f9ff;
--info-500: #06b6d4;     /* 일반 정보 */
--info-600: #0891b2;
```

### 감정 표현 색상
```css
/* 기분 좋음 */
--mood-happy: #22c55e;   /* 밝은 초록 */

/* 보통 */
--mood-neutral: #f59e0b; /* 따뜻한 노랑 */

/* 기분 안 좋음 */
--mood-sad: #f97316;     /* 부드러운 주황 (빨강보다 덜 자극적) */

/* AI 대화 */
--ai-color: #8b5cf6;     /* 보라색 - AI 구분용 */
```

## 📝 타이포그래피

### 폰트 스케일
```css
/* 노인 친화적 큰 폰트 사이즈 */
--text-xs: 14px;    /* 보조 정보 (최소 크기) */
--text-sm: 16px;    /* 작은 텍스트 */
--text-base: 18px;  /* 기본 텍스트 (일반 앱의 16px 대신) */
--text-lg: 20px;    /* 중요한 텍스트 */
--text-xl: 24px;    /* 버튼 텍스트 */
--text-2xl: 30px;   /* 제목 */
--text-3xl: 36px;   /* 큰 제목 */
--text-4xl: 48px;   /* 메인 제목 */
```

### 폰트 패밀리
```css
/* 기본 폰트 - 가독성 우선 */
--font-family:
  'Noto Sans KR',
  -apple-system,
  BlinkMacSystemFont,
  'Apple SD Gothic Neo',
  'Malgun Gothic',
  sans-serif;

/* 숫자 전용 폰트 - 명확한 구분 */
--font-number:
  'SF Mono',
  'Monaco',
  'Cascadia Code',
  monospace;
```

### 폰트 굵기
```css
--font-light: 300;     /* 보조 정보 */
--font-normal: 400;    /* 일반 텍스트 */
--font-medium: 500;    /* 중요한 텍스트 */
--font-semibold: 600;  /* 버튼, 제목 */
--font-bold: 700;      /* 강조 텍스트 */
```

### 행간 (Line Height)
```css
--leading-tight: 1.25;   /* 제목용 */
--leading-normal: 1.5;   /* 일반 텍스트 */
--leading-relaxed: 1.75; /* 긴 텍스트 */
```

## 📐 간격 시스템 (Spacing)

### 기본 간격 단위
```css
/* 8px 기준 - 터치 친화적 */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
```

### 컴포넌트별 간격
```css
/* 버튼 내부 패딩 */
--button-padding-sm: 12px 20px;   /* 작은 버튼 */
--button-padding-md: 16px 24px;   /* 기본 버튼 */
--button-padding-lg: 20px 32px;   /* 큰 버튼 */

/* 카드 패딩 */
--card-padding: 24px;

/* 페이지 여백 */
--page-padding: 20px;

/* 컴포넌트 간격 */
--component-gap: 24px;
```

## 🎯 터치 타겟 크기

### 최소 터치 영역
```css
/* WCAG 기준보다 큰 크기 적용 */
--touch-target-min: 48px;   /* 최소 크기 */
--touch-target-comfort: 60px; /* 권장 크기 */
--touch-target-primary: 72px; /* 주요 버튼 */

/* 터치 간격 */
--touch-gap-min: 8px;       /* 최소 간격 */
--touch-gap-comfort: 16px;  /* 권장 간격 */
```

## 🔘 컴포넌트 스타일

### 버튼 시스템
```css
/* 주 버튼 (Primary Button) */
.btn-primary {
  background: var(--primary-500);
  color: white;
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  padding: var(--button-padding-lg);
  min-height: var(--touch-target-primary);
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-600);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary:active {
  background: var(--primary-700);
  transform: translateY(1px);
}

/* 보조 버튼 (Secondary Button) */
.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  padding: var(--button-padding-md);
  min-height: var(--touch-target-comfort);
  border-radius: 8px;
  border: 1px solid var(--gray-200);
}

/* 감정 응답 버튼 */
.btn-mood {
  min-height: 80px;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
}

.btn-mood-happy {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: var(--success-600);
  border: 2px solid var(--success-200);
}

.btn-mood-neutral {
  background: linear-gradient(135deg, #fef3c7, #fed7aa);
  color: var(--warning-600);
  border: 2px solid var(--warning-200);
}

.btn-mood-sad {
  background: linear-gradient(135deg, #fed7d7, #fecaca);
  color: var(--danger-500);
  border: 2px solid var(--danger-200);
}
```

### 입력 필드
```css
.input-field {
  font-size: var(--text-lg);
  padding: 16px 20px;
  min-height: var(--touch-target-comfort);
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  background: white;
  width: 100%;
}

.input-field:focus {
  border-color: var(--primary-400);
  box-shadow: 0 0 0 3px var(--primary-100);
  outline: none;
}

.input-field::placeholder {
  color: var(--gray-400);
  font-size: var(--text-base);
}
```

### 카드 컴포넌트
```css
.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: var(--card-padding);
  border: 1px solid var(--gray-100);
}

.card-hover {
  transition: all 0.2s ease;
  cursor: pointer;
}

.card-hover:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
```

## 📱 반응형 디자인

### 브레이크포인트
```css
/* 모바일 우선 설계 */
--mobile: 320px;     /* 최소 지원 크기 */
--mobile-lg: 480px;  /* 큰 모바일 */
--tablet: 768px;     /* 태블릿 */
--desktop: 1024px;   /* 데스크톱 */
--desktop-lg: 1280px; /* 큰 데스크톱 */
```

### 반응형 패딩
```css
/* 화면 크기별 여백 조정 */
.responsive-padding {
  padding: 16px; /* 모바일 */
}

@media (min-width: 768px) {
  .responsive-padding {
    padding: 24px; /* 태블릿 */
  }
}

@media (min-width: 1024px) {
  .responsive-padding {
    padding: 32px; /* 데스크톱 */
  }
}
```

### 반응형 폰트
```css
/* 화면 크기별 폰트 조정 */
.responsive-text {
  font-size: 18px; /* 모바일 기본 */
}

@media (min-width: 768px) {
  .responsive-text {
    font-size: 20px; /* 태블릿 */
  }
}
```

## 🌗 다크 모드 (선택적)

### 다크 모드 색상
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #374151;
  }
}

/* 다크 모드 버튼 */
.btn-primary-dark {
  background: var(--primary-600);
  color: white;
}

.btn-secondary-dark {
  background: var(--gray-700);
  color: var(--gray-100);
  border-color: var(--gray-600);
}
```

## ♿ 접근성 가이드라인

### 색상 대비
```css
/* WCAG AA 기준 4.5:1 이상 */
.high-contrast {
  color: var(--gray-900);
  background: white;
}

.high-contrast-reverse {
  color: white;
  background: var(--gray-900);
}
```

### 포커스 표시
```css
.focus-visible {
  outline: 3px solid var(--primary-400);
  outline-offset: 2px;
}

/* 키보드 네비게이션 */
.keyboard-focusable:focus-visible {
  box-shadow: 0 0 0 3px var(--primary-200);
  border-color: var(--primary-500);
}
```

### 스크린 리더 지원
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 🎭 애니메이션

### 기본 트랜지션
```css
/* 부드럽고 자연스러운 애니메이션 */
.transition-smooth {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-slow {
  transition: all 0.3s ease-in-out;
}

/* 페이지 전환 */
.page-enter {
  opacity: 0;
  transform: translateX(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-out;
}
```

### 로딩 애니메이션
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## 🎨 아이콘 시스템

### 아이콘 크기
```css
--icon-xs: 16px;   /* 작은 아이콘 */
--icon-sm: 20px;   /* 일반 아이콘 */
--icon-md: 24px;   /* 기본 아이콘 */
--icon-lg: 32px;   /* 큰 아이콘 */
--icon-xl: 48px;   /* 매우 큰 아이콘 */
```

### 감정 이모지
- 😊 좋음 (happy)
- 😐 보통 (neutral)
- 😢 안 좋음 (sad)
- 💬 대화 (chat)
- 🔔 알림 (notification)
- ⚠️ 경고 (warning)
- 🚨 긴급 (emergency)

---

**🎯 이 디자인 시스템은 노인 사용자의 특성을 고려하여 가독성, 접근성, 사용성을 최우선으로 설계되었습니다.**