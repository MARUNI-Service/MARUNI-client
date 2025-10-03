import { useNavigate } from 'react-router-dom';
import { Layout, Card, Button } from '@/shared/components';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 대시보드 페이지 (껍데기 - Phase 3에서 확장 예정)
 * 현재는 기본 컴포넌트 테스트 및 인증 플로우 검증
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Layout title="마루니 홈" showBack={false}>
      <div className="space-y-6">
        {/* 사용자 정보 카드 */}
        <Card padding="large">
          <h2 className="text-2xl font-bold mb-4">
            안녕하세요, {user?.name}님!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            오늘 기분은 어떠세요?
          </p>
          <div className="space-y-3">
            <Button variant="primary" size="extra-large" fullWidth>
              AI와 대화하기
            </Button>
            <Button
              variant="secondary"
              size="large"
              fullWidth
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </div>
        </Card>

        {/* 오늘의 안부 카드 */}
        <Card padding="large">
          <h3 className="text-xl font-semibold mb-3">오늘의 안부</h3>
          <p className="text-lg text-gray-600">
            아직 오늘 안부를 확인하지 않았어요
          </p>
        </Card>

        {/* Phase 3 안내 */}
        <Card padding="medium">
          <p className="text-center text-gray-500">
            대시보드는 Phase 3에서 완성됩니다
          </p>
        </Card>
      </div>
    </Layout>
  );
}
