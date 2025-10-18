Phase 3-4 계획 리뷰에 대한 최종 의견

✅ 즉시 적용: Mock API 에러 처리 (#3)

강력 동의 - 바로 계획서 수정 필요

// [error], [timeout] 키워드로 의도적 에러 발생
if (content.includes('[error]')) throw new Error('네트워크 오류');

이유:

- 개발자가 에러 UX를 직접 테스트 가능
- 실제 API 전에 에러 처리 견고성 검증
- 구현 비용 5분, 효과는 크다

---

⏳ 나중에 검토: Zustand 도입 (#1)

부분 동의 - Phase 3-6(알림)에서 재검토

현재 useState 유지 이유:

- YAGNI 원칙: 대시보드 뱃지 기능 아직 없음
- Mock 단계에서 과도한 아키텍처는 오버엔지니어링
- 실제 필요 시점: Phase 3-6에서 "읽지 않은 메시지 수" 구현 시

TODO 주석 추가:
// TODO: Phase 3-6에서 대시보드 뱃지 구현 시
// Zustand store로 마이그레이션 검토

---

❌ 반대: Lucide Icons 전환 (#2)

명확한 반대 - 이모지 유지

근거:

1. CLAUDE.md 가이드라인 재해석 필요


    - "Don't use emojis in design" = UI 구조 요소 (버튼, 아이콘, 네비게이션)
    - 감정 표현은 "콘텐츠" → 이모지가 적합

2. 프로젝트 선례


    - 이미 여러 곳에서 이모지 사용 중:
        - 📬 내 안부 메시지 (대시보드)
      - 📭 받은 요청이 없습니다 (Guardian)
      - 🔍 검색 결과가 없습니다

3. 노인 친화성 최우선


    - 😊 😢 😐 = 즉시 인식 가능
    - Lucide Icons = 추상적, 인지 부담 증가

제안: CLAUDE.md 가이드라인 명확화

- ❌ UI 요소(버튼, 네비게이션)에 이모지 사용
- ✅ 콘텐츠 표현(감정, 상태, 장식 제목)에 이모지 허용

---

⏳ 나중에 검토: 컴포넌트 위치 (#4)

조건부 동의 - Phase 3-6에서 재검토

현재 shared/business 유지 이유:

- GuardianCard, ManagedMemberCard 선례 따름
- Phase 3-6에서 보호자가 대화 이력 볼 예정 (재사용 가능성 높음)
- 재사용 안 되면 그때 이동해도 늦지 않음

기준 명확화 필요:
shared/components/business/:
→ 2개 이상 feature에서 사용되는 비즈니스 컴포넌트

features/{name}/components/:
→ 해당 feature에서만 사용되는 컴포넌트

---

📊 최종 결정 요약표

| 항목              | 판단    | 적용 시점  | 우선순위 |
| ----------------- | ------- | ---------- | -------- |
| #3 Mock 에러 처리 | ✅ 적용 | 지금 즉시  | 🔴 긴급  |
| #1 Zustand        | ⏳ 보류 | Phase 3-6  | 🟡 중간  |
| #2 Lucide Icons   | ❌ 반대 | 적용 안 함 | -        |
| #4 컴포넌트 위치  | ⏳ 보류 | Phase 3-6  | 🟢 낮음  |
