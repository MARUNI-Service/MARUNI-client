# Phase 3 실행 가이드: 핵심 기능 구현

> **MARUNI 클라이언트 Phase 3 - Agile 실행 계획**
> **목표**: AI 대화, 보호자 관리, 알림 이력, 회원 정보 기능 완성
> **기간**: 14일 (12일 개발 + 2일 예비/통합)
> **진행률 목표**: 70% → 90%

---

## 🎯 핵심 원칙

### 1. Working Software First
- **매일 동작하는 것을 만든다**: 완벽한 코드보다 동작하는 기능 우선
- **매일 빌드 성공**: `npm run build` 통과 필수
- **End-to-End 완성**: 작은 기능이라도 전체 플로우 동작 확인

### 2. Agile & Iterative
- **작은 단위로 구현 → 테스트 → 개선**: 한 번에 완벽하게 만들려 하지 않음
- **빠른 피드백**: 서버 API 연동은 즉시 테스트
- **유연한 계획**: 예상치 못한 문제 발생 시 우선순위 조정

### 3. Risk Management
- **Day 1부터 API 검증**: 문서 ≠ 실제 구현일 수 있음 인정
- **예비 시간 확보**: Day 7, Day 14는 통합/예비일
- **점진적 복잡도**: 기본 기능 → 최적화 → 고급 기능 순서

### 4. Practical Approach
- **코드 템플릿은 참고용**: 강제 복붙이 아님
- **시간 배정은 가이드**: 목표 달성이 우선, 시간 엄수가 목적 아님
- **노인 친화적 UI는 필수**: 60px+ 터치, 18px+ 폰트는 타협 불가

---

## 📅 전체 일정 (14일)

### Week 1: AI 대화 + 보호자 관리
| Day | 목표 | 검증 기준 |
|-----|------|----------|
| 1 | Conversation API 연동 성공 | Postman 수준 테스트 통과 |
| 2 | 메시지 전송/수신 UI 동작 | 대화 페이지에서 AI 응답 받기 |
| 3 | 감정 아이콘 + 노인 친화적 디자인 | 말풍선 UI 완성 |
| 4 | 대화 기능 전체 플로우 테스트 | 로그인 → 대화 → 응답 확인 |
| 5 | Guardian API 연동 + 기본 폼 | 보호자 등록 성공 |
| 6 | Guardian 전체 플로우 완성 | 등록 → 조회 → 해제 동작 |
| 7 | **Week 1 통합 + 예비일** | 모든 기능 통합 동작 |

### Week 2: 알림 이력 + 회원 정보 + 통합
| Day | 목표 | 검증 기준 |
|-----|------|----------|
| 8 | Alert API 연동 + 이력 리스트 | 알림 목록 조회 성공 |
| 9 | Alert 필터링 + 레벨 배지 | 기간 필터 동작 |
| 10 | Member API 연동 + 프로필 조회 | 내 정보 조회 성공 |
| 11 | Member 정보 수정 기능 | 이름/비밀번호 수정 동작 |
| 12 | 대시보드 통합 + 네비게이션 | 모든 페이지 접근 가능 |
| 13 | 에러 처리 + 로딩 상태 개선 | 네트워크 에러 처리 |
| 14 | **최종 테스트 + 문서화** | 전체 플로우 통과 |

---

## 📋 Week 1 상세 계획

### Day 1: Conversation API 연동 성공
**⏰ 예상 시간**: 4-6시간
**🎯 목표**: 서버 API와 통신 성공 (UI 없어도 됨)

**핵심 작업**:
1. **폴더 구조 생성** (30분)
   ```
   src/features/conversation/
   ├── api/conversationApi.ts
   ├── types/conversation.types.ts
   └── index.ts
   ```

2. **타입 정의** (1시간)
   - EmotionType, MessageType, Message 인터페이스
   - ConversationResponse, SendMessageRequest 정의
   - 참고: [API_REFERENCE.md - Conversation API](../api/conversation-api.md)

3. **API 모듈 구현** (2시간)
   ```typescript
   export const conversationApi = {
     sendMessage: async (data: SendMessageRequest) => {
       const response = await apiClient.post('/conversations/messages', data);
       return response.data.data;
     }
   };
   ```

4. **API 동작 검증** ⭐ **중요**
   - 개발자 도구 Console에서 직접 호출
   - 또는 간단한 테스트 페이지 생성
   - 서버가 실제로 응답하는지 확인
   - **서버 API 문서와 다른 점 발견 시 기록**

**완료 기준**:
- [ ] `conversationApi.sendMessage()` 호출 시 AI 응답 수신
- [ ] TypeScript 컴파일 에러 없음
- [ ] 서버 API 실제 동작 확인 완료

**리스크 대응**:
- 서버 API가 문서와 다른 경우 → 실제 응답 기준으로 타입 수정
- 서버 연결 안 되는 경우 → Mock 데이터로 임시 진행

---

### Day 2: 메시지 전송/수신 UI 동작
**⏰ 예상 시간**: 5-7시간
**🎯 목표**: 대화 페이지에서 메시지 입력하고 AI 응답 받기

**핵심 작업**:
1. **TanStack Query 훅** (2시간)
   - `useSendMessage` 기본 구현 (낙관적 업데이트는 나중에)
   - 단순 Mutation: 전송 → 응답 → 화면 갱신

2. **MessageInput 컴포넌트** (2시간)
   - 기존 `Input`, `Button` 컴포넌트 활용
   - 전송 중 상태 표시 (`isPending`)
   - 노인 친화적: 큰 입력창, 큰 전송 버튼

3. **MessageList 기본 구현** (2시간)
   - 메시지 배열 표시 (간단한 리스트)
   - 스타일은 나중에, 우선 동작 확인

4. **ConversationPage 생성 및 라우팅** (1시간)
   - `/conversation` 경로 추가
   - 대시보드에서 링크 연결
   - **전체 플로우 테스트**: 로그인 → 대시보드 → 대화 → 응답

**완료 기준**:
- [ ] 메시지 입력 → 전송 → AI 응답 확인 (전체 플로우 동작)
- [ ] `npm run build` 성공
- [ ] 대시보드에서 대화 페이지 접근 가능

**리스크 대응**:
- Input 컴포넌트에 필요한 Props 없는 경우 → 임시 수정 또는 HTML input 사용
- 응답 속도 느린 경우 → 로딩 스피너 표시

---

### Day 3: 감정 아이콘 + 노인 친화적 디자인
**⏰ 예상 시간**: 4-6시간
**🎯 목표**: 말풍선 UI 완성 (보기 좋은 대화창)

**핵심 작업**:
1. **MessageBubble 컴포넌트** (2시간)
   - 사용자/AI 말풍선 구분 (왼쪽/오른쪽)
   - 큰 폰트 (18px+), 충분한 패딩
   - 색상 대비 확보 (배경/텍스트)

2. **EmotionBadge 컴포넌트** (1시간)
   - 😊 긍정, 😢 부정, 😐 중립 아이콘
   - 접근성: `role="img"`, `aria-label`

3. **MessageList 스타일 개선** (2시간)
   - 스크롤 가능한 영역
   - 자동 스크롤 (최신 메시지로)
   - 빈 상태 처리 (대화 없을 때)

4. **UI 검증** ⭐
   - 노인 친화적 체크리스트:
     - [ ] 폰트 크기 18px 이상
     - [ ] 터치 영역 명확
     - [ ] 색상 대비 충분
     - [ ] 읽기 쉬운 레이아웃

**완료 기준**:
- [ ] 말풍선 UI가 보기 좋고 읽기 쉬움
- [ ] 감정 아이콘 정상 표시
- [ ] 노인 친화적 체크리스트 통과

**선택 사항** (시간 남으면):
- 낙관적 업데이트 추가 (즉시 UI 반영)
- 메시지 전송 시간 표시
- 타이핑 애니메이션

---

### Day 4: 대화 기능 전체 플로우 테스트
**⏰ 예상 시간**: 4-5시간
**🎯 목표**: 버그 수정 + 에러 처리 + 안정화

**핵심 작업**:
1. **전체 플로우 반복 테스트** (2시간)
   - 로그인 → 대화 → 로그아웃 → 재로그인 → 대화
   - 여러 메시지 연속 전송
   - 네트워크 느릴 때 동작 확인

2. **에러 처리 구현** (2시간)
   - 네트워크 에러 시 에러 메시지 표시
   - 전송 실패 시 재시도 가능하게
   - Toast 없으면 간단한 alert() 사용

3. **버그 수정** (1시간)
   - 발견된 문제 수정
   - 엣지 케이스 처리

**완료 기준**:
- [ ] 연속 10번 메시지 전송 성공
- [ ] 네트워크 에러 시 사용자에게 피드백
- [ ] `npm run build` 성공
- [ ] 코드 리뷰 (본인 또는 Claude)

**리스크 대응**:
- 심각한 버그 발견 시 → Day 5 일정 조정
- 서버 안정성 문제 → Mock 데이터로 임시 대응

---

### Day 5: Guardian API 연동 + 기본 폼
**⏰ 예상 시간**: 5-7시간
**🎯 목표**: 보호자 등록 성공

**핵심 작업**:
1. **폴더 구조 + 타입 정의** (1시간)
   ```
   src/features/guardian/
   ├── api/guardianApi.ts
   ├── types/guardian.types.ts
   ├── hooks/useGuardian.ts
   └── components/GuardianForm.tsx
   ```

2. **Guardian API 모듈** (2시간)
   - `createGuardian`, `assignGuardian` 구현
   - **주의**: 서버가 "생성+할당" 한 번에 제공하는지 확인
   - `getMyGuardian`, `removeGuardian` 구현

3. **GuardianForm 컴포넌트** (3시간)
   - 이름, 이메일, 전화번호, 관계 입력
   - 노인 친화적: 큰 입력창, 명확한 라벨
   - Select 드롭다운 (FAMILY, FRIEND 등)

4. **API 동작 검증** ⭐
   - 보호자 등록 요청 성공
   - 서버 응답 확인

**완료 기준**:
- [ ] GuardianForm에서 등록 버튼 클릭 시 성공
- [ ] 서버에 보호자 데이터 저장 확인
- [ ] TypeScript 에러 없음

**리스크 대응**:
- API 2단계(생성→할당) vs 1단계 확인
- 전화번호 필수/선택 여부 확인

---

### Day 6: Guardian 전체 플로우 완성
**⏰ 예상 시간**: 5-7시간
**🎯 목표**: 보호자 등록 → 조회 → 해제 전체 동작

**핵심 작업**:
1. **useGuardian 훅 완성** (2시간)
   - `useMyGuardian`: 내 보호자 조회
   - `useCreateAndAssignGuardian`: 등록
   - `useRemoveGuardian`: 해제

2. **GuardianInfo 컴포넌트** (2시간)
   - 보호자 정보 카드 (이름, 관계, 이메일 등)
   - 해제 버튼 (확인 팝업 권장)

3. **GuardianSettings 컨테이너** (2시간)
   - 보호자 있으면 GuardianInfo
   - 보호자 없으면 GuardianForm
   - 페이지 생성 + 라우팅 (`/settings/guardian`)

4. **전체 플로우 테스트**
   - 등록 → 대시보드에서 확인 → 해제 → 재등록

**완료 기준**:
- [ ] 보호자 등록/조회/해제 전체 플로우 동작
- [ ] 대시보드에서 보호자 설정 링크 접근 가능
- [ ] `npm run build` 성공

---

### Day 7: Week 1 통합 + 예비일
**⏰ 예상 시간**: 4-8시간 (예비 시간 포함)
**🎯 목표**: Week 1 전체 안정화 + 문제 해결

**핵심 작업**:
1. **통합 테스트** (2시간)
   - AI 대화 기능 재테스트
   - 보호자 관리 기능 재테스트
   - 라우팅 전체 확인

2. **코드 품질 검사** (1시간)
   ```bash
   npm run build  # TypeScript 검사
   npm run lint   # ESLint 검사
   ```

3. **예비 작업** (나머지 시간)
   - Day 1-6 중 미완성 작업 완료
   - 발견된 버그 수정
   - UI/UX 개선
   - 또는 **휴식** (예비일의 목적)

4. **Week 2 준비**
   - Alert API, Member API 문서 재확인
   - 필요한 컴포넌트 목록 정리

**완료 기준**:
- [ ] AI 대화 + 보호자 관리 모두 안정적 동작
- [ ] TypeScript 빌드 0 에러
- [ ] ESLint 0 경고 (또는 허용 가능한 수준)
- [ ] Week 2 시작 준비 완료

---

## 📋 Week 2 상세 계획

### Day 8: Alert API 연동 + 이력 리스트
**⏰ 예상 시간**: 5-7시간
**🎯 목표**: 알림 이력 조회 성공

**핵심 작업**:
1. **폴더 구조 + 타입** (1시간)
   ```
   src/features/alert/
   ├── api/alertApi.ts
   ├── types/alert.types.ts
   ├── hooks/useAlert.ts
   └── components/AlertHistoryList.tsx
   ```

2. **Alert API 모듈** (2시간)
   - `getAlertHistory(days: number)` 구현
   - 기간 파라미터 (7일/30일/90일)

3. **AlertHistoryList 기본 구현** (2-3시간)
   - 알림 목록 간단히 표시 (스타일은 나중에)
   - LoadingSpinner 사용
   - 빈 상태 처리

4. **API 동작 검증**
   - 실제 알림 이력 조회 성공

**완료 기준**:
- [ ] 알림 이력 API 호출 성공
- [ ] 리스트 UI에 데이터 표시
- [ ] `npm run build` 성공

---

### Day 9: Alert 필터링 + 레벨 배지
**⏰ 예상 시간**: 4-6시간
**🎯 목표**: 기간 필터 동작 + 알림 레벨 색상 구분

**핵심 작업**:
1. **AlertLevelBadge 컴포넌트** (1시간)
   - EMERGENCY: 빨강, HIGH: 주황, MEDIUM: 노랑, LOW: 파랑
   - 명확한 색상 대비

2. **AlertHistoryCard 컴포넌트** (2시간)
   - 알림 레벨 배지
   - 알림 메시지 표시
   - 발송 여부 표시

3. **기간 필터 버튼** (1-2시간)
   - 7일/30일/90일 버튼
   - 클릭 시 재조회

4. **페이지 생성 + 라우팅**
   - `/alerts` 경로 추가
   - 대시보드에서 링크

**완료 기준**:
- [ ] 기간 필터 동작
- [ ] 알림 레벨별 색상 구분 명확
- [ ] 대시보드에서 접근 가능

---

### Day 10: Member API 연동 + 프로필 조회
**⏰ 예상 시간**: 4-6시간
**🎯 목표**: 내 정보 조회 성공

**핵심 작업**:
1. **폴더 구조 + 타입** (1시간)
   ```
   src/features/member/
   ├── api/memberApi.ts
   ├── types/member.types.ts
   ├── hooks/useMember.ts
   └── components/ProfileView.tsx
   ```

2. **Member API 모듈** (2시간)
   - `getMe()`: 내 정보 조회
   - `updateMe(data)`: 정보 수정
   - `deleteAccount()`: 계정 삭제

3. **ProfileView 컴포넌트** (2시간)
   - 이름, 이메일, 가입일 표시
   - Card 컴포넌트 활용

4. **API 동작 검증**
   - 내 정보 조회 성공

**완료 기준**:
- [ ] 프로필 조회 API 성공
- [ ] ProfileView에 데이터 표시
- [ ] `npm run build` 성공

---

### Day 11: Member 정보 수정 기능
**⏰ 예상 시간**: 4-6시간
**🎯 목표**: 이름/비밀번호 수정 동작

**핵심 작업**:
1. **ProfileEditForm 컴포넌트** (3시간)
   - 이름 수정
   - 비밀번호 변경 (선택)
   - 기존 Input, Button 활용

2. **useMember 훅 완성** (1시간)
   - `useMe`: 조회
   - `useUpdateMe`: 수정
   - TanStack Query 캐시 무효화

3. **AccountSettings 컨테이너** (1시간)
   - ProfileView + ProfileEditForm
   - 페이지 생성 + 라우팅 (`/settings/account`)

4. **전체 플로우 테스트**
   - 조회 → 수정 → 저장 → 확인

**완료 기준**:
- [ ] 이름 수정 성공
- [ ] 비밀번호 변경 성공 (테스트 어려우면 Skip 가능)
- [ ] 대시보드에서 접근 가능

---

### Day 12: 대시보드 통합 + 네비게이션
**⏰ 예상 시간**: 5-7시간
**🎯 목표**: 모든 페이지 대시보드에서 접근 가능

**핵심 작업**:
1. **대시보드 개선** (3-4시간)
   - 주요 기능 버튼 카드
   - 보호자 정보 요약 카드
   - 설정 메뉴
   - 로그아웃 버튼

2. **네비게이션 일관성** (2시간)
   - 모든 페이지 뒤로가기 버튼
   - 페이지 제목 일관성
   - 접근 플로우 확인

3. **라우팅 최종 확인** (1시간)
   - 모든 경로 정상 동작
   - 404 페이지 처리
   - 보호된 라우트 확인

**완료 기준**:
- [ ] 대시보드에서 모든 기능 접근 가능
- [ ] 네비게이션 UX 일관성
- [ ] 라우팅 정상 동작

---

### Day 13: 에러 처리 + 로딩 상태 개선
**⏰ 예상 시간**: 4-6시간
**🎯 목표**: 안정적인 에러 처리

**핵심 작업**:
1. **에러 처리 통합** (2-3시간)
   - 공통 에러 핸들러 (shared/utils/)
   - 네트워크 에러 → 재시도 가능
   - 401 에러 → 자동 토큰 갱신 확인
   - 403/404/500 에러 → 사용자 친화적 메시지

2. **로딩 상태 개선** (1-2시간)
   - 일관된 LoadingSpinner 사용
   - 버튼 로딩 상태 (isPending)
   - Skeleton UI (선택 사항)

3. **전체 에러 시나리오 테스트** (1시간)
   - 네트워크 끊기 테스트
   - 서버 에러 시뮬레이션
   - 토큰 만료 테스트

**완료 기준**:
- [ ] 네트워크 에러 시 사용자 피드백
- [ ] 모든 버튼 로딩 상태 표시
- [ ] 에러 발생해도 앱 크래시 안 함

---

### Day 14: 최종 테스트 + 문서화
**⏰ 예상 시간**: 6-8시간
**🎯 목표**: Phase 3 완료 및 검증

**핵심 작업**:
1. **전체 플로우 통합 테스트** (3-4시간)
   - [ ] 회원가입 → 로그인
   - [ ] AI 대화 (여러 메시지)
   - [ ] 보호자 등록 → 조회 → 해제
   - [ ] 알림 이력 조회 (필터링)
   - [ ] 회원 정보 수정
   - [ ] 로그아웃 → 재로그인
   - [ ] 토큰 자동 갱신 확인

2. **코드 품질 최종 검사** (1-2시간)
   ```bash
   npm run build
   npm run lint
   npm run preview  # 번들 크기 확인
   ```

3. **문서 업데이트** (1-2시간)
   - [CURRENT_STATUS.md](./CURRENT_STATUS.md) 업데이트
   - Phase 3 완료 내용 기록
   - 실제 구현과 계획의 차이점 기록
   - Phase 4 준비사항 정리

4. **성능 체크** (선택 사항)
   - 번들 크기 확인 (목표: 500KB 이하)
   - React.memo 필요 여부 판단
   - 불필요한 리렌더링 확인

**완료 기준**:
- [ ] 전체 플로우 테스트 통과
- [ ] TypeScript 빌드 0 에러
- [ ] ESLint 경고 허용 범위
- [ ] 문서 업데이트 완료
- [ ] **Phase 3 완료 선언 가능**

---

## ✅ Phase 3 완료 체크리스트

### 기능 완성도
- [ ] **AI 대화**: 메시지 전송 → AI 응답 → 감정 표시
- [ ] **보호자 관리**: 등록 → 조회 → 해제
- [ ] **알림 이력**: 조회 → 필터링 → 레벨별 색상
- [ ] **회원 정보**: 조회 → 수정

### API 연동
- [ ] `POST /api/conversations/messages` 성공
- [ ] `GET /api/guardians/my-guardian` 성공
- [ ] `POST /api/guardians` + `POST /api/guardians/{id}/assign` 성공
- [ ] `DELETE /api/guardians/remove-guardian` 성공
- [ ] `GET /api/alert-rules/history` 성공
- [ ] `GET /api/users/me` 성공
- [ ] `PUT /api/users/me` 성공

### UI/UX
- [ ] 모든 페이지 노인 친화적 (60px+ 터치, 18px+ 폰트)
- [ ] 감정 아이콘 명확 (😊😢😐)
- [ ] 알림 레벨 색상 구분 명확
- [ ] 로딩 상태 표시 (모든 비동기 작업)
- [ ] 에러 메시지 사용자 친화적

### 코드 품질
- [ ] TypeScript 타입 완전 정의 (any 사용 최소화)
- [ ] `npm run build` 에러 0개
- [ ] `npm run lint` 경고 허용 범위
- [ ] TanStack Query 패턴 일관성
- [ ] 컴포넌트 재사용성 확보

### 테스트
- [ ] 로그인 → 모든 기능 → 로그아웃 플로우 통과
- [ ] 네트워크 에러 시나리오 처리 확인
- [ ] 토큰 자동 갱신 동작 확인
- [ ] 모바일 반응형 기본 동작 (큰 문제 없음)

---

## 🚨 리스크 관리

### 예상 리스크 및 대응책

| 리스크 | 확률 | 영향 | 대응책 |
|--------|------|------|--------|
| 서버 API 문서와 실제 구현 불일치 | 중 | 고 | Day 1부터 실제 API 테스트, 발견 즉시 문서화 |
| Guardian API 생성/할당 2단계 혼란 | 중 | 중 | 서버 개발자와 소통, 1단계 API 요청 고려 |
| 낙관적 업데이트 복잡도 과소평가 | 중 | 중 | 기본 기능 우선, 최적화는 나중에 |
| Day 7까지 AI 대화 미완성 | 저 | 고 | Day 7 예비일 활용, Week 2 일정 조정 |
| 에러 처리 미흡으로 UX 나쁨 | 중 | 중 | Day 13 집중, Toast 없으면 alert() 사용 |
| 전체 일정 초과 (14일 넘김) | 중 | 중 | 우선순위 재조정, Phase 4로 연기 가능 |
| 노인 친화적 UI 미흡 | 저 | 고 | 매 Day 체크리스트 확인, 타협 불가 |

### 일정 초과 시 우선순위

**필수 (Phase 3 완료 기준)**:
1. AI 대화 기능 (Day 1-4)
2. 보호자 관리 (Day 5-6)

**중요 (가능하면 포함)**:
3. 알림 이력 (Day 8-9)
4. 회원 정보 (Day 10-11)

**선택 (Phase 4 연기 가능)**:
- 낙관적 업데이트
- Skeleton UI
- 애니메이션 효과
- 고급 에러 처리

---

## 📚 참고 문서

### 필수 참고 (개발 중 상시 확인)
- **[API_REFERENCE.md](../api/API_REFERENCE.md)** - 모든 API 엔드포인트
- **[Conversation API](../api/conversation-api.md)** - AI 대화 API 상세
- **[Guardian API](../api/guardian-api.md)** - 보호자 API 상세
- **[AlertRule API](../api/alertrule-api.md)** - 알림 API 상세
- **[Member API](../api/member-api.md)** - 회원 API 상세

### 구현 가이드 (막힐 때 참고)
- **[IMPLEMENTATION_FLOWS.md](../flows/IMPLEMENTATION_FLOWS.md)** - 기능별 구현 플로우
- **[COMPONENT_DESIGN_GUIDE.md](../development/COMPONENT_DESIGN_GUIDE.md)** - 컴포넌트 설계

### 아키텍처 (이해 필요 시)
- **[TECHNICAL_ARCHITECTURE.md](../architecture/TECHNICAL_ARCHITECTURE.md)** - 시스템 아키텍처
- **[DESIGN_SYSTEM.md](../architecture/DESIGN_SYSTEM.md)** - 디자인 시스템

---

## 🎯 다음 단계: Phase 4

Phase 3 완료 후 진행할 Phase 4 핵심 작업:

1. **PWA 완성**
   - 오프라인 지원 (Service Worker)
   - 푸시 알림 (Firebase FCM)
   - 홈 화면 추가

2. **성능 최적화**
   - 코드 스플리팅
   - React.memo 적용
   - 번들 크기 최적화

3. **접근성 최종 점검**
   - 스크린 리더 테스트
   - 키보드 네비게이션
   - WCAG 2.1 AA 준수

4. **배포 준비**
   - 환경별 설정
   - 빌드 최적화
   - 모니터링 설정

---

## 부록: 코드 템플릿 (참고용)

> **주의**: 이 코드는 참고용입니다. 강제로 복붙하지 말고, 실제 상황에 맞게 수정하세요.

### A. Conversation API 모듈 예시

```typescript
// features/conversation/api/conversationApi.ts
import { apiClient } from '@/shared/api/client';
import type { ConversationResponse, SendMessageRequest } from '../types';

export const conversationApi = {
  sendMessage: async (data: SendMessageRequest): Promise<ConversationResponse> => {
    const response = await apiClient.post('/conversations/messages', data);
    return response.data.data;
  },
};
```

### B. useSendMessage 기본 예시

```typescript
// features/conversation/hooks/useConversation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationApi } from '../api/conversationApi';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: conversationApi.sendMessage,
    onSuccess: (data) => {
      // 메시지 추가 (간단한 방식)
      queryClient.setQueryData(['conversation'], (old: any[] = []) => [
        ...old,
        data.userMessage,
        data.aiMessage,
      ]);
    },
  });
};
```

### C. MessageBubble 컴포넌트 예시

```typescript
// features/conversation/components/MessageBubble.tsx
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isAI?: boolean;
}

export function MessageBubble({ message, isAI = false }: MessageBubbleProps) {
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-6 py-4 text-lg
          ${isAI ? 'bg-blue-50 text-gray-900' : 'bg-blue-600 text-white'}
        `}
      >
        <p className="leading-relaxed">{message.content}</p>
        <div className="mt-2 text-sm opacity-70">
          {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
```

### D. Guardian API 모듈 예시

```typescript
// features/guardian/api/guardianApi.ts
import { apiClient } from '@/shared/api/client';
import type { Guardian, CreateGuardianRequest } from '../types';

export const guardianApi = {
  getMyGuardian: async (): Promise<Guardian | null> => {
    try {
      const response = await apiClient.get('/guardians/my-guardian');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // 보호자 없음
      }
      throw error;
    }
  },

  createGuardian: async (data: CreateGuardianRequest): Promise<Guardian> => {
    const response = await apiClient.post('/guardians', data);
    return response.data.data;
  },

  assignGuardian: async (guardianId: number): Promise<void> => {
    await apiClient.post(`/guardians/${guardianId}/assign`);
  },

  removeGuardian: async (): Promise<void> => {
    await apiClient.delete('/guardians/remove-guardian');
  },
};
```

### E. 에러 처리 유틸 예시

```typescript
// shared/utils/errorHandler.ts
import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data;

    // 필드 에러
    if (apiError?.data?.fieldErrors) {
      return apiError.data.fieldErrors
        .map((fe: any) => fe.message)
        .join(', ');
    }

    // 일반 에러 메시지
    return apiError?.message || '알 수 없는 오류가 발생했습니다.';
  }

  return '네트워크 오류가 발생했습니다.';
};
```

---

**🎉 Phase 3을 성공적으로 완료하면 MARUNI의 모든 핵심 기능이 완성됩니다!**

**📅 마지막 업데이트**: 2025-10-05
**📝 버전**: 2.0 (Agile 방식으로 재구성)
**✍️ 작성**: Claude (AI Assistant) + 객관적 리뷰 반영
