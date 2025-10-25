import { useNavigate } from 'react-router-dom';
import { Layout, Button, Card } from '@/shared/components';
import { GuardianCard } from '@/shared/components/business/GuardianCard';
import { useGuardian } from '@/features/guardian';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 보호자 관리 페이지
 * - Journey 3 Phase 2: 보호자 관리 화면
 * - 현재 보호자 표시 (있을 경우)
 * - 보호자 찾기 버튼
 */
export function GuardiansPage() {
  const navigate = useNavigate();
  const { currentGuardian } = useGuardian();

  const handleSearchGuardian = () => {
    navigate(ROUTES.GUARDIANS_SEARCH);
  };

  return (
    <Layout title="보호자 관리" showBack={true}>
      <div className="space-y-6 p-4">
        {/* 현재 보호자 */}
        {currentGuardian ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">현재 보호자</h2>
            <GuardianCard guardian={currentGuardian} />
          </div>
        ) : (
          <Card padding="large" className="text-center">
            <div className="space-y-4">
              <div className="text-5xl">👨‍👩‍👧‍👦</div>
              <h2 className="text-2xl font-bold text-gray-900">등록된 보호자가 없습니다</h2>
              <p className="text-lg text-gray-600">
                보호자를 등록하면
                <br />
                이상 징후 발생 시<br />
                알림을 받을 수 있어요
              </p>
            </div>
          </Card>
        )}

        {/* 보호자 찾기 버튼 */}
        {!currentGuardian && (
          <Button variant="primary" size="extra-large" fullWidth onClick={handleSearchGuardian}>
            보호자 찾기
          </Button>
        )}

        {/* 보호자 변경/제거 (Phase 3-5에서 구현) */}
        {currentGuardian && (
          <div className="space-y-3">
            <Button
              variant="secondary"
              size="extra-large"
              fullWidth
              onClick={handleSearchGuardian}
            >
              보호자 변경
            </Button>
            <Button
              variant="secondary"
              size="large"
              fullWidth
              onClick={() => {
                /* Phase 3-5에서 구현 */
                alert('보호자 제거 기능은 Phase 3-5에서 구현됩니다');
              }}
            >
              보호자 제거
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
