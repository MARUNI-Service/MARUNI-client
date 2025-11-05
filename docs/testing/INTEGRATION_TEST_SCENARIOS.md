# MARUNI 통합 테스트 시나리오

**작성일**: 2025-11-02
**버전**: 1.0.0
**목적**: Phase 3-8 API 연결 완료 후 실제 서버 연동 테스트

---

## 📋 목차

1. [테스트 환경 설정](#테스트-환경-설정)
2. [시나리오 1: 신규 사용자 회원가입 및 온보딩](#시나리오-1-신규-사용자-회원가입-및-온보딩)
3. [시나리오 2: 노인 사용자 - AI 대화](#시나리오-2-노인-사용자---ai-대화)
4. [시나리오 3: 보호자 관계 성립](#시나리오-3-보호자-관계-성립)
5. [시나리오 4: 보호자 - 알림 규칙 설정](#시나리오-4-보호자---알림-규칙-설정)
6. [시나리오 5: 설정 관리](#시나리오-5-설정-관리)
7. [시나리오 6: 에러 처리](#시나리오-6-에러-처리)
8. [체크리스트](#체크리스트)

---

## 테스트 환경 설정

### 사전 준비

1. **서버 실행 확인**
   ```bash
   # 서버가 http://localhost:8080 에서 실행 중인지 확인
   curl http://localhost:8080/api/health
   ```

2. **클라이언트 환경 변수 설정**
   ```bash
   # .env.local 파일 생성
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **클라이언트 실행**
   ```bash
   npm run dev
   # http://localhost:5173 에서 실행 확인
   ```

4. **브라우저 개발자 도구 열기**
   - Network 탭: API 호출 모니터링
   - Console 탭: 에러 확인
   - Application 탭: localStorage 확인

### 테스트 데이터 준비

**필요한 사용자**:
1. 노인 사용자 (순자)
2. 보호자 사용자 (영희)
3. 신규 사용자

---

## 시나리오 1: 신규 사용자 회원가입 및 온보딩

### 목표
새로운 사용자가 회원가입하고 대시보드에 진입하는 전체 플로우 검증

### 테스트 단계

#### 1.1 회원가입 페이지 접근
**액션**:
- 브라우저에서 `http://localhost:5173` 접속
- "회원가입" 링크 클릭

**기대 결과**:
- ✅ `/register` 페이지로 이동
- ✅ 회원가입 폼 표시 (이메일, 이름, 비밀번호, 전화번호)

**확인 사항**:
- [ ] URL이 `/register`로 변경되었는가?
- [ ] 모든 입력 필드가 표시되는가?
- [ ] 버튼 터치 영역이 충분한가? (60px+)

---

#### 1.2 이메일 중복 확인
**액션**:
- 이메일 입력: `newuser@test.com`
- 이메일 입력 필드에서 포커스 아웃

**API 호출 확인** (Network 탭):
```http
GET /api/join/email-check?email=newuser@test.com
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ `{ "isSuccess": true, "data": false }` (사용 가능)
- ✅ 또는 `{ "isSuccess": true, "data": true }` (이미 존재) → 에러 메시지 표시

**확인 사항**:
- [ ] API 호출이 정상적으로 이루어지는가?
- [ ] 이메일 중복 시 에러 메시지가 표시되는가?
- [ ] 사용 가능한 이메일 시 다음 단계 진행 가능한가?

---

#### 1.3 회원가입 제출
**액션**:
- 이메일: `newuser@test.com`
- 이름: `테스트유저`
- 비밀번호: `test1234!`
- 비밀번호 확인: `test1234!`
- 전화번호: `010-1234-5678`
- "가입하기" 버튼 클릭

**API 호출 확인** (Network 탭):
```http
POST /api/join
Content-Type: application/json

{
  "memberEmail": "newuser@test.com",
  "memberName": "테스트유저",
  "memberPassword": "test1234!",
  "memberPhoneNumber": "010-1234-5678"
}
```

**기대 결과**:
- ✅ 201 Created 응답
- ✅ `{ "isSuccess": true, "message": "회원가입 성공" }`
- ✅ 자동으로 로그인 처리
- ✅ 대시보드로 리다이렉트 (`/dashboard`)

**확인 사항**:
- [ ] API 호출이 성공하는가?
- [ ] 자동 로그인이 되는가?
- [ ] localStorage에 `access_token`이 저장되는가?
- [ ] 대시보드로 이동하는가?

---

#### 1.4 대시보드 초기 화면 확인
**액션**:
- 대시보드 화면 확인

**기대 결과**:
- ✅ "시작 가이드" 섹션 표시 (신규 사용자)
- ✅ 3개 안내 카드:
  1. "AI와 대화하기" → `/conversation`
  2. "보호자 등록하기" → `/guardians/search`
  3. "설정하기" → `/settings`
- ✅ NavigationBar 표시 (홈, 대화, 알림, 설정)

**확인 사항**:
- [ ] "시작 가이드" 섹션이 표시되는가?
- [ ] 안내 카드가 3개 표시되는가?
- [ ] NavigationBar가 표시되는가?
- [ ] 각 카드 클릭 시 해당 페이지로 이동하는가?

---

## 시나리오 2: 노인 사용자 - AI 대화

### 목표
노인 사용자가 AI와 대화하는 전체 플로우 검증

### 사전 준비
- 노인 계정 로그인: `soonja@test.com` / `password123`

### 테스트 단계

#### 2.1 로그인
**액션**:
- 로그아웃 (이미 로그인되어 있다면)
- 로그인 페이지 이동 (`/login`)
- 이메일: `soonja@test.com`
- 비밀번호: `password123`
- "로그인" 버튼 클릭

**API 호출 확인** (Network 탭):
```http
POST /api/auth/login
Content-Type: application/json

{
  "memberEmail": "soonja@test.com",
  "memberPassword": "password123"
}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ Response Headers에 `Authorization: Bearer {token}`
- ✅ localStorage에 `access_token` 저장
- ✅ 자동으로 `/api/members/me` 호출하여 사용자 정보 조회
- ✅ 대시보드로 리다이렉트

**확인 사항**:
- [ ] 로그인 API 호출이 성공하는가?
- [ ] 토큰이 localStorage에 저장되는가?
- [ ] 사용자 정보 조회 API가 자동으로 호출되는가?
- [ ] 대시보드로 이동하는가?

---

#### 2.2 대화 페이지 이동
**액션**:
- 대시보드에서 "내 안부 메시지" 카드 클릭
- 또는 NavigationBar의 "대화" 탭 클릭

**기대 결과**:
- ✅ `/conversation` 페이지로 이동
- ✅ 대화 내역 자동 로드

**API 호출 확인**:
```http
GET /api/conversations/history?days=7
Authorization: Bearer {token}
```

**확인 사항**:
- [ ] 대화 페이지로 이동하는가?
- [ ] 대화 내역 조회 API가 호출되는가?
- [ ] 이전 대화 내역이 표시되는가? (있는 경우)

---

#### 2.3 메시지 전송
**액션**:
- 메시지 입력창에 "오늘 날씨가 좋네요" 입력
- Enter 키 또는 "전송" 버튼 클릭

**API 호출 확인**:
```http
POST /api/conversations/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "오늘 날씨가 좋네요"
}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ Response Body:
```json
{
  "isSuccess": true,
  "data": {
    "conversationId": 123,
    "userMessage": {
      "id": 456,
      "type": "USER_MESSAGE",
      "content": "오늘 날씨가 좋네요",
      "emotion": null,
      "createdAt": "2025-11-02T10:00:00Z"
    },
    "aiMessage": {
      "id": 457,
      "type": "AI_RESPONSE",
      "content": "네, 정말 좋은 날씨네요! 오늘 산책 나가셨나요?",
      "emotion": "POSITIVE",
      "createdAt": "2025-11-02T10:00:01Z"
    }
  }
}
```
- ✅ 화면에 사용자 메시지 + AI 응답 표시
- ✅ AI 응답에 감정 이모지 표시 (😊)
- ✅ 자동 스크롤 (최하단으로)

**확인 사항**:
- [ ] 메시지 전송 API가 호출되는가?
- [ ] 사용자 메시지가 화면에 표시되는가?
- [ ] AI 응답이 화면에 표시되는가?
- [ ] 감정 이모지가 표시되는가?
- [ ] 자동 스크롤이 작동하는가?

---

#### 2.4 부정적인 메시지 전송
**액션**:
- "요즘 너무 외롭고 힘들어요" 입력 및 전송

**기대 결과**:
- ✅ AI 응답에 `emotion: "NEGATIVE"` 포함
- ✅ 부정적 감정 이모지 표시 (😢)

**확인 사항**:
- [ ] 부정적 감정이 감지되는가?
- [ ] 감정 이모지가 올바르게 표시되는가?
- [ ] (서버에서) 이상 징후 감지 로직이 작동하는가? (3일 연속 부정적 메시지 등)

---

#### 2.5 500자 제한 테스트
**액션**:
- 500자 이상의 긴 메시지 입력 시도

**기대 결과**:
- ✅ 클라이언트에서 에러 메시지 표시
- ✅ "메시지는 500자를 초과할 수 없습니다" Toast 표시
- ✅ API 호출 차단

**확인 사항**:
- [ ] 500자 제한이 작동하는가?
- [ ] 에러 메시지가 표시되는가?
- [ ] API 호출이 차단되는가?

---

## 시나리오 3: 보호자 관계 성립

### 목표
노인 사용자가 보호자를 검색하고 요청을 보내며, 보호자가 수락하는 전체 플로우 검증

### 테스트 단계

#### 3.1 보호자 검색 (노인 계정)
**사전 준비**:
- 노인 계정 로그인: `soonja@test.com`

**액션**:
- 대시보드에서 "보호자 등록하기" 클릭
- 또는 NavigationBar → 설정 → 보호자 관리 → "보호자 찾기" 클릭
- 검색 입력창에 `younghee@test.com` 입력
- "검색" 버튼 클릭

**API 호출 확인**:
```http
GET /api/members/search?keyword=younghee@test.com
Authorization: Bearer {token}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ Response Body:
```json
{
  "isSuccess": true,
  "data": {
    "id": 2,
    "memberName": "김영희",
    "memberEmail": "younghee@test.com"
  }
}
```
- ✅ 검색 결과 카드 표시
- ✅ "선택" 버튼 활성화

**확인 사항**:
- [ ] 검색 API가 호출되는가?
- [ ] 검색 결과가 표시되는가?
- [ ] 사용자 정보가 올바르게 표시되는가?

---

#### 3.2 보호자 등록 요청 (노인 계정)
**액션**:
- 검색 결과에서 "선택" 버튼 클릭
- 확인 다이얼로그에서 "등록하기" 버튼 클릭

**API 호출 확인**:
```http
POST /api/guardians/requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "guardianId": 2,
  "relation": "FAMILY"
}
```

**기대 결과**:
- ✅ 201 Created 응답
- ✅ Response Body:
```json
{
  "isSuccess": true,
  "data": {
    "id": 100,
    "requester": {
      "id": 1,
      "name": "김순자",
      "email": "soonja@test.com"
    },
    "guardian": {
      "id": 2,
      "name": "김영희",
      "email": "younghee@test.com"
    },
    "relation": "FAMILY",
    "status": "PENDING",
    "createdAt": "2025-11-02T10:05:00Z"
  }
}
```
- ✅ "보호자 등록 요청을 보냈습니다!" Toast 표시
- ✅ 보호자 관리 페이지로 리다이렉트

**확인 사항**:
- [ ] 요청 생성 API가 호출되는가?
- [ ] 성공 Toast가 표시되는가?
- [ ] 페이지가 리다이렉트되는가?

---

#### 3.3 보호자 요청 목록 확인 (보호자 계정)
**사전 준비**:
- 로그아웃
- 보호자 계정 로그인: `younghee@test.com` / `password123`

**액션**:
- 대시보드 확인
- 또는 NavigationBar → 알림 탭 확인
- "보호자 요청" 페이지 이동 (`/guardians/requests`)

**API 호출 확인**:
```http
GET /api/guardians/requests
Authorization: Bearer {token}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ Response Body: 요청 목록 (PENDING 상태만)
```json
{
  "isSuccess": true,
  "data": [
    {
      "id": 100,
      "requester": {
        "id": 1,
        "name": "김순자",
        "email": "soonja@test.com"
      },
      "guardian": {
        "id": 2,
        "name": "김영희",
        "email": "younghee@test.com"
      },
      "relation": "FAMILY",
      "status": "PENDING",
      "createdAt": "2025-11-02T10:05:00Z"
    }
  ]
}
```
- ✅ 요청 목록 카드 표시
- ✅ "수락" / "거절" 버튼 표시

**확인 사항**:
- [ ] 요청 목록 조회 API가 호출되는가?
- [ ] 요청 카드가 표시되는가?
- [ ] 요청자 정보가 올바르게 표시되는가?
- [ ] 수락/거절 버튼이 표시되는가?

---

#### 3.4 보호자 요청 수락 (보호자 계정)
**액션**:
- 요청 카드에서 "수락" 버튼 클릭

**API 호출 확인**:
```http
POST /api/guardians/requests/100/accept
Authorization: Bearer {token}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ "보호자 요청을 수락했습니다!" Toast 표시
- ✅ 요청 목록에서 해당 요청 제거
- ✅ 사용자 정보 갱신 (AuthStore)
- ✅ 대시보드에 "내가 돌보는 사람들" 섹션 표시

**확인 사항**:
- [ ] 수락 API가 호출되는가?
- [ ] 성공 Toast가 표시되는가?
- [ ] 요청이 목록에서 사라지는가?
- [ ] 대시보드에 새 섹션이 추가되는가?
- [ ] "내가 돌보는 사람들" 섹션에 김순자가 표시되는가?

---

#### 3.5 관계 성립 확인 (노인 계정)
**사전 준비**:
- 로그아웃
- 노인 계정 다시 로그인: `soonja@test.com`

**액션**:
- 대시보드 확인

**기대 결과**:
- ✅ "내 보호자" 섹션 표시
- ✅ 보호자 정보 표시 (김영희)
- ✅ "시작 가이드" 섹션 제거

**확인 사항**:
- [ ] "내 보호자" 섹션이 표시되는가?
- [ ] 보호자 정보가 올바르게 표시되는가?
- [ ] "시작 가이드"가 사라졌는가?

---

## 시나리오 4: 보호자 - 알림 규칙 설정

### 목표
보호자가 알림 규칙을 생성하고 관리하는 플로우 검증

### 테스트 단계

#### 4.1 알림 규칙 생성
**사전 준비**:
- 보호자 계정 로그인: `younghee@test.com`

**액션**:
- 설정 → 알림 규칙 관리 페이지 이동 (임시 페이지 생성 필요)
- "새 규칙 추가" 버튼 클릭
- 알림 유형 선택: "EMOTION_PATTERN" (감정 패턴 분석)
- 알림 레벨 선택: "HIGH"
- 조건 설정: 연속 3일 부정적 감정
- "저장" 버튼 클릭

**API 호출 확인**:
```http
POST /api/alert-rules
Authorization: Bearer {token}
Content-Type: application/json

{
  "alertType": "EMOTION_PATTERN",
  "alertLevel": "HIGH",
  "condition": {
    "consecutiveDays": 3,
    "thresholdCount": null,
    "keywords": null
  }
}
```

**기대 결과**:
- ✅ 201 Created 응답
- ✅ Response Body:
```json
{
  "isSuccess": true,
  "data": {
    "id": 1,
    "memberId": 2,
    "alertType": "EMOTION_PATTERN",
    "alertLevel": "HIGH",
    "ruleName": "감정 패턴 분석",
    "condition": {
      "consecutiveDays": 3
    },
    "description": "연속 3일 부정적 감정",
    "active": true,
    "createdAt": "2025-11-02T10:10:00Z",
    "updatedAt": "2025-11-02T10:10:00Z"
  }
}
```
- ✅ "알림 규칙이 생성되었습니다" Toast 표시
- ✅ 규칙 목록에 새 규칙 추가

**확인 사항**:
- [ ] 규칙 생성 API가 호출되는가?
- [ ] 성공 Toast가 표시되는가?
- [ ] 규칙이 목록에 추가되는가?

---

#### 4.2 알림 규칙 목록 조회
**액션**:
- 알림 규칙 관리 페이지 새로고침

**API 호출 확인**:
```http
GET /api/alert-rules
Authorization: Bearer {token}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ 생성한 규칙 목록 표시
- ✅ 활성화/비활성화 토글 버튼 표시

**확인 사항**:
- [ ] 규칙 목록 조회 API가 호출되는가?
- [ ] 모든 규칙이 표시되는가?
- [ ] 각 규칙의 상세 정보가 표시되는가?

---

#### 4.3 알림 규칙 비활성화
**액션**:
- 규칙 카드에서 활성화 토글 클릭 (ON → OFF)

**API 호출 확인**:
```http
POST /api/alert-rules/1/toggle?active=false
Authorization: Bearer {token}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ "알림 규칙이 비활성화되었습니다" Toast 표시
- ✅ 토글 버튼 상태 변경
- ✅ 규칙 카드 스타일 변경 (회색 처리)

**확인 사항**:
- [ ] 토글 API가 호출되는가?
- [ ] Toast가 표시되는가?
- [ ] UI가 업데이트되는가?

---

#### 4.4 알림 이력 조회
**액션**:
- "알림 이력" 탭 클릭

**API 호출 확인**:
```http
GET /api/alert-rules/history?days=30
Authorization: Bearer {token}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ 최근 30일 알림 이력 표시
- ✅ 각 이력: 감지 날짜, 알림 메시지, 레벨, 발송 여부

**확인 사항**:
- [ ] 이력 조회 API가 호출되는가?
- [ ] 이력 목록이 표시되는가?
- [ ] 상세 정보가 올바르게 표시되는가?

---

## 시나리오 5: 설정 관리

### 목표
사용자가 프로필 수정, 안부 메시지 설정, 비밀번호 변경을 수행하는 플로우 검증

### 테스트 단계

#### 5.1 내 정보 수정
**사전 준비**:
- 노인 계정 로그인: `soonja@test.com`

**액션**:
- NavigationBar → 설정 탭 클릭
- "내 정보 수정" 메뉴 클릭
- 이름 변경: "김순자" → "김순자님"
- 전화번호 변경: "010-1111-1111" → "010-2222-2222"
- "저장" 버튼 클릭

**API 호출 확인**:
```http
PATCH /api/members/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "memberName": "김순자님",
  "memberPhoneNumber": "010-2222-2222"
}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ Response Body: 업데이트된 사용자 정보
- ✅ "프로필이 수정되었습니다" Toast 표시
- ✅ AuthStore 즉시 업데이트
- ✅ 대시보드 헤더에 새 이름 반영

**확인 사항**:
- [ ] 프로필 수정 API가 호출되는가?
- [ ] 성공 Toast가 표시되는가?
- [ ] AuthStore가 업데이트되는가?
- [ ] UI가 즉시 반영되는가?

---

#### 5.2 안부 메시지 설정 변경
**액션**:
- 설정 → "알림 설정" 메뉴 클릭
- "안부 메시지 받기" 토글 클릭 (ON → OFF 또는 OFF → ON)

**API 호출 확인**:
```http
PATCH /api/members/me/daily-check?enabled=false
Authorization: Bearer {token}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ "설정이 변경되었습니다" Toast 표시
- ✅ AuthStore의 `dailyCheckEnabled` 업데이트
- ✅ 대시보드에서 "내 안부 메시지" 섹션 토글
  - ON → OFF: 섹션 제거
  - OFF → ON: 섹션 추가

**확인 사항**:
- [ ] 설정 변경 API가 호출되는가?
- [ ] 성공 Toast가 표시되는가?
- [ ] AuthStore가 업데이트되는가?
- [ ] 대시보드 섹션이 동적으로 변경되는가?

---

#### 5.3 비밀번호 변경
**액션**:
- 설정 → "비밀번호 변경" 메뉴 클릭
- 현재 비밀번호: `password123`
- 새 비밀번호: `newPassword456!`
- 새 비밀번호 확인: `newPassword456!`
- "변경" 버튼 클릭

**API 호출 확인**:
```http
PATCH /api/members/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "memberPassword": "newPassword456!"
}
```

**기대 결과**:
- ✅ 200 OK 응답
- ✅ "비밀번호가 변경되었습니다" Toast 표시
- ✅ 입력 필드 초기화

**확인 사항**:
- [ ] 비밀번호 변경 API가 호출되는가?
- [ ] 성공 Toast가 표시되는가?
- [ ] 새 비밀번호로 로그인 가능한가? (재로그인 테스트)

---

## 시나리오 6: 에러 처리

### 목표
다양한 에러 상황에서 적절한 에러 처리 및 사용자 피드백 검증

### 테스트 단계

#### 6.1 로그인 실패 (잘못된 비밀번호)
**액션**:
- 로그아웃
- 이메일: `soonja@test.com`
- 비밀번호: `wrongpassword`
- "로그인" 버튼 클릭

**API 호출 확인**:
```http
POST /api/auth/login
```

**기대 결과**:
- ✅ 401 Unauthorized 응답
- ✅ Response Body:
```json
{
  "isSuccess": false,
  "code": "A002",
  "message": "이메일 또는 비밀번호가 일치하지 않습니다"
}
```
- ✅ "이메일 또는 비밀번호가 일치하지 않습니다" Toast 표시
- ✅ 로그인 페이지에 머물기

**확인 사항**:
- [ ] 에러 응답을 받는가?
- [ ] 에러 Toast가 표시되는가?
- [ ] 페이지가 유지되는가?

---

#### 6.2 이메일 중복 (회원가입)
**액션**:
- 회원가입 페이지 이동
- 이미 존재하는 이메일 입력: `soonja@test.com`
- 다른 필드 입력 후 "가입하기" 클릭

**기대 결과**:
- ✅ 이메일 중복 확인 API: `data: true`
- ✅ "이미 사용 중인 이메일입니다" 에러 메시지
- ✅ 회원가입 차단

**확인 사항**:
- [ ] 이메일 중복이 감지되는가?
- [ ] 에러 메시지가 표시되는가?
- [ ] 회원가입이 차단되는가?

---

#### 6.3 401 Unauthorized (토큰 만료)
**시뮬레이션**:
- localStorage의 `access_token`을 잘못된 값으로 변경
- 임의의 API 호출 (예: 대화 내역 조회)

**기대 결과**:
- ✅ 401 Unauthorized 응답
- ✅ Axios 인터셉터에서 자동 처리:
  - localStorage 토큰 삭제
  - AuthStore 초기화
  - 로그인 페이지로 리다이렉트
- ✅ "로그인이 필요합니다" Toast 표시

**확인 사항**:
- [ ] 401 응답 시 자동 로그아웃되는가?
- [ ] 토큰이 삭제되는가?
- [ ] 로그인 페이지로 리다이렉트되는가?
- [ ] Toast가 표시되는가?

---

#### 6.4 네트워크 에러 (서버 중단)
**시뮬레이션**:
- 서버 중단 (Ctrl+C)
- 메시지 전송 시도

**기대 결과**:
- ✅ Network Error 발생
- ✅ "네트워크 연결을 확인해주세요" Toast 표시

**확인 사항**:
- [ ] 네트워크 에러가 감지되는가?
- [ ] 적절한 에러 메시지가 표시되는가?
- [ ] 앱이 크래시하지 않는가?

---

#### 6.5 500 Internal Server Error
**시뮬레이션**:
- 서버에서 의도적으로 500 에러 반환 (서버 코드 수정 필요)

**기대 결과**:
- ✅ 500 응답
- ✅ "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요" Toast 표시

**확인 사항**:
- [ ] 500 에러가 감지되는가?
- [ ] 에러 메시지가 표시되는가?
- [ ] 앱이 크래시하지 않는가?

---

## 체크리스트

### 기능 완성도

**인증**
- [ ] 로그인 성공
- [ ] 로그인 실패 (잘못된 비밀번호)
- [ ] 회원가입 성공
- [ ] 이메일 중복 확인
- [ ] 자동 로그인 (회원가입 후)
- [ ] 로그아웃
- [ ] 401 자동 로그아웃

**AI 대화**
- [ ] 대화 내역 조회 (7일)
- [ ] 메시지 전송
- [ ] AI 응답 수신
- [ ] 감정 분석 결과 표시 (POSITIVE, NEGATIVE, NEUTRAL)
- [ ] 500자 제한 검증
- [ ] 자동 스크롤

**보호자 관계**
- [ ] 보호자 검색 (이메일)
- [ ] 보호자 요청 생성
- [ ] 보호자 요청 목록 조회
- [ ] 보호자 요청 수락
- [ ] 보호자 요청 거절
- [ ] 대시보드 동적 섹션 업데이트

**알림 규칙**
- [ ] 알림 규칙 생성
- [ ] 알림 규칙 목록 조회
- [ ] 알림 규칙 수정
- [ ] 알림 규칙 삭제
- [ ] 알림 규칙 활성화/비활성화
- [ ] 알림 이력 조회

**설정 관리**
- [ ] 프로필 수정
- [ ] 안부 메시지 설정 변경
- [ ] 비밀번호 변경

### API 연결

**API 호출**
- [ ] 모든 API에 JWT 토큰 자동 추가
- [ ] CommonApiResponse<T> 래핑 처리
- [ ] 에러 응답 파싱

**상태 관리**
- [ ] TanStack Query 자동 캐싱
- [ ] AuthStore 실시간 업데이트
- [ ] Toast 피드백

### 에러 처리

- [ ] 401 Unauthorized → 자동 로그아웃
- [ ] 400 Bad Request → 에러 메시지 표시
- [ ] 404 Not Found → 적절한 fallback
- [ ] 409 Conflict → 충돌 메시지
- [ ] 500 Server Error → 재시도 안내
- [ ] Network Error → 네트워크 확인 안내

### 사용성

- [ ] 터치 영역 60px+
- [ ] 폰트 크기 20px+
- [ ] 고대비 색상
- [ ] Toast 메시지 명확성
- [ ] 로딩 상태 표시
- [ ] 에러 상태 명확한 피드백

### 성능

- [ ] API 응답 속도 (2초 이내)
- [ ] TanStack Query 캐싱 효과
- [ ] 페이지 전환 부드러움
- [ ] 번들 크기 (400kB 이하)

---

## 테스트 결과 기록

### 테스트 일시
- [ ] 날짜: ____________________
- [ ] 테스터: ____________________
- [ ] 서버 버전: ____________________
- [ ] 클라이언트 버전: 1.8.0

### 발견된 이슈

| 번호 | 시나리오 | 이슈 내용 | 심각도 | 상태 |
|------|---------|----------|--------|------|
| 1    |         |          |        |      |
| 2    |         |          |        |      |
| 3    |         |          |        |      |

**심각도**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low

---

## 다음 단계

### 테스트 통과 후
1. [ ] 프로덕션 배포 준비
2. [ ] 사용자 매뉴얼 작성
3. [ ] Phase 4 기능 개발 시작

### 테스트 실패 시
1. [ ] 이슈 목록 작성
2. [ ] 우선순위 분류
3. [ ] 버그 수정
4. [ ] 재테스트

---

**📅 작성일**: 2025-11-02
**✏️ 작성자**: Claude Code
**🔄 버전**: 1.0.0
