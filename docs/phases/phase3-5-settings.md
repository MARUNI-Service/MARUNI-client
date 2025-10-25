# Phase 3-5: 설정 관리 - 세부 구현 계획

**작성일**: 2025-10-21
**최종 업데이트**: 2025-10-21 (v1.0.0)
**예상 소요 시간**: 1-2일 (8-11시간)
**상태**: 📋 준비 완료
**우선순위**: 🟠 높음
**구현 원칙**: Mock 데이터 기반 구현 - 설정 관리 플로우 완성
**API 연결**: ❌ 이 Phase에서는 연결 안 함 - Phase 3-8에서 일괄 연결
**의존성**: Phase 3-1, 3-2, 3-3, 3-4, 3-7 완료 필요

---

## 📋 목차

1. [Phase 개요](#phase-개요)
2. [API 연결 전략](#api-연결-전략)
3. [최소 구현 원칙](#최소-구현-원칙)
4. [기술 부채 관리](#기술-부채-관리)
5. [작업 분해](#작업-분해)
6. [Task별 구현 가이드](#task별-구현-가이드)
7. [테스트 계획](#테스트-계획)
8. [완료 체크리스트](#완료-체크리스트)

---

## Phase 개요

### 목표

사용자가 앱 설정 및 개인정보를 관리할 수 있는 기능을 완성하여, 프로필 수정, 비밀번호 변경, 안부 메시지 ON/OFF 등의 설정을 할 수 있도록 한다.

### 핵심 요구사항

**설정 관리 기능**:

```
[사용자] 대시보드 → 설정 → 설정 메뉴 선택
                              ↓
          [내 정보 수정] → 이름, 전화번호 수정 → 저장 → Toast 표시
          [알림 설정] → 안부 메시지 ON/OFF → 대시보드 자동 업데이트
          [비밀번호 변경] → 현재 비밀번호 확인 → 새 비밀번호 입력 → 변경
```

**주요 기능**:
1. 🎯 설정 메뉴 페이지 구현
2. 🎯 내 정보 수정 (이름, 전화번호)
3. 🎯 알림 설정 (dailyCheckEnabled, 푸시 알림)
4. 🎯 비밀번호 변경
5. 🎯 변경사항 즉시 반영

### 범위

**포함**:

- ✅ features/member 모듈 생성
  - Member 관련 타입 정의 (ProfileUpdateRequest, PasswordChangeRequest)
  - Mock 프로필 조회/수정 API
  - Mock 비밀번호 변경 API
  - useMember, useProfile 훅
- ✅ 설정 화면 4개
  - /settings - 설정 메뉴
  - /settings/profile - 내 정보 수정
  - /settings/notifications - 알림 설정
  - /settings/password - 비밀번호 변경
- ✅ 설정 기능
  - 프로필 수정 → localStorage + AuthStore 업데이트
  - dailyCheckEnabled 토글 → 대시보드 자동 업데이트
  - 비밀번호 변경 → localStorage 업데이트
- ✅ Phase 3-7 공통 컴포넌트 재사용
  - Toast: 저장 성공/실패 메시지
  - Modal: 변경사항 확인 다이얼로그
  - NavigationBar: 설정 탭 활성화

**제외**:

- ❌ API 연결 (Phase 3-8에서 일괄 연결)
- ❌ 이메일 변경 (이메일은 고정)
- ❌ 계정 삭제 (Phase 4)
- ❌ 보호자 관계 해제 (Phase 3-3에서 구현 제외, 추후 추가)
- ❌ 앱 테마 변경 (Phase 4)
- ❌ 언어 설정 (Phase 4)

---

## API 연결 전략

### Phase 3-5: Mock 데이터로 설정 관리 구현

**원칙**:

- **설정 관리 플로우만 구현, 실제 API는 호출 안 함**
- 프로필 수정 시 localStorage 업데이트
- AuthStore의 setUser() 호출로 즉시 반영
- 비밀번호 변경 시 유효성 검사만, 실제 암호화 X

### Phase 3-5에서 할 일

1. **프로필 조회**

   - AuthStore에서 현재 사용자 정보 조회
   - `GET /api/members/me` 호출 안 함

2. **프로필 수정**

   - localStorage의 `auth-storage` 업데이트
   - AuthStore.setUser() 호출로 즉시 반영
   - `PATCH /api/members/me` 호출 안 함

3. **비밀번호 변경**

   - localStorage의 Mock 사용자 비밀번호 업데이트
   - 현재 비밀번호 확인 (localStorage에서 검증)
   - `PATCH /api/members/me/password` 호출 안 함

4. **알림 설정**
   - dailyCheckEnabled 토글 시 localStorage 업데이트
   - AuthStore.setUser() 호출로 대시보드 자동 업데이트
   - `PATCH /api/members/me/settings` 호출 안 함

### Phase 3-8 (API 연결) 계획

Phase 3-1 ~ 3-7 완료 후:

1. **프로필 수정 API 연동**

   - `PATCH /api/members/me` 실제 호출
   - 서버에서 업데이트된 사용자 정보 반환

2. **비밀번호 변경 API 연동**

   - `PATCH /api/members/me/password` 실제 호출
   - 현재 비밀번호 검증 (서버)
   - 새 비밀번호 암호화 및 저장 (서버)

3. **알림 설정 API 연동**
   - `PATCH /api/members/me/settings` 실제 호출
   - dailyCheckEnabled 서버 업데이트

**장점**:

- ✅ 설정 관리 플로우를 먼저 완성하고 나중에 API 연결
- ✅ 백엔드 API 없이도 프론트 개발 가능
- ✅ UI/UX 먼저 완성하고 나중에 보안 강화

---

## 최소 구현 원칙

### 1. 설정 메뉴는 카드 리스트로 단순하게

```typescript
// ✅ Good: 단순한 카드 리스트
<div className="space-y-4">
  <Card onClick={() => navigate('/settings/profile')}>
    <h3>내 정보 수정</h3>
    <p>이름, 전화번호를 변경합니다</p>
  </Card>
  <Card onClick={() => navigate('/settings/notifications')}>
    <h3>알림 설정</h3>
    <p>안부 메시지 및 푸시 알림 설정</p>
  </Card>
  <Card onClick={() => navigate('/settings/password')}>
    <h3>비밀번호 변경</h3>
    <p>새 비밀번호로 변경합니다</p>
  </Card>
</div>

// ❌ Bad: 복잡한 Accordion, Tab 구조
```

### 2. Toast로 피드백 통일 (Phase 3-7 재사용)

```typescript
// ✅ Good: Toast 사용
const toast = useToast();
await updateProfile(data);
toast.success('저장되었습니다!');

// ❌ Bad: Modal, alert() 혼용
```

### 3. dailyCheckEnabled 변경 시 대시보드 자동 업데이트

```typescript
// ✅ Good: AuthStore 업데이트로 자동 반영
const { user, setUser } = useAuth();
const handleToggle = () => {
  setUser({
    ...user,
    dailyCheckEnabled: !user.dailyCheckEnabled,
  });
  toast.success('설정이 변경되었습니다');
};
// 대시보드에서 user.dailyCheckEnabled로 섹션 표시 여부 결정
```

### 4. 비밀번호 변경은 현재 비밀번호 확인 필수

```typescript
// ✅ Good: 현재 비밀번호 검증
const handleChangePassword = async (data: PasswordChangeRequest) => {
  // localStorage에서 현재 비밀번호 확인
  const isValid = await verifyCurrentPassword(data.currentPassword);
  if (!isValid) {
    toast.error('현재 비밀번호가 일치하지 않습니다');
    return;
  }
  // 변경 진행
};
```

---

## 기술 부채 관리

### Phase 3-5에서 남길 기술 부채

이 Phase에서 완벽하게 구현하지 않고 나중에 개선할 항목:

#### 1. 보안 관련 (Phase 3-8에서 개선)

```typescript
// TODO: Phase 3-8에서 API 연결 시 개선 필요
// - 현재: localStorage에 평문 비밀번호 저장 (Mock)
// - 개선: 서버에서 bcrypt 암호화, 클라이언트는 저장 안 함

// TODO: Phase 3-8에서 보안 강화
// - 현재: 비밀번호 변경 시 재로그인 불필요
// - 개선: 비밀번호 변경 후 모든 세션 무효화 + 재로그인 요구
```

#### 2. 프로필 이미지 (Phase 4)

```typescript
// TODO: Phase 4에서 추가
// - 프로필 이미지 업로드
// - 이미지 크롭/리사이즈
```

#### 3. 계정 삭제 (Phase 4)

```typescript
// TODO: Phase 4에서 추가
// - 계정 삭제 확인 Modal
// - 모든 데이터 삭제
// - 보호자 관계 해제
```

### TODO 주석 형식

```typescript
// TODO: Phase 3-8에서 API 연결 시 개선 예정
// 현재: localStorage 기반 Mock 데이터
// 개선: PATCH /api/members/me 실제 호출
```

---

## 작업 분해

### Task 1: features/member 모듈 생성 (1-2시간)

**목표**: Member 관련 API, 타입, 훅 구현

**파일 구조**:
```
src/features/member/
├── api/
│   ├── memberApi.ts
│   └── index.ts
├── hooks/
│   ├── useMember.ts
│   └── index.ts
├── types/
│   ├── member.types.ts
│   └── index.ts
└── index.ts
```

**체크리스트**:
- [ ] ProfileUpdateRequest, PasswordChangeRequest 타입 정의
- [ ] Mock memberApi (프로필 조회/수정, 비밀번호 변경)
- [ ] useMember 훅 구현
- [ ] localStorage 기반 데이터 관리

---

### Task 2: 설정 메뉴 페이지 구현 (1시간)

**목표**: 설정 항목 목록 화면

**파일**: `src/pages/settings/SettingsPage.tsx`

**체크리스트**:
- [ ] Layout + NavigationBar 사용
- [ ] 4개 설정 항목 Card로 표시
- [ ] 라우팅 설정 (/settings)

---

### Task 3: 내 정보 수정 페이지 (2-3시간)

**목표**: 이름, 전화번호 수정 기능

**파일**: `src/pages/settings/ProfilePage.tsx`

**체크리스트**:
- [ ] Input 컴포넌트로 폼 구성
- [ ] 현재 값 pre-fill
- [ ] 저장 시 Toast 표시
- [ ] AuthStore 업데이트로 즉시 반영

---

### Task 4: 알림 설정 페이지 (1-2시간)

**목표**: dailyCheckEnabled, 푸시 알림 설정

**파일**: `src/pages/settings/NotificationsPage.tsx`

**체크리스트**:
- [ ] dailyCheckEnabled 토글 버튼
- [ ] 변경 시 대시보드 자동 업데이트
- [ ] 푸시 알림 설정 (Phase 3-6 연동 준비)

---

### Task 5: 비밀번호 변경 페이지 (2시간)

**목표**: 비밀번호 변경 기능

**파일**: `src/pages/settings/PasswordPage.tsx`

**체크리스트**:
- [ ] 현재 비밀번호 입력
- [ ] 새 비밀번호 입력 (2회)
- [ ] 비밀번호 유효성 검사 (8자 이상)
- [ ] 변경 성공 시 Toast 표시

---

### Task 6: 라우팅 및 통합 테스트 (1시간)

**목표**: 라우트 설정 및 전체 플로우 테스트

**체크리스트**:
- [ ] routes.ts 확장 (SETTINGS_* 추가)
- [ ] router.tsx에 라우트 추가
- [ ] NavigationBar 설정 탭 동작 확인
- [ ] 통합 테스트 시나리오 실행

---

## Task별 구현 가이드

### Task 1: features/member 모듈 생성

#### 1.1 Member 타입 정의 (`member.types.ts`)

```typescript
/**
 * 프로필 수정 요청
 */
export interface ProfileUpdateRequest {
  name: string;
  phoneNumber?: string;
}

/**
 * 비밀번호 변경 요청
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 회원 설정
 */
export interface MemberSettings {
  dailyCheckEnabled: boolean;
  pushNotificationEnabled: boolean;
}
```

#### 1.2 Mock Member API (`memberApi.ts`)

```typescript
import type { User } from '@/features/auth/types';
import type { ProfileUpdateRequest, PasswordChangeRequest } from '../types';

/**
 * Mock 프로필 조회 (AuthStore에서 가져옴)
 */
export async function getProfile(): Promise<User> {
  // AuthStore에서 현재 사용자 정보 반환
  const authStorage = localStorage.getItem('auth-storage');
  if (!authStorage) {
    throw new Error('로그인이 필요합니다');
  }

  const { state } = JSON.parse(authStorage);
  return state.user;
}

/**
 * Mock 프로필 수정
 */
export async function updateProfile(data: ProfileUpdateRequest): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션

  const authStorage = localStorage.getItem('auth-storage');
  if (!authStorage) {
    throw new Error('로그인이 필요합니다');
  }

  const storage = JSON.parse(authStorage);
  const updatedUser = {
    ...storage.state.user,
    name: data.name,
    phoneNumber: data.phoneNumber,
  };

  storage.state.user = updatedUser;
  localStorage.setItem('auth-storage', JSON.stringify(storage));

  return updatedUser;
}

/**
 * Mock 비밀번호 변경
 */
export async function changePassword(data: PasswordChangeRequest): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock 사용자 데이터에서 현재 비밀번호 확인
  const authStorage = localStorage.getItem('auth-storage');
  if (!authStorage) {
    throw new Error('로그인이 필요합니다');
  }

  const storage = JSON.parse(authStorage);
  const username = storage.state.user.username;

  // Mock 사용자 목록에서 비밀번호 확인 (실제로는 서버에서 검증)
  const mockUsers = JSON.parse(localStorage.getItem('mock-users') || '{}');
  const user = mockUsers[username];

  if (user.password !== data.currentPassword) {
    throw new Error('현재 비밀번호가 일치하지 않습니다');
  }

  // 새 비밀번호로 업데이트
  mockUsers[username].password = data.newPassword;
  localStorage.setItem('mock-users', JSON.stringify(mockUsers));
}
```

#### 1.3 useMember 훅 (`useMember.ts`)

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProfile, updateProfile, changePassword } from '../api/memberApi';
import { useAuth } from '@/features/auth';
import { useToast } from '@/shared/hooks/useToast';
import type { ProfileUpdateRequest, PasswordChangeRequest } from '../types';

export function useMember() {
  const { setUser } = useAuth();
  const toast = useToast();

  // 프로필 조회
  const { data: profile, isLoading } = useQuery({
    queryKey: ['member', 'profile'],
    queryFn: getProfile,
  });

  // 프로필 수정
  const { mutateAsync: updateProfileMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser); // AuthStore 업데이트로 즉시 반영
      toast.success('저장되었습니다!');
    },
    onError: () => {
      toast.error('저장에 실패했습니다');
    },
  });

  // 비밀번호 변경
  const { mutateAsync: changePasswordMutation, isPending: isChangingPassword } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation,
    isUpdating,
    changePassword: changePasswordMutation,
    isChangingPassword,
  };
}
```

---

### Task 2: 설정 메뉴 페이지

#### 2.1 SettingsPage 컴포넌트 (`SettingsPage.tsx`)

```typescript
import { useNavigate } from 'react-router-dom';
import { Layout, Card } from '@/shared/components';
import { NavigationBar } from '@/shared/components/layout/NavigationBar';
import { ROUTES } from '@/shared/constants/routes';
import { User, Lock, Bell } from 'lucide-react';

/**
 * 설정 메뉴 페이지
 * - 내 정보 수정, 알림 설정, 비밀번호 변경 메뉴 제공
 */
export function SettingsPage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <User size={32} className="text-blue-600" />,
      title: '내 정보 수정',
      description: '이름, 전화번호를 변경합니다',
      path: ROUTES.SETTINGS_PROFILE,
    },
    {
      icon: <Bell size={32} className="text-blue-600" />,
      title: '알림 설정',
      description: '안부 메시지 및 푸시 알림 설정',
      path: ROUTES.SETTINGS_NOTIFICATIONS,
    },
    {
      icon: <Lock size={32} className="text-blue-600" />,
      title: '비밀번호 변경',
      description: '새 비밀번호로 변경합니다',
      path: ROUTES.SETTINGS_PASSWORD,
    },
  ];

  return (
    <>
      <Layout title="설정" showBack={true}>
        <div className="space-y-4 pb-24">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              padding="medium"
              onClick={() => navigate(item.path)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-base text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Layout>
      <NavigationBar />
    </>
  );
}
```

---

### Task 3: 내 정보 수정 페이지

#### 3.1 ProfilePage 컴포넌트 (`ProfilePage.tsx`)

```typescript
import { useState, useEffect } from 'react';
import { Layout, Input, Button } from '@/shared/components';
import { useMember } from '@/features/member';

/**
 * 내 정보 수정 페이지
 * - 이름, 전화번호 수정
 */
export function ProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useMember();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhoneNumber(profile.phoneNumber || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    await updateProfile({ name, phoneNumber });
  };

  if (isLoading) {
    return (
      <Layout title="내 정보 수정" showBack={true}>
        <div className="flex items-center justify-center py-12">
          <p className="text-xl text-gray-500">로딩 중...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="내 정보 수정" showBack={true}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="이름"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          required
        />

        <Input
          label="전화번호"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="010-1234-5678"
          helperText="'-' 없이 숫자만 입력하세요"
        />

        <Input
          label="이메일"
          type="email"
          value={profile?.email || ''}
          disabled
          helperText="이메일은 변경할 수 없습니다"
        />

        <Button
          type="submit"
          variant="primary"
          size="extra-large"
          fullWidth
          disabled={isUpdating}
        >
          {isUpdating ? '저장 중...' : '저장'}
        </Button>
      </form>
    </Layout>
  );
}
```

---

### Task 4: 알림 설정 페이지

#### 4.1 NotificationsPage 컴포넌트 (`NotificationsPage.tsx`)

```typescript
import { Layout, Button, Card } from '@/shared/components';
import { useAuth } from '@/features/auth';
import { useToast } from '@/shared/hooks/useToast';

/**
 * 알림 설정 페이지
 * - 안부 메시지 ON/OFF
 * - 푸시 알림 설정 (Phase 3-6 연동)
 */
export function NotificationsPage() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const handleToggleDailyCheck = () => {
    if (!user) return;

    const newValue = !user.dailyCheckEnabled;
    setUser({
      ...user,
      dailyCheckEnabled: newValue,
    });

    toast.success(
      newValue ? '안부 메시지를 받습니다' : '안부 메시지를 받지 않습니다'
    );
  };

  return (
    <Layout title="알림 설정" showBack={true}>
      <div className="space-y-6">
        {/* 안부 메시지 설정 */}
        <Card padding="medium">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">안부 메시지 받기</h3>
            <p className="text-base text-gray-600">
              매일 AI가 안부를 묻는 메시지를 보냅니다
            </p>
            <Button
              variant={user?.dailyCheckEnabled ? 'primary' : 'secondary'}
              size="large"
              fullWidth
              onClick={handleToggleDailyCheck}
            >
              {user?.dailyCheckEnabled ? 'ON (받고 있음)' : 'OFF (받지 않음)'}
            </Button>
          </div>
        </Card>

        {/* 푸시 알림 설정 (Phase 3-6 연동) */}
        <Card padding="medium" className="opacity-50">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">푸시 알림</h3>
            <p className="text-base text-gray-600">
              알림 기능은 곧 제공됩니다
            </p>
            <Button variant="secondary" size="large" fullWidth disabled>
              준비 중
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
```

---

### Task 5: 비밀번호 변경 페이지

#### 5.1 PasswordPage 컴포넌트 (`PasswordPage.tsx`)

```typescript
import { useState } from 'react';
import { Layout, Input, Button } from '@/shared/components';
import { useMember } from '@/features/member';

/**
 * 비밀번호 변경 페이지
 * - 현재 비밀번호 확인
 * - 새 비밀번호 입력 (2회)
 */
export function PasswordPage() {
  const { changePassword, isChangingPassword } = useMember();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (newPassword.length < 8) {
      setError('새 비밀번호는 8자 이상이어야 합니다');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // 성공 시 폼 초기화
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // 에러는 useMember에서 Toast로 표시
    }
  };

  return (
    <Layout title="비밀번호 변경" showBack={true}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="현재 비밀번호"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호 입력"
          required
        />

        <Input
          label="새 비밀번호"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="8자 이상 입력"
          helperText="8자 이상의 비밀번호를 입력하세요"
          required
        />

        <Input
          label="새 비밀번호 확인"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호 다시 입력"
          error={error}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="extra-large"
          fullWidth
          disabled={isChangingPassword}
        >
          {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
        </Button>
      </form>
    </Layout>
  );
}
```

---

## 테스트 계획

### 컴포넌트 단위 테스트

#### 프로필 수정 테스트
1. ✅ 현재 값이 pre-fill되는지 확인
2. ✅ 이름 변경 후 저장 → Toast 표시
3. ✅ 저장 후 대시보드 이동 → 헤더에 변경된 이름 표시
4. ✅ 이메일 필드는 disabled 상태

#### 알림 설정 테스트
1. ✅ dailyCheckEnabled ON/OFF 토글 작동
2. ✅ OFF 상태에서 대시보드 이동 → "내 안부 메시지" 섹션 숨김
3. ✅ ON 상태에서 대시보드 이동 → "내 안부 메시지" 섹션 표시

#### 비밀번호 변경 테스트
1. ✅ 현재 비밀번호 불일치 시 에러 메시지
2. ✅ 새 비밀번호 8자 미만 시 에러 메시지
3. ✅ 새 비밀번호 불일치 시 에러 메시지
4. ✅ 변경 성공 시 Toast 표시 및 폼 초기화

### 통합 테스트 시나리오

#### 시나리오 1: 프로필 수정 플로우

1. 김순자 로그인
2. NavigationBar에서 [설정] 탭 클릭
3. "내 정보 수정" 카드 클릭
4. 이름 "김순자" → "김순자님" 변경
5. 전화번호 "010-1234-5678" → "010-9876-5432" 변경
6. "저장" 버튼 클릭
7. Toast "저장되었습니다!" 표시 확인
8. [홈] 탭 클릭 → 대시보드 이동
9. 헤더에 "김순자님" 표시 확인

**예상 결과**:
- ✅ Toast 표시됨
- ✅ 대시보드 헤더 즉시 업데이트
- ✅ localStorage 업데이트 확인

---

#### 시나리오 2: 안부 메시지 OFF

1. 김순자 로그인 (dailyCheckEnabled: true)
2. 대시보드에서 "내 안부 메시지" 섹션 표시 확인
3. [설정] → "알림 설정" 클릭
4. "안부 메시지 받기" OFF 버튼 클릭
5. Toast "안부 메시지를 받지 않습니다" 표시 확인
6. [홈] 탭 클릭 → 대시보드 이동
7. "내 안부 메시지" 섹션 숨김 확인
8. "시작 가이드" 섹션 표시 확인

**예상 결과**:
- ✅ Toast 표시됨
- ✅ 대시보드 자동 업데이트
- ✅ dailyCheckEnabled: false로 변경 확인

---

#### 시나리오 3: 비밀번호 변경 플로우

1. 김순자 로그인 (비밀번호: "soonja123")
2. [설정] → "비밀번호 변경" 클릭
3. 현재 비밀번호: "wrongpassword" 입력
4. 새 비밀번호: "newpassword123" 입력
5. 새 비밀번호 확인: "newpassword123" 입력
6. "비밀번호 변경" 버튼 클릭
7. Toast "현재 비밀번호가 일치하지 않습니다" 표시 확인
8. 현재 비밀번호: "soonja123" (올바른 비밀번호) 입력
9. "비밀번호 변경" 버튼 클릭
10. Toast "비밀번호가 변경되었습니다" 표시 확인
11. 로그아웃
12. 새 비밀번호 "newpassword123"으로 로그인 성공 확인

**예상 결과**:
- ✅ 현재 비밀번호 검증 작동
- ✅ Toast 표시됨
- ✅ localStorage의 비밀번호 업데이트
- ✅ 새 비밀번호로 로그인 성공

---

## 완료 체크리스트

### 기능 완성도

- [ ] features/member 모듈 생성 완료
- [ ] 설정 메뉴 페이지 구현 완료
- [ ] 내 정보 수정 페이지 구현 완료
- [ ] 알림 설정 페이지 구현 완료
- [ ] 비밀번호 변경 페이지 구현 완료
- [ ] 라우팅 설정 완료 (ROUTES 확장)
- [ ] NavigationBar 설정 탭 동작 확인

### 코드 품질

- [ ] TypeScript 빌드 에러 0건
- [ ] ESLint 경고 0건
- [ ] 모든 컴포넌트 타입 정의 완료
- [ ] TODO 주석 추가 (API 연결 관련)
- [ ] JSDoc 주석 작성

### 사용자 경험

- [ ] Toast로 모든 피드백 통일
- [ ] 프로필 수정 후 즉시 반영
- [ ] dailyCheckEnabled 변경 시 대시보드 자동 업데이트
- [ ] 비밀번호 변경 시 현재 비밀번호 검증
- [ ] 노인 친화적 크기 (폰트 18px+, 터치 영역 60px+)
- [ ] NavigationBar 설정 탭 하이라이트

### 테스트

- [ ] 프로필 수정 테스트 통과
- [ ] 알림 설정 테스트 통과
- [ ] 비밀번호 변경 테스트 통과
- [ ] 시나리오 1 (프로필 수정 플로우) 통과
- [ ] 시나리오 2 (안부 메시지 OFF) 통과
- [ ] 시나리오 3 (비밀번호 변경 플로우) 통과
- [ ] 빌드 성공 (npm run build)

### 문서화

- [ ] Phase 3-5 세부 계획서 작성 완료
- [ ] PHASE3_EXECUTION_PLAN.md 업데이트
- [ ] 컴포넌트 JSDoc 주석 작성

---

## 마무리

Phase 3-5 (설정 관리) 완료 시:

1. **PHASE3_EXECUTION_PLAN.md 업데이트**
   - Phase 3-5 상태를 "완료"로 변경
   - 진행률 업데이트 (71% → 86%)

2. **다음 Phase 준비**
   - Phase 3-6 (알림 기능): NavigationBar, EmptyState, Toast 재사용

3. **공통 컴포넌트 활용 확인**
   ```typescript
   // Phase 3-7 공통 컴포넌트 재사용
   - Toast: 저장 성공/실패 메시지
   - Modal: 변경사항 확인 (필요 시)
   - NavigationBar: 설정 탭 활성화
   - Input: 폼 입력 필드
   - Button: 저장, 변경 버튼
   ```

4. **기술 부채 해결 완료**
   - ✅ 설정 관리 플로우 완성
   - ✅ AuthStore 연동으로 실시간 반영
   - ⏳ API 연결은 Phase 3-8에서 일괄 처리

---

**📅 작성일**: 2025-10-21
**✏️ 작성자**: Claude Code
**🔄 버전**: 1.0.0
**📍 Phase**: 3-5 (설정 관리)
**✅ 의존성**: Phase 3-1, 3-2, 3-3, 3-4, 3-7 완료
**🎯 목표**: 설정 관리 기능 완성 및 Phase 3-6 준비
