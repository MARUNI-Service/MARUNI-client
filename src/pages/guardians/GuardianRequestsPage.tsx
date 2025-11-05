import { useNavigate } from 'react-router-dom';
import { Layout, Button, Card } from '@/shared/components';
import { useGuardian } from '@/features/guardian';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 보호자 요청 목록 페이지
 * - Journey 4 Phase 4: 보호자 요청 수락/거절
 * - 받은 요청 목록 표시
 * - 수락/거절 버튼
 * - 모든 요청 처리 후 대시보드 자동 이동
 */
export function GuardianRequestsPage() {
  const navigate = useNavigate();
  const { requests, acceptGuardianRequest, rejectGuardianRequest, isLoading } = useGuardian();

  const handleAccept = async (requestId: number) => {
    try {
      await acceptGuardianRequest(requestId);

      // 더 이상 요청이 없으면 자동으로 대시보드 이동
      // (여러 요청 연속 처리 가능, 모두 처리하면 자동 이동으로 UX 개선)
      if (requests.length === 1) {
        // 마지막 요청 처리 완료 → 대시보드로 이동하여 변경된 메인 화면 확인
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 3000); // Toast 확인 시간 제공 (default 3초)
      }
    } catch {
      // 에러는 hook에서 toast로 처리됨
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await rejectGuardianRequest(requestId);

      // 거절 시에도 동일한 로직 적용
      if (requests.length === 1) {
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 3000); // Toast 확인 시간 제공 (default 3초)
      }
    } catch {
      // 에러는 hook에서 toast로 처리됨
    }
  };

  return (
    <Layout title="보호자 요청" showBack={true} onBack={() => navigate(-1)}>
      <div className="space-y-6 p-4">
        {/* 요청 목록 */}
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} padding="medium" className="space-y-4">
                <div>
                  <div className="text-xl font-bold text-gray-900">{request.requester.name}</div>
                  <div className="text-base text-gray-600">{request.requester.email}</div>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-lg text-gray-700">
                    {request.requester.name}님이 회원님을
                    <br />
                    보호자로 등록하길 원합니다
                  </p>
                  <p className="text-base text-gray-600">수락하시겠어요?</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="large"
                    fullWidth
                    onClick={() => handleReject(request.id)}
                    disabled={isLoading}
                  >
                    거절
                  </Button>
                  <Button
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={() => handleAccept(request.id)}
                    disabled={isLoading}
                  >
                    수락
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="large" className="text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">받은 요청이 없습니다</h2>
            <p className="text-lg text-gray-600">
              보호자 요청을 받으면
              <br />
              여기에 표시됩니다
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
