# MARUNI 빠른 테스트 체크리스트

**목적**: Phase 3-8 완료 후 핵심 기능 빠른 검증 (15분 소요)

---

## ⚙️ 환경 설정 (2분)

```bash
# 1. 서버 실행 확인
curl http://localhost:8080/api/health

# 2. 클라이언트 실행
npm run dev
# → http://localhost:5173

# 3. 브라우저 개발자 도구 열기
# - Network 탭 열기
# - Console 탭 열기
```

---

## 🧪 핵심 테스트 (13분)

### 1️⃣ 회원가입 & 로그인 (3분)

**회원가입**:
- [ ] `/register` 페이지 접근
- [ ] 이메일: `test@test.com` 입력
- [ ] 이름: `테스트` 입력
- [ ] 비밀번호: `test1234!` 입력
- [ ] 전화번호: `010-1234-5678` 입력
- [ ] "가입하기" 클릭
- [ ] ✅ API 호출: `POST /api/join` (201 Created)
- [ ] ✅ 자동 로그인 후 대시보드 이동
- [ ] ✅ "시작 가이드" 섹션 표시

**로그아웃 & 재로그인**:
- [ ] 로그아웃
- [ ] 이메일: `test@test.com` / 비밀번호: `test1234!`
- [ ] ✅ API 호출: `POST /api/auth/login` (200 OK)
- [ ] ✅ localStorage에 토큰 저장
- [ ] ✅ `GET /api/members/me` 자동 호출
- [ ] ✅ 대시보드 이동

---

### 2️⃣ AI 대화 (3분)

- [ ] NavigationBar → "대화" 탭 클릭
- [ ] ✅ API 호출: `GET /api/conversations/history?days=7`
- [ ] 메시지 입력: "안녕하세요"
- [ ] Enter 또는 "전송" 클릭
- [ ] ✅ API 호출: `POST /api/conversations/messages`
- [ ] ✅ 사용자 메시지 표시
- [ ] ✅ AI 응답 표시
- [ ] ✅ 감정 이모지 표시 (😊/😢/😐)
- [ ] ✅ 자동 스크롤

**부정적 메시지 테스트**:
- [ ] "너무 외롭고 힘들어요" 입력 & 전송
- [ ] ✅ 부정적 이모지 표시 (😢)

---

### 3️⃣ 보호자 관계 (4분)

**노인 계정 (test@test.com)**:
- [ ] 대시보드 → "보호자 등록하기" 클릭
- [ ] 검색: `guardian@test.com` 입력 (사전에 서버에 계정 생성 필요)
- [ ] ✅ API 호출: `GET /api/members/search?keyword=guardian@test.com`
- [ ] ✅ 검색 결과 표시
- [ ] "선택" → "등록하기" 클릭
- [ ] ✅ API 호출: `POST /api/guardians/requests`
- [ ] ✅ Toast: "보호자 등록 요청을 보냈습니다!"

**보호자 계정 (guardian@test.com)**:
- [ ] 로그아웃 후 `guardian@test.com`로 로그인
- [ ] 보호자 요청 페이지 이동 (`/guardians/requests`)
- [ ] ✅ API 호출: `GET /api/guardians/requests`
- [ ] ✅ 요청 카드 표시
- [ ] "수락" 클릭
- [ ] ✅ API 호출: `POST /api/guardians/requests/{id}/accept`
- [ ] ✅ Toast: "보호자 요청을 수락했습니다!"
- [ ] ✅ 대시보드 → "내가 돌보는 사람들" 섹션 표시

**노인 계정 확인**:
- [ ] 로그아웃 후 `test@test.com`로 다시 로그인
- [ ] ✅ 대시보드 → "내 보호자" 섹션 표시

---

### 4️⃣ 설정 관리 (2분)

**프로필 수정**:
- [ ] NavigationBar → "설정" 탭
- [ ] "내 정보 수정" 클릭
- [ ] 이름: `테스트` → `테스트유저` 변경
- [ ] "저장" 클릭
- [ ] ✅ API 호출: `PATCH /api/members/me`
- [ ] ✅ Toast: "프로필이 수정되었습니다"
- [ ] ✅ 대시보드 헤더에 새 이름 반영

**안부 메시지 토글**:
- [ ] 설정 → "알림 설정"
- [ ] "안부 메시지 받기" 토글 클릭
- [ ] ✅ API 호출: `PATCH /api/members/me/daily-check?enabled=false`
- [ ] ✅ Toast: "설정이 변경되었습니다"
- [ ] ✅ 대시보드 → "내 안부 메시지" 섹션 토글

---

### 5️⃣ 에러 처리 (1분)

**잘못된 로그인**:
- [ ] 로그아웃
- [ ] 이메일: `test@test.com` / 비밀번호: `wrongpassword`
- [ ] ✅ Toast: "이메일 또는 비밀번호가 일치하지 않습니다"

**401 자동 로그아웃 테스트**:
- [ ] 로그인 후 개발자 도구 → Application → localStorage
- [ ] `access_token` 값을 `invalid_token`으로 변경
- [ ] 페이지 새로고침 또는 API 호출 시도
- [ ] ✅ 자동 로그아웃
- [ ] ✅ 로그인 페이지로 리다이렉트
- [ ] ✅ Toast: "로그인이 필요합니다"

---

## ✅ 최종 확인

### API 연결
- [ ] 모든 API에 `Authorization: Bearer {token}` 헤더 자동 추가
- [ ] 모든 응답이 `CommonApiResponse<T>` 구조
- [ ] 에러 응답 시 적절한 Toast 표시

### 상태 관리
- [ ] AuthStore 실시간 업데이트
- [ ] TanStack Query 자동 캐싱 작동

### UI/UX
- [ ] 모든 Toast 메시지 명확함
- [ ] 로딩 상태 표시
- [ ] 터치 영역 충분함 (60px+)

### Console 에러
- [ ] Console에 에러 없음
- [ ] Network 탭에서 모든 API 호출 성공 (2xx)

---

## 📝 테스트 결과

**날짜**: ____________________
**테스터**: ____________________
**결과**: ✅ 통과 / ❌ 실패

**발견된 이슈**:
1. _______________________________
2. _______________________________
3. _______________________________

---

## 🚀 다음 단계

**테스트 통과 시**:
- [ ] 상세 통합 테스트 진행 (`INTEGRATION_TEST_SCENARIOS.md`)
- [ ] 프로덕션 배포 준비

**테스트 실패 시**:
- [ ] 이슈 우선순위 분류
- [ ] 버그 수정
- [ ] 재테스트

---

**📅 작성일**: 2025-11-02
**✏️ 작성자**: Claude Code
