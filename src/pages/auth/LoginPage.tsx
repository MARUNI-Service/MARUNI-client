import { Layout, Card } from '@/shared/components';

/**
 * 로그인 페이지 (껍데기 - Day 4에서 구현 예정)
 */
export function LoginPage() {
  return (
    <Layout title="MARUNI 로그인">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card padding="large" className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
          <p className="text-center text-gray-600 text-lg">
            로그인 폼은 Day 4에서 구현됩니다
          </p>
        </Card>
      </div>
    </Layout>
  );
}
