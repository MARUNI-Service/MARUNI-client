import { useNavigate } from 'react-router-dom';
import { Layout, Card } from '@/shared/components';
import { NavigationBar } from '@/shared/components/layout/NavigationBar';
import { useAuth } from '@/features/auth';
import { MessageCard } from '@/shared/components/business/MessageCard';
import { GuardianCard } from '@/shared/components/business/GuardianCard';
import { ManagedMemberCard } from '@/shared/components/business/ManagedMemberCard';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 대시보드 페이지
 * - Phase 3-1: 역할별 동적 화면 구성
 * - dailyCheckEnabled, guardian, managedMembers에 따라 섹션 표시
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 모든 섹션이 비어있는지 확인
  const hasNoSections =
    !user?.dailyCheckEnabled &&
    !user?.guardian &&
    (!user?.managedMembers || user.managedMembers.length === 0);

  return (
    <>
      <Layout title="마루니 홈" showBack={false}>
        <div className="space-y-6 pb-24">
          {/* 환영 메시지 */}
          <div className="text-center py-4">
            <h1 className="text-3xl font-bold text-gray-900">안녕하세요, {user?.memberName}님!</h1>
          </div>

          {/* 섹션 1: 내 안부 메시지 */}
          {user?.dailyCheckEnabled && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">📬 내 안부 메시지</h2>
              <MessageCard />
            </section>
          )}

          {/* 섹션 2: 내 보호자 */}
          {user?.guardian && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">👨‍👩‍👧 내 보호자</h2>
              <div onClick={() => navigate(ROUTES.GUARDIANS)} className="cursor-pointer">
                <GuardianCard guardian={user.guardian} />
              </div>
            </section>
          )}

          {/* 섹션 3: 내가 돌보는 사람들 */}
          {user?.managedMembers && user.managedMembers.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">👨‍👩‍👧 내가 돌보는 사람들</h2>
              <div className="space-y-4">
                {user.managedMembers.map((member) => (
                  <ManagedMemberCard key={member.memberId} member={member} />
                ))}
              </div>
            </section>
          )}

          {/* 섹션 4: 시작 가이드 (모든 섹션이 없을 때) */}
          {hasNoSections && (
            <section>
              <Card padding="large">
                <h2 className="text-2xl font-semibold mb-4 text-center">🎯 MARUNI 시작하기</h2>
                <div className="space-y-4 text-lg text-gray-700">
                  <p>안부 메시지를 받으시겠어요?</p>
                  <p>돌보는 분이 계신가요?</p>
                  <p className="text-base text-gray-500 text-center mt-6">
                    설정 메뉴에서 시작할 수 있습니다
                  </p>
                </div>
              </Card>
            </section>
          )}
        </div>
      </Layout>
      <NavigationBar />
    </>
  );
}
