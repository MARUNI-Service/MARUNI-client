import { Layout, Card, Button, Input, LoadingSpinner } from '@/shared/components';
import { useLoginForm } from '@/features/auth/hooks';

/**
 * 로그인 페이지 (MVP 단순화 버전)
 * - 노인 친화적 UI (큰 버튼, 큰 글씨, 명확한 메시지)
 * - Phase 3-1 ~ 3-7: Mock 로그인 (username만 입력)
 */
export function LoginPage() {
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <Layout title="MARUNI 로그인">
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Card padding="large" className="w-full max-w-md">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              환영합니다
            </h1>
            <p className="text-lg text-gray-600">
              MARUNI에 로그인하세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <div className="space-y-6">
            {/* 사용자 이름 입력 */}
            <div>
              <Input
                id="username"
                label="사용자 이름"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="soonja, younghee, cheolsu, newuser"
                disabled={isLoading}
                autoComplete="username"
                helperText="테스트용: soonja, younghee, cheolsu, newuser"
              />
            </div>

            {/* 비밀번호 입력 - MVP에서는 사용 안 함 */}
            <div>
              <Input
                id="password"
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="(Mock 로그인에서는 불필요)"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {/* API 에러 메시지 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-lg text-red-700 text-center">
                  {error}
                </p>
              </div>
            )}

            {/* 로그인 버튼 */}
            <Button
              variant="primary"
              size="extra-large"
              fullWidth
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="small" />
                  <span>로그인 중...</span>
                </div>
              ) : (
                '로그인'
              )}
            </Button>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-8 text-center">
            <p className="text-base text-gray-500">
              처음 사용하시나요? 관리자에게 문의하세요.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
