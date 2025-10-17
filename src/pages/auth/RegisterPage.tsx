import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Input, Button } from '@/shared/components';
import { useAuth } from '@/features/auth/hooks';

/**
 * 회원가입 페이지
 * - Journey 1 Phase 2: 회원가입 구현
 * - Mock 데이터로 회원가입 처리 (Phase 3-8에서 API 연결)
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 🔴 Phase 3-2: Mock 회원가입
      // Phase 3-8에서 실제 API 호출로 변경
      await signup({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });

      // 회원가입 성공 → 온보딩 페이지로 이동
      navigate('/onboarding');
    } catch (error) {
      setErrors({ submit: '회원가입에 실패했습니다' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Layout title="회원가입" showBack={true}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto py-8 px-4">
        {/* 이메일 */}
        <div>
          <Input
            id="email"
            label="이메일"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@email.com"
            error={errors.email}
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        {/* 이름 */}
        <div>
          <Input
            id="name"
            label="이름"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="홍길동"
            error={errors.name}
            disabled={isLoading}
            autoComplete="name"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <Input
            id="password"
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="8자 이상"
            error={errors.password}
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>

        {/* 전화번호 (선택) */}
        <div>
          <Input
            id="phoneNumber"
            label="전화번호"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="010-1234-5678"
            helperText="(선택)"
            disabled={isLoading}
            autoComplete="tel"
          />
        </div>

        {/* 제출 에러 */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-lg text-red-700 text-center">{errors.submit}</p>
          </div>
        )}

        {/* 가입 버튼 */}
        <Button type="submit" variant="primary" size="extra-large" fullWidth disabled={isLoading}>
          {isLoading ? '가입 중...' : '가입하기'}
        </Button>

        {/* 로그인 링크 */}
        <p className="text-center text-lg text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </form>
    </Layout>
  );
}
