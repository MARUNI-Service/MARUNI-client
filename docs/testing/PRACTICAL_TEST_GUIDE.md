# MARUNI 실전 테스트 가이드

**버전**: 1.0.0
**작성일**: 2025-11-03
**대상**: Phase 3-8 완료 후 API 연결 테스트
**예상 소요 시간**: 20분

---

## 🎯 테스트 목표

- **API 연결 검증**: 클라이언트 ↔ 서버 통신 정상 작동 확인
- **핵심 플로우 검증**: 회원가입 → 로그인 → AI 대화 → 보호자 연결
- **에러 처리 검증**: 잘못된 입력 시 적절한 에러 메시지 표시

---

## 📋 사전 준비

### 1. 서버 실행 확인

```bash
# 서버가 실행 중인지 확인
curl http://localhost:8080/api/members/me
# → 401 Unauthorized 응답이 나오면 정상 (인증 필요)
```

### 2. 클라이언트 실행

```bash
cd C:/Users/rlarb/coding/maruni/maruni-client
npm run dev
```

### 3. 브라우저 개발자 도구 열기

- **F12** 또는 **Ctrl+Shift+I**
- **Console 탭** 열어두기 (API 로그 확인용)
- **Network 탭** 준비 (필요시 API 요청/응답 확인)

---

## 🧪 테스트 시나리오

### ✅ Scenario 1: 회원가입 & 로그인 (5분)

#### 1-1. 회원가입 테스트

**페이지**: `http://localhost:5173/auth/signup`

**테스트 케이스 A: 정상 회원가입**

```
이메일: test_user_001@example.com
이름: 테스트사용자001
비밀번호: test1234!
안부 메시지 수신: 체크 ✓
```

**예상 결과**:
- ✅ "회원가입 성공" 메시지
- ✅ 자동으로 로그인 페이지로 이동
- ✅ Console에 `📦 회원가입 응답:` 로그

**테스트 케이스 B: 이메일 중복**

```
이메일: test_user_001@example.com (방금 가입한 이메일)
```

**예상 결과**:
- ❌ "이미 가입된 이메일입니다" 에러 메시지 (M409)

---

#### 1-2. 로그인 테스트

**페이지**: `http://localhost:5173/auth/login`

**테스트 케이스 A: 정상 로그인**

```
이메일: test_user_001@example.com
비밀번호: test1234!
```

**예상 결과**:
- ✅ "로그인 성공" 메시지
- ✅ Dashboard로 리다이렉트
- ✅ Console에 다음 로그들:
  ```
  📦 로그인 응답: { code: "M201", message: "로그인 성공", data: {...} }
  ✅ 토큰 저장 완료
  ✅ 로그인 성공: test_user_001@example.com
  ```
- ✅ localStorage에 `access_token` 저장됨 확인
  - F12 → Application → Local Storage → `access_token`

**테스트 케이스 B: 잘못된 비밀번호**

```
이메일: test_user_001@example.com
비밀번호: wrongpassword
```

**예상 결과**:
- ❌ "이메일 또는 비밀번호가 틀렸습니다" 에러 (A401)

---

### ✅ Scenario 2: AI 대화 테스트 (5분)

**페이지**: `http://localhost:5173/dashboard` (로그인 후)

#### 2-1. AI와 대화하기

**테스트 케이스 A: 정상 메시지 전송**

```
메시지 입력: "안녕하세요! 오늘 기분이 좋아요 😊"
```

**예상 결과**:
- ✅ 내 메시지가 화면에 표시됨 (오른쪽 정렬)
- ✅ AI 응답이 화면에 표시됨 (왼쪽 정렬)
- ✅ 대화 내역에 저장됨
- ✅ Network 탭에서 `POST /api/conversations/messages` 요청 확인
  - Status: 200 OK
  - Response 구조:
    ```json
    {
      "code": "S001",
      "message": "요청이 성공적으로 처리되었습니다",
      "data": {
        "conversationId": 1,
        "userMessage": {...},
        "aiMessage": {...}
      }
    }
    ```

**테스트 케이스 B: 긴 메시지 (500자 초과)**

```
메시지: "안녕" × 251번 (501자)
```

**예상 결과**:
- ❌ "메시지는 500자를 초과할 수 없습니다" 에러

---

#### 2-2. 대화 내역 조회

**페이지**: 대화 화면에서 새로고침 (F5)

**예상 결과**:
- ✅ 이전 대화 내역이 그대로 표시됨
- ✅ Network 탭에서 `GET /api/conversations/history?days=7` 요청 확인

---

### ✅ Scenario 3: 보호자 연결 테스트 (7분)

이 시나리오는 **2명의 계정**이 필요합니다.

#### 3-1. 보호자 계정 생성

**새 시크릿 창** 또는 **다른 브라우저**에서:

**회원가입**:
```
이메일: guardian_001@example.com
이름: 보호자001
비밀번호: guard1234!
안부 메시지 수신: 체크 해제 (보호자는 수신 불필요)
```

**로그인**:
```
이메일: guardian_001@example.com
비밀번호: guard1234!
```

---

#### 3-2. 보호자 요청 생성 (노인 계정에서)

**첫 번째 브라우저** (test_user_001@example.com 로그인 상태):

1. **보호자 찾기**:
   - Settings 또는 Guardian 페이지로 이동
   - "보호자 검색" 기능 사용
   - 이메일 입력: `guardian_001@example.com`

**예상 결과**:
- ✅ 보호자 정보 표시: "보호자001"
- ✅ Network: `GET /api/members/search?email=guardian_001@example.com`

2. **보호자 요청 보내기**:
   - 관계 선택: "가족 (FAMILY)"
   - "보호자 요청 보내기" 버튼 클릭

**예상 결과**:
- ✅ "보호자 요청을 보냈습니다" 성공 메시지
- ✅ Network: `POST /api/guardians/requests`
  - Request Body: `{ guardianId: 2, relation: "FAMILY" }`
  - Response: `{ id: 1, status: "PENDING", ... }`

---

#### 3-3. 보호자 요청 수락 (보호자 계정에서)

**두 번째 브라우저** (guardian_001@example.com 로그인 상태):

1. **요청 목록 확인**:
   - Guardian 또는 Notifications 페이지로 이동
   - "받은 보호자 요청" 목록 확인

**예상 결과**:
- ✅ "테스트사용자001님의 보호자 요청" 표시
- ✅ 상태: "대기 중 (PENDING)"
- ✅ Network: `GET /api/guardians/requests`

2. **요청 수락**:
   - "수락" 버튼 클릭

**예상 결과**:
- ✅ "보호자 요청을 수락했습니다" 성공 메시지
- ✅ Network: `POST /api/guardians/requests/1/accept`
- ✅ 내가 돌보는 사람 목록에 "테스트사용자001" 추가됨

---

#### 3-4. 관계 확인 (노인 계정에서)

**첫 번째 브라우저**로 돌아가서:

1. **내 정보 새로고침**:
   - Settings 또는 Profile 페이지 새로고침

**예상 결과**:
- ✅ 보호자: "보호자001 (guardian_001@example.com)"
- ✅ 관계: "가족"
- ✅ Console: `GET /api/members/me` 응답에 guardian 정보 포함
  ```json
  {
    "guardian": {
      "memberId": 2,
      "memberName": "보호자001",
      "memberEmail": "guardian_001@example.com",
      "relation": "FAMILY"
    }
  }
  ```

---

### ✅ Scenario 4: 알림 규칙 테스트 (3분)

**페이지**: Settings → Alert Rules (보호자 계정에서)

#### 4-1. 알림 규칙 생성

**두 번째 브라우저** (guardian_001@example.com):

**테스트 케이스: 감정 패턴 알림**

```
알림 유형: 감정 패턴 분석 (EMOTION_PATTERN)
알림 레벨: 높음 (HIGH)
연속 일수: 3일
```

**예상 결과**:
- ✅ "알림 규칙이 생성되었습니다" 성공 메시지
- ✅ Network: `POST /api/alert-rules`
  - Request:
    ```json
    {
      "alertType": "EMOTION_PATTERN",
      "alertLevel": "HIGH",
      "condition": { "consecutiveDays": 3 }
    }
    ```
- ✅ 알림 규칙 목록에 새 규칙 추가됨
- ✅ 활성화 상태: ON

---

#### 4-2. 알림 규칙 활성화/비활성화

**알림 규칙 목록**에서:
- Toggle 스위치 클릭 (OFF)

**예상 결과**:
- ✅ "알림 규칙이 비활성화되었습니다"
- ✅ Network: `POST /api/alert-rules/1/toggle?active=false`
- ✅ 규칙 상태가 "비활성화"로 변경됨

---

### ✅ Scenario 5: 에러 처리 테스트 (선택 사항)

#### 5-1. 인증 만료 테스트

1. **localStorage에서 토큰 삭제**:
   - F12 → Application → Local Storage
   - `access_token` 삭제

2. **인증이 필요한 페이지 접근**:
   - `/dashboard` 또는 `/settings` 접근

**예상 결과**:
- ✅ 자동으로 로그인 페이지로 리다이렉트
- ✅ "로그인이 필요합니다" 메시지 (선택)

---

#### 5-2. 네트워크 에러 테스트

1. **서버 중지**:
   - 서버 프로세스 종료 (Ctrl+C)

2. **API 호출 시도**:
   - 로그인 시도 또는 메시지 전송 시도

**예상 결과**:
- ✅ "서버와 연결할 수 없습니다" 또는 "네트워크 오류" 에러 메시지
- ✅ Console에 에러 로그

---

## 📊 테스트 결과 체크리스트

### 회원가입 & 로그인
- [ ] 정상 회원가입 성공
- [ ] 이메일 중복 검증 작동
- [ ] 정상 로그인 성공 & 토큰 저장
- [ ] 잘못된 비밀번호 에러 처리

### AI 대화
- [ ] 메시지 전송 성공
- [ ] AI 응답 수신 & 화면 표시
- [ ] 대화 내역 조회 (새로고침 후)
- [ ] 500자 초과 메시지 에러 처리

### 보호자 관계
- [ ] 보호자 검색 성공
- [ ] 보호자 요청 전송 성공
- [ ] 보호자 요청 수락 성공
- [ ] 양측 계정에서 관계 정보 확인

### 알림 규칙
- [ ] 알림 규칙 생성 성공
- [ ] 알림 규칙 목록 조회
- [ ] 알림 규칙 활성화/비활성화 토글

### 에러 처리 (선택)
- [ ] 인증 만료 시 로그인 페이지 리다이렉트
- [ ] 네트워크 에러 적절한 메시지 표시

---

## 🐛 문제 발생 시 디버깅

### 1. Console 로그 확인

**정상적인 로그 예시**:
```
📦 로그인 응답: { code: "M201", ... }
✅ 토큰 저장 완료
✅ 로그인 성공: test_user_001@example.com
```

**에러 로그 예시**:
```
❌ API 오류: 이메일 또는 비밀번호가 틀렸습니다 (A401)
```

---

### 2. Network 탭 확인

**확인 사항**:
1. **Request URL**: 올바른 엔드포인트인지
   - 예: `http://localhost:8080/api/auth/login`
2. **Request Method**: GET/POST/PUT/DELETE 올바른지
3. **Request Headers**: `Authorization: Bearer ...` 포함 여부
4. **Request Body**: 전송 데이터 구조 확인
5. **Response Status**: 200/201/400/401/404 등
6. **Response Body**: `{ code, message, data }` 구조 확인

---

### 3. 자주 발생하는 문제

#### 문제 1: "로그인 응답에 토큰이 없습니다"
**원인**: 서버 응답 구조 불일치
**해결**:
- Network 탭에서 `POST /api/auth/login` 응답 확인
- `data.accessToken` 필드가 있는지 확인
- 서버 api-spec.md와 일치하는지 확인

#### 문제 2: "회원을 찾을 수 없습니다" (M404)
**원인**: JWT 토큰 미전송 또는 만료
**해결**:
- localStorage의 `access_token` 확인
- 로그아웃 후 재로그인

#### 문제 3: CORS 에러
**원인**: 서버 CORS 설정 문제
**해결**:
- 서버 `CorsConfig.java` 확인
- `allowedOrigins("http://localhost:5173")` 포함 여부 확인

#### 문제 4: 네트워크 에러
**원인**: 서버 미실행
**해결**:
- 서버 실행 확인: `curl http://localhost:8080/api/members/me`

---

## 🎉 테스트 완료 기준

모든 체크리스트 항목이 ✅이면 **Phase 3-8 API 연결 완료**입니다!

---

**다음 단계**: Phase 3-9 UI/UX 개선 또는 Phase 4로 진행
