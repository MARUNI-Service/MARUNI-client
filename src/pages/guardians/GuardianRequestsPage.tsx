import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Card } from '@/shared/components';
import { useGuardian } from '@/features/guardian';
import type { GuardianRequest } from '@/features/guardian';
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
  const { getGuardianRequests, acceptGuardianRequest, rejectGuardianRequest, isLoading } =
    useGuardian();

  const [requests, setRequests] = useState<GuardianRequest[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const data = await getGuardianRequests();
    setRequests(data);
  };

  const handleAccept = async (requestId: number) => {
    try {
      await acceptGuardianRequest(requestId);

      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('보호자 요청을 수락했습니다!');

      await loadRequests(); // 목록 새로고침

      // 더 이상 요청이 없으면 자동으로 대시보드 이동
      // (여러 요청 연속 처리 가능, 모두 처리하면 자동 이동으로 UX 개선)
      const remainingRequests = await getGuardianRequests();
      if (remainingRequests.length === 0) {
        // 모든 요청 처리 완료 → 대시보드로 이동하여 변경된 메인 화면 확인
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 1500); // Toast 확인 시간 제공 (Phase 3-7에서 Toast duration으로 대체)
      }
    } catch (error) {
      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('수락에 실패했습니다');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await rejectGuardianRequest(requestId);

      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('보호자 요청을 거절했습니다');

      await loadRequests(); // 목록 새로고침

      // 거절 시에도 동일한 로직 적용
      const remainingRequests = await getGuardianRequests();
      if (remainingRequests.length === 0) {
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 1500);
      }
    } catch (error) {
      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('거절에 실패했습니다');
    }
  };

  return (
    <Layout title="보호자 요청" showBack={true}>
      <div className="space-y-6 p-4">
        {/* 요청 목록 */}
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} padding="medium" className="space-y-4">
                <div>
                  <div className="text-xl font-bold text-gray-900">{request.seniorName}</div>
                  <div className="text-base text-gray-600">{request.seniorEmail}</div>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-lg text-gray-700">
                    {request.seniorName}님이 회원님을
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
