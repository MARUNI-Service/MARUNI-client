import type { User } from '@/features/auth/types';
import type { ProfileUpdateRequest, PasswordChangeRequest } from '../types';
import { storage } from '@/shared/services/storage';

/**
 * Mock 프로필 조회 (AuthStore에서 가져옴)
 *
 * TODO: Phase 3-8에서 API 연결 시 개선 예정
 * 현재: localStorage 기반 Mock 데이터
 * 개선: GET /api/members/me 실제 호출
 */
export async function getProfile(): Promise<User> {
  const authStorage = storage.getAuth();
  if (!authStorage) {
    throw new Error('로그인이 필요합니다');
  }

  const { state } = JSON.parse(authStorage);
  return state.user;
}

/**
 * Mock 프로필 수정
 *
 * TODO: Phase 3-8에서 API 연결 시 개선 예정
 * 현재: localStorage 기반 Mock 데이터
 * 개선: PATCH /api/members/me 실제 호출
 */
export async function updateProfile(data: ProfileUpdateRequest): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션

  const authStorage = storage.getAuth();
  if (!authStorage) {
    throw new Error('로그인이 필요합니다');
  }

  const storageData = JSON.parse(authStorage);
  const updatedUser = {
    ...storageData.state.user,
    name: data.name,
    phoneNumber: data.phoneNumber,
  };

  storageData.state.user = updatedUser;
  storage.setAuth(JSON.stringify(storageData));

  return updatedUser;
}

/**
 * Mock 비밀번호 변경
 *
 * TODO: Phase 3-8에서 API 연결 시 개선 예정
 * 현재: localStorage에 평문 비밀번호 저장 (Mock)
 * 개선: PATCH /api/members/me/password 실제 호출
 *      서버에서 bcrypt 암호화, 클라이언트는 저장 안 함
 *
 * TODO: Phase 3-8에서 보안 강화
 * 현재: 비밀번호 변경 시 재로그인 불필요
 * 개선: 비밀번호 변경 후 모든 세션 무효화 + 재로그인 요구
 */
export async function changePassword(data: PasswordChangeRequest): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock 사용자 데이터에서 현재 비밀번호 확인
  const authStorage = storage.getAuth();
  if (!authStorage) {
    throw new Error('로그인이 필요합니다');
  }

  const storageData = JSON.parse(authStorage);
  const username = storageData.state.user.username;

  // Mock 사용자 목록에서 비밀번호 확인 (실제로는 서버에서 검증)
  const mockUsers = JSON.parse(storage.getMockUsers() || '{}');
  const user = mockUsers[username];

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다');
  }

  if (user.password !== data.currentPassword) {
    throw new Error('현재 비밀번호가 일치하지 않습니다');
  }

  // 새 비밀번호로 업데이트
  mockUsers[username].password = data.newPassword;
  storage.setMockUsers(JSON.stringify(mockUsers));
}
