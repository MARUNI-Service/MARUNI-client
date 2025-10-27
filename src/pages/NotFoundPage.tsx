import { useNavigate } from 'react-router-dom';
import { Layout, Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 404 페이지 컴포넌트
 * 존재하지 않는 페이지 접근 시 표시
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Layout title="페이지를 찾을 수 없어요">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-2">
            찾으시는 페이지가 없어요
          </p>
          <p className="text-lg text-gray-500">
            주소를 다시 확인해주세요
          </p>
        </div>

        <div className="space-y-4 w-full max-w-md">
          <Button
            variant="primary"
            size="extra-large"
            fullWidth
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            홈으로 가기
          </Button>

          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={() => navigate(-1)}
          >
            이전 페이지로
          </Button>
        </div>
      </div>
    </Layout>
  );
}
