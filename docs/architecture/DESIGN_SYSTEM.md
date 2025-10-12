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
- **Primary-500**: `#3b82f6` - 기본 주 색상 (파란색)
- **Primary-600**: `#2563eb` - 클릭 상태
- **Primary-700**: `#1d4ed8` - 진한 주 색상
- 신뢰감과 안정감을 주는 파란색 계열

### 보조 색상 (Gray)
- **Gray-50**: `#f9fafb` - 배경
- **Gray-100**: `#f3f4f6` - 연한 배경
- **Gray-200**: `#e5e7eb` - 구분선
- **Gray-700**: `#374151` - 제목 텍스트
- **Gray-900**: `#111827` - 가장 진한 텍스트

### 상태 색상 (Status Colors)
- **Success**: `#22c55e` - 긍정적 피드백 (초록색)
- **Warning**: `#f59e0b` - 주의 필요 (주황색)
- **Danger**: `#ef4444` - 긴급 상황 (빨간색)
- **Info**: `#06b6d4` - 일반 정보 (하늘색)

### 감정 표현 색상
- **Mood Happy**: `#22c55e` - 기분 좋음 (밝은 초록)
- **Mood Neutral**: `#f59e0b` - 보통 (따뜻한 노랑)
- **Mood Sad**: `#f97316` - 기분 안 좋음 (부드러운 주황)
- **AI Color**: `#8b5cf6` - AI 구분용 (보라색)

## 📝 타이포그래피

### 폰트 스케일 (노인 친화적 큰 폰트)
- **text-xs**: 14px - 보조 정보 (최소 크기)
- **text-sm**: 16px - 작은 텍스트
- **text-base**: 18px - 기본 텍스트 ⭐
- **text-lg**: 20px - 중요한 텍스트
- **text-xl**: 24px - 버튼 텍스트
- **text-2xl**: 30px - 제목
- **text-3xl**: 36px - 큰 제목
- **text-4xl**: 48px - 메인 제목

### 폰트 패밀리
- **기본 폰트**: `Noto Sans KR`, `-apple-system`, `Apple SD Gothic Neo`, `Malgun Gothic`
- **숫자 전용**: `SF Mono`, `Monaco`, `Cascadia Code`

### 폰트 굵기
- **font-light** (300): 보조 정보
- **font-normal** (400): 일반 텍스트
- **font-medium** (500): 중요한 텍스트
- **font-semibold** (600): 버튼, 제목
- **font-bold** (700): 강조 텍스트

### 행간 (Line Height)
- **leading-tight** (1.25): 제목용
- **leading-normal** (1.5): 일반 텍스트
- **leading-relaxed** (1.75): 긴 텍스트

## 📐 간격 시스템 (Spacing)

### 기본 간격 단위 (8px 기준)
- **space-2**: 8px
- **space-4**: 16px
- **space-6**: 24px
- **space-8**: 32px
- **space-12**: 48px
- **space-16**: 64px

### 컴포넌트별 간격
- **버튼 내부 패딩**:
  - Small: 12px 20px
  - Medium: 16px 24px
  - Large: 20px 32px
- **카드 패딩**: 24px
- **페이지 여백**: 20px
- **컴포넌트 간격**: 24px

## 🎯 터치 타겟 크기

### 최소 터치 영역 (WCAG 기준보다 큰 크기)
- **touch-target-min**: 48px - 최소 크기
- **touch-target-comfort**: 60px - 권장 크기 ⭐
- **touch-target-primary**: 72px - 주요 버튼

### 터치 간격
- **touch-gap-min**: 8px - 최소 간격
- **touch-gap-comfort**: 16px - 권장 간격

## 🔘 컴포넌트 스타일

### 버튼 시스템
- **주 버튼 (Primary)**: 파란색 배경, 흰색 텍스트, 72px 높이
- **보조 버튼 (Secondary)**: 회색 배경, 회색 텍스트, 60px 높이
- **감정 응답 버튼**: 80px 높이, 120px 너비, 아이콘 + 텍스트

### 입력 필드
- **높이**: 60px
- **폰트 크기**: 18px
- **패딩**: 16px 20px
- **테두리**: 2px solid
- **포커스**: 3px 그림자

### 카드 컴포넌트
- **배경**: 흰색
- **둥근 모서리**: 16px
- **그림자**: 0 2px 8px rgba(0, 0, 0, 0.1)
- **패딩**: 24px
- **호버 효과**: 살짝 위로 이동 + 진한 그림자

## 📱 반응형 디자인

### 브레이크포인트
- **mobile**: 320px - 최소 지원 크기
- **mobile-lg**: 480px - 큰 모바일
- **tablet**: 768px - 태블릿
- **desktop**: 1024px - 데스크톱
- **desktop-lg**: 1280px - 큰 데스크톱

### 반응형 원칙
- **모바일 우선**: 320px부터 설계
- **터치 최적화**: 모든 터치 타겟 48px 이상
- **단일 컬럼 레이아웃**: 스크롤 최소화

## ♿ 접근성 가이드라인

### 색상 대비
- **WCAG AA 기준**: 4.5:1 이상 준수
- **고대비**: 텍스트-배경 대비 최대화
- **색맹 고려**: 색상만으로 정보 전달 금지

### 포커스 표시
- **outline**: 3px solid (주 색상)
- **outline-offset**: 2px
- **키보드 포커스**: 명확한 시각적 표시

### 스크린 리더 지원
- **aria-label**: 모든 인터랙티브 요소
- **role**: 의미적 역할 명시
- **aria-describedby**: 도움말 연결

## 🎭 애니메이션

### 기본 트랜지션
- **transition-smooth**: 0.2s cubic-bezier(0.4, 0, 0.2, 1)
- **transition-slow**: 0.3s ease-in-out

### 페이지 전환
- **진입**: opacity 0 → 1, translateX 20px → 0
- **시간**: 0.3s ease-out

### 로딩 애니메이션
- **pulse**: opacity 1 → 0.5 → 1 (2초 반복)

## 🎨 아이콘 시스템

### 아이콘 크기
- **icon-sm**: 20px
- **icon-md**: 24px
- **icon-lg**: 32px
- **icon-xl**: 48px

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

**📅 마지막 업데이트**: 2025-10-12
