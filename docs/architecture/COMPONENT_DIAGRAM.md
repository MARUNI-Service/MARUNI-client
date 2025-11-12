# MARUNI Client 컴포넌트 다이어그램

> MARUNI 클라이언트의 전체 컴포넌트 구조를 Mermaid 다이어그램으로 시각화

**작성일**: 2025-11-10
**버전**: Phase 3 완료 기준

---

## 📐 1. 전체 아키텍처 (4계층)

```mermaid
graph TB
    subgraph App["App Layer"]
        A1[App.tsx]
        A2[router.tsx]
        A3[AppProviders]
    end

    subgraph Features["Features Layer"]
        F1[auth]
        F2[conversation]
        F3[guardian]
        F4[member]
        F5[notification]
        F6[alert]
    end

    subgraph Pages["Pages Layer"]
        P1[auth pages]
        P2[dashboard]
        P3[conversation]
        P4[guardians]
        P5[settings]
        P6[notifications]
    end

    subgraph Shared["Shared Layer"]
        S1[components]
        S2[api]
        S3[hooks]
        S4[types]
        S5[utils]
    end

    App --> Features
    Features --> Shared
    Pages --> Features
    Pages --> Shared

    style App fill:#e3f2fd
    style Features fill:#fff3e0
    style Pages fill:#f3e5f5
    style Shared fill:#e8f5e9
```

---

## 🧩 2. 애플리케이션 진입점

```mermaid
graph LR
    A[main.tsx] --> B[App.tsx]
    B --> C[AppProviders]
    C --> D[ErrorBoundary]
    D --> E[QueryProvider]
    E --> F[RouterProvider]

    style A fill:#ffcdd2
    style B fill:#f8bbd0
    style C fill:#e1bee7
    style D fill:#d1c4e9
    style E fill:#c5cae9
    style F fill:#bbdefb
```

---

## 🎨 3. 페이지 렌더링 구조

```mermaid
graph TB
    Router[RouterProvider]

    Router --> Public[공개 라우트]
    Router --> Protected[보호된 라우트]

    Public --> Login[LoginPage]
    Public --> Register[RegisterPage]

    Protected --> PR[ProtectedRoute]
    PR --> Layout[Layout]

    Layout --> Header[Header]
    Layout --> Main[Main Content]
    Layout --> Nav[NavigationBar]

    Header --> Back[뒤로가기]
    Header --> Title[페이지 제목]

    Main --> Page[Page Component]
    Page --> Business[Business Components]
    Page --> UI[UI Components]

    Nav --> N1[홈]
    Nav --> N2[대화]
    Nav --> N3[보호자]
    Nav --> N4[알림]
    Nav --> N5[설정]

    style Router fill:#e3f2fd
    style Protected fill:#c8e6c9
    style Public fill:#ffccbc
    style Layout fill:#fff9c4
```

---

## 📦 4. Shared Components 구조

```mermaid
graph TB
    Components[Shared Components]

    Components --> UI[UI Components]
    Components --> Layout[Layout Components]
    Components --> Business[Business Components]

    UI --> UI1[Button]
    UI --> UI2[Input]
    UI --> UI3[Card]
    UI --> UI4[Modal]
    UI --> UI5[Toast]
    UI --> UI6[LoadingSpinner]
    UI --> UI7[EmptyState]
    UI --> UI8[ErrorBoundary]

    Layout --> L1[Layout]
    Layout --> L2[NavigationBar]

    Business --> B1[ChatMessage]
    Business --> B2[GuardianCard]
    Business --> B3[ManagedMemberCard]
    Business --> B4[MessageCard]
    Business --> B5[MessageInput]
    Business --> B6[NotificationCard]

    style Components fill:#e1f5fe
    style UI fill:#b3e5fc
    style Layout fill:#81d4fa
    style Business fill:#4fc3f7
```

---

## 🔄 5. 데이터 흐름

```mermaid
graph TB
    User[User Interaction]

    User --> Page[Pages]
    Page --> Feature[Features]

    Feature --> Hook1[React Query Hook]
    Feature --> Hook2[Zustand Store]

    Hook1 --> API[API Client]
    Hook2 --> API

    API --> Interceptor[JWT Interceptor]
    Interceptor --> Backend[Backend API]

    Backend --> Response[Response]
    Response --> Cache[TanStack Query Cache]
    Cache --> UI[UI Update]

    style User fill:#ffebee
    style Page fill:#f3e5f5
    style Feature fill:#e8eaf6
    style API fill:#e0f2f1
    style Backend fill:#e0f7fa
```

---

## 🗺️ 6. 라우팅 맵

```mermaid
graph TB
    Root["Root (/)"]

    Root --> Auth["Public Routes"]
    Root --> Protected["Protected Routes"]
    Root --> NotFound["Not Found"]

    Auth --> Login["Login Page<br/>/auth/login"]
    Auth --> Register["Register Page<br/>/auth/register"]

    Protected --> Dashboard["Dashboard<br/>/dashboard"]
    Protected --> Conv["Conversation<br/>/conversation"]
    Protected --> Guard["Guardian Routes"]
    Protected --> Settings["Settings Routes"]
    Protected --> Notif["Notification Routes"]

    Guard --> G1["Guardians List<br/>/guardians"]
    Guard --> G2["Guardian Search<br/>/guardians/search"]
    Guard --> G3["Guardian Requests<br/>/guardians/requests"]

    Settings --> S1["Settings Main<br/>/settings"]
    Settings --> S2["Profile<br/>/settings/profile"]
    Settings --> S3["Notifications<br/>/settings/notifications"]
    Settings --> S4["Password<br/>/settings/password"]

    Notif --> N1["Notifications List<br/>/notifications"]
    Notif --> N2["Notification Detail<br/>/notifications/:id"]

    style Root fill:#fce4ec
    style Auth fill:#f8bbd0
    style Protected fill:#c5e1a5
    style NotFound fill:#ef9a9a
```

---

## 🏗️ 7. Feature 모듈 구조

```mermaid
graph LR
    Feature[Feature Module]

    Feature --> API[api/]
    Feature --> Hooks[hooks/]
    Feature --> Store[store/]
    Feature --> Types[types/]
    Feature --> Index[index.ts]

    API --> ApiFile[featureApi.ts]
    Hooks --> HookFile[useFeature.ts]
    Store --> StoreFile[useFeatureStore.ts]
    Types --> TypeFile[feature.types.ts]

    Index --> Export[통합 Export]

    style Feature fill:#fff3e0
    style API fill:#ffe0b2
    style Hooks fill:#ffcc80
    style Store fill:#ffb74d
    style Types fill:#ffa726
```

---

## 📊 8. Feature 목록

```mermaid
graph TB
    Features[Features Layer]

    Features --> Auth["auth<br/>인증/인가"]
    Features --> Conv["conversation<br/>AI 대화"]
    Features --> Guard["guardian<br/>보호자 관리"]
    Features --> Member["member<br/>회원 관리"]
    Features --> Notif["notification<br/>알림 조회"]
    Features --> Alert["alert<br/>알림 규칙"]

    Auth --> A1[Login/Logout]
    Auth --> A2[JWT Token]
    Auth --> A3[Protected Route]

    Conv --> C1[AI 대화 전송]
    Conv --> C2[대화 히스토리]
    Conv --> C3[감정 분석]

    Guard --> G1[보호자 검색]
    Guard --> G2[관계 요청]
    Guard --> G3[관계 승인/거절]

    style Features fill:#e3f2fd
    style Auth fill:#90caf9
    style Conv fill:#81c784
    style Guard fill:#ffb74d
    style Member fill:#ba68c8
    style Notif fill:#ff8a65
    style Alert fill:#ffd54f
```

---

## 🔗 9. 의존성 관계

```mermaid
graph TB
    App[App Layer]
    Features[Features Layer]
    Pages[Pages Layer]
    Shared[Shared Layer]

    App --> Features
    App --> Pages
    Features --> Shared
    Pages --> Features
    Pages --> Shared

    Features -.X.- Features2[다른 Feature]

    Note1[Features 간<br/>직접 의존 금지]
    Note2[Shared를 통해 통신]

    style App fill:#e3f2fd
    style Features fill:#fff3e0
    style Pages fill:#f3e5f5
    style Shared fill:#e8f5e9
    style Features2 fill:#ffcdd2
    style Note1 fill:#fff
    style Note2 fill:#fff
```

---

## 🎯 10. 컴포넌트 재사용 패턴

```mermaid
graph TB
    subgraph Pages["Page Components"]
        Dashboard[DashboardPage]
        Conversation[ConversationPage]
        Guardians[GuardiansPage]
    end

    subgraph Business["Business Components"]
        ChatMsg[ChatMessage]
        GuardCard[GuardianCard]
        NotifCard[NotificationCard]
    end

    subgraph UI["UI Components"]
        Button[Button]
        Card[Card]
        Input[Input]
        Modal[Modal]
    end

    Dashboard --> GuardCard
    Dashboard --> NotifCard
    Dashboard --> Button
    Dashboard --> Card

    Conversation --> ChatMsg
    Conversation --> Button
    Conversation --> Input

    Guardians --> GuardCard
    Guardians --> Modal
    Guardians --> Button

    ChatMsg --> Card
    GuardCard --> Card
    GuardCard --> Button
    NotifCard --> Card

    style Pages fill:#e1f5fe
    style Business fill:#b3e5fc
    style UI fill:#81d4fa
```

---

## 📱 11. 사용자 여정 플로우

```mermaid
graph TB
    Start([앱 시작])

    Start --> Check{로그인?}

    Check -->|No| Login[로그인 페이지]
    Check -->|Yes| Dashboard[대시보드]

    Login --> Auth[인증]
    Auth --> Dashboard

    Dashboard --> Action{사용자 행동}

    Action -->|AI 대화| Conv[대화 페이지]
    Action -->|보호자 관리| Guard[보호자 페이지]
    Action -->|알림 확인| Notif[알림 페이지]
    Action -->|설정| Settings[설정 페이지]

    Conv --> Dashboard
    Guard --> Dashboard
    Notif --> Dashboard
    Settings --> Dashboard

    style Start fill:#c8e6c9
    style Dashboard fill:#fff9c4
    style Conv fill:#b3e5fc
    style Guard fill:#f8bbd0
    style Notif fill:#ffccbc
    style Settings fill:#d1c4e9
```

---

## 🛠️ 12. 개발 워크플로우

```mermaid
graph LR
    Dev[개발자]

    Dev -->|1| Feature[Feature 구현]
    Feature -->|2| Hook[Hook 작성]
    Hook -->|3| API[API 연결]
    API -->|4| Component[Component 생성]
    Component -->|5| Page[Page 조합]
    Page -->|6| Route[Route 추가]
    Route -->|7| Test[테스트]
    Test -->|8| Deploy[배포]

    style Dev fill:#ffebee
    style Feature fill:#f3e5f5
    style Hook fill:#ede7f6
    style API fill:#e8eaf6
    style Component fill:#e3f2fd
    style Page fill:#e1f5fe
    style Route fill:#e0f7fa
    style Test fill:#e0f2f1
    style Deploy fill:#c8e6c9
```

---

## 📈 사용 방법

이 문서는 다음 도구로 시각화할 수 있습니다:

1. **GitHub**: 마크다운에서 Mermaid 자동 렌더링
2. **VS Code**: Mermaid Preview 확장 설치
3. **Mermaid Live Editor**: https://mermaid.live
4. **Notion, Obsidian**: Mermaid 플러그인 지원

---

**📅 마지막 업데이트**: 2025-11-10
**📈 현재 상태**: Phase 3 완료 (API 연결 전)
