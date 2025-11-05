import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Input, Button } from '@/shared/components';
import { useMember } from '@/features/member';

/**
 * 내 정보 수정 페이지
 * Phase 3-8: 이름, 이메일, 비밀번호 수정
 */
export function ProfilePage() {
  const navigate = useNavigate();
  const { profile, isLoading, updateProfile, isUpdating } = useMember();

  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');

  useEffect(() => {
    if (profile) {
      setMemberName(profile.memberName);
      setMemberEmail(profile.memberEmail);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberName.trim() || !memberEmail.trim() || !memberPassword.trim()) {
      return;
    }

    await updateProfile({
      memberName,
      memberEmail,
      memberPassword,
    });
  };

  if (isLoading) {
    return (
      <Layout title="내 정보 수정" showBack={true} onBack={() => navigate(-1)}>
        <div className="flex items-center justify-center py-12">
          <p className="text-xl text-gray-500">로딩 중...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="내 정보 수정" showBack={true} onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="이름"
          type="text"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          placeholder="홍길동"
          required
        />

        <Input
          label="이메일"
          type="email"
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
          placeholder="user@example.com"
          required
        />

        <Input
          label="비밀번호"
          type="password"
          value={memberPassword}
          onChange={(e) => setMemberPassword(e.target.value)}
          placeholder="새 비밀번호 입력"
          helperText="정보 수정을 위해 비밀번호를 입력하세요"
          required
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
