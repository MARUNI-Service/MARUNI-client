# MARUNI Client 코딩 컨벤션

## 📁 파일 및 폴더 네이밍

### 폴더 구조
```
src/
├── components/          # 재사용 컴포넌트
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 훅
├── store/              # Zustand 스토어
├── api/                # API 관련
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── constants/          # 상수 정의
```

### 네이밍 규칙
- **폴더**: `camelCase` (예: `components`, `customHooks`)
- **컴포넌트 파일**: `PascalCase` (예: `LoginForm.tsx`, `UserProfile.tsx`)
- **일반 파일**: `camelCase` (예: `apiClient.ts`, `validators.ts`)
- **타입 파일**: `camelCase.types.ts` (예: `auth.types.ts`)
- **훅 파일**: `use + PascalCase` (예: `useAuth.ts`, `useLocalStorage.ts`)

## 🔧 TypeScript 컨벤션

### 인터페이스 및 타입
```typescript
// Interface: I 접두사 없이 PascalCase
interface User {
  id: number;
  name: string;
  email: string;
}

// Type: PascalCase
type UserRole = 'admin' | 'user' | 'guardian';

// Enum: PascalCase
enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice'
}

// Generic: 단일 대문자
function apiCall<T>(data: T): Promise<T> {
  // ...
}
```

### 변수 및 함수
```typescript
// 변수: camelCase
const userName = 'John Doe';
const isLoggedIn = true;

// 함수: camelCase
const getUserProfile = async (userId: number) => {
  // ...
};

// 상수: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8080/api';
const MAX_RETRY_COUNT = 3;
```

## ⚛️ React 컨벤션

### 컴포넌트 구조
```typescript
// 1. Imports (라이브러리 → 내부 모듈)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/common';
import { useAuth } from '@/hooks';
import { User } from '@/types';

// 2. Types/Interfaces
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

// 3. Component
export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  // 4. Hooks
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 5. State
  const [isEditing, setIsEditing] = useState(false);

  // 6. Effects
  useEffect(() => {
    // ...
  }, []);

  // 7. Event Handlers
  const handleSave = () => {
    // ...
  };

  // 8. Render
  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  );
};
```

### 컴포넌트 네이밍
```typescript
// 컴포넌트: PascalCase
export const LoginForm = () => { /* ... */ };

// Props: ComponentName + Props
interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
}

// Event handlers: handle + Action
const handleSubmit = () => { /* ... */ };
const handleInputChange = () => { /* ... */ };

// Boolean props: is/has/can/should + adjective
interface ButtonProps {
  isLoading?: boolean;
  hasIcon?: boolean;
  canSubmit?: boolean;
  shouldAutoFocus?: boolean;
}
```

## 🎨 CSS/Tailwind 컨벤션

### 클래스 네이밍
```typescript
// Tailwind: 논리적 순서로 정렬
// Layout → Typography → Colors → Spacing → Effects
<div className="flex flex-col items-center justify-center text-lg font-semibold text-gray-900 p-4 rounded-lg shadow-md">

// 커스텀 CSS: BEM 방식 (필요시에만)
<div className="user-card user-card--active">
  <div className="user-card__header">
    <div className="user-card__title">
```

### 노인 친화적 스타일
```typescript
// 공통 스타일 클래스 활용
<button className="btn-primary">  {/* 60px 높이, 20px 폰트 */}
<div className="touch-target">    {/* 최소 48px 터치 영역 */}
<p className="text-high-contrast"> {/* 고대비 텍스트 */}
```

## 📁 임포트 순서 및 경로

### 임포트 순서
```typescript
// 1. React 및 라이브러리
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 2. 내부 컴포넌트
import { Button, Card } from '@/components/common';
import { Header } from '@/components/layout';

// 3. 훅
import { useAuth, useLocalStorage } from '@/hooks';

// 4. 유틸리티 및 상수
import { formatDate, validateEmail } from '@/utils';
import { API_ENDPOINTS } from '@/constants';

// 5. 타입
import { User, ApiResponse } from '@/types';
```

### 경로 설정
```typescript
// 절대경로 사용 (vite.config.ts에서 @ alias 설정)
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

// 상대경로는 같은 폴더 내에서만
import { validateForm } from './utils';
import { LoginFormProps } from './types';
```

## 🔗 API 및 상태 관리

### API 함수
```typescript
// API 함수: 동사 + 명사
export const getUser = async (id: number): Promise<User> => {
  // ...
};

export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  // ...
};

export const updateUserProfile = async (id: number, data: UpdateUserRequest): Promise<User> => {
  // ...
};
```

### Zustand 스토어
```typescript
// 스토어: use + 도메인 + Store
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // ...
  },
  logout: () => {
    // ...
  }
}));
```

### 커스텀 훅
```typescript
// 훅: use + 기능명
export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    login: store.login,
    logout: store.logout
  };
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // ...
};
```

## 📝 주석 및 문서화

### 컴포넌트 문서화
```typescript
/**
 * 사용자 프로필을 표시하고 편집할 수 있는 컴포넌트
 *
 * @param user - 표시할 사용자 정보
 * @param onUpdate - 사용자 정보 업데이트 콜백
 */
export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  // ...
};
```

### 함수 문서화
```typescript
/**
 * 이메일 주소 유효성을 검사합니다
 *
 * @param email - 검사할 이메일 주소
 * @returns 유효한 이메일이면 true, 아니면 false
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### TODO 주석
```typescript
// TODO: 에러 처리 로직 추가 필요
// FIXME: 메모리 누수 가능성 있음
// NOTE: 이 로직은 서버 API 변경 시 수정 필요
```

## 🧪 테스트 컨벤션

### 테스트 파일 네이밍
```
UserProfile.tsx
UserProfile.test.tsx     # 단위 테스트
UserProfile.integration.test.tsx  # 통합 테스트
```

### 테스트 구조
```typescript
describe('UserProfile', () => {
  describe('렌더링', () => {
    it('사용자 정보를 올바르게 표시해야 한다', () => {
      // ...
    });
  });

  describe('상호작용', () => {
    it('편집 버튼 클릭 시 편집 모드로 전환되어야 한다', () => {
      // ...
    });
  });
});
```

## 🚫 금지사항

### 하지 말아야 할 것들
```typescript
// ❌ any 타입 사용
const data: any = fetchData();

// ✅ 적절한 타입 정의
const data: User[] = fetchData();

// ❌ 인라인 스타일
<div style={{ color: 'red', fontSize: '16px' }}>

// ✅ Tailwind 클래스 사용
<div className="text-red-500 text-base">

// ❌ console.log 커밋
console.log('debug info');

// ✅ 개발 중에만 사용, 커밋 전 제거

// ❌ 마법 숫자/문자열
if (user.age > 65) { ... }

// ✅ 상수 사용
const SENIOR_AGE_THRESHOLD = 65;
if (user.age > SENIOR_AGE_THRESHOLD) { ... }
```

## ✅ 코드 리뷰 체크리스트

- [ ] 타입 안전성 (any 타입 사용 금지)
- [ ] 적절한 네이밍 (함수, 변수, 컴포넌트)
- [ ] 코드 재사용성 (중복 코드 제거)
- [ ] 에러 처리 (try-catch, 에러 바운더리)
- [ ] 접근성 (aria-label, alt 텍스트 등)
- [ ] 성능 (불필요한 리렌더링 방지)
- [ ] 주석 및 문서화 (복잡한 로직 설명)
- [ ] 테스트 코드 작성