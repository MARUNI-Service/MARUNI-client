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
