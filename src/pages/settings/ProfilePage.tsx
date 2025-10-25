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
