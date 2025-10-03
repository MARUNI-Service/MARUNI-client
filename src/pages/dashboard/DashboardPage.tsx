import { Layout, Card, Button } from '@/shared/components';

/**
 * 대시보드 페이지 (껍데기 - Phase 3에서 확장 예정)
 * 현재는 기본 컴포넌트 테스트로 활용
 */
export function DashboardPage() {
  return (
    <Layout title="마루니 홈" showBack={false}>
      <div className="space-y-6">
        <Card padding="large">
          <h2 className="text-2xl font-bold mb-4">안녕하세요!</h2>
          <p className="text-lg text-gray-600 mb-4">
            오늘 기분은 어떠세요?
          </p>
          <Button variant="primary" size="extra-large" fullWidth>
            AI와 대화하기
          </Button>
        </Card>

        <Card padding="large">
          <h3 className="text-xl font-semibold mb-3">오늘의 안부</h3>
          <p className="text-lg text-gray-600">
            아직 오늘 안부를 확인하지 않았어요
          </p>
        </Card>

        <Card padding="medium">
          <p className="text-center text-gray-500">
            대시보드는 Phase 3에서 완성됩니다
          </p>
        </Card>
      </div>
    </Layout>
  );
}
