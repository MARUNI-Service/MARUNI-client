import { Layout, Button, Card } from '@/shared/components';
import { useAuth } from '@/features/auth';
import { useToast } from '@/shared/hooks/useToast';

/**
 * 알림 설정 페이지
 * - 안부 메시지 ON/OFF
 * - 푸시 알림 설정 (Phase 3-6 연동)
 */
export function NotificationsPage() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const handleToggleDailyCheck = () => {
    if (!user) return;

    const newValue = !user.dailyCheckEnabled;
    setUser({
      ...user,
      dailyCheckEnabled: newValue,
    });

    toast.success(
      newValue ? '안부 메시지를 받습니다' : '안부 메시지를 받지 않습니다'
    );
  };

  return (
    <Layout title="알림 설정" showBack={true}>
      <div className="space-y-6">
        {/* 안부 메시지 설정 */}
        <Card padding="medium">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">안부 메시지 받기</h3>
            <p className="text-base text-gray-600">
              매일 AI가 안부를 묻는 메시지를 보냅니다
            </p>
            <Button
              variant={user?.dailyCheckEnabled ? 'primary' : 'secondary'}
              size="large"
              fullWidth
              onClick={handleToggleDailyCheck}
            >
              {user?.dailyCheckEnabled ? 'ON (받고 있음)' : 'OFF (받지 않음)'}
            </Button>
          </div>
        </Card>

        {/* 푸시 알림 설정 (Phase 3-6 연동) */}
        <Card padding="medium" className="opacity-50">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">푸시 알림</h3>
            <p className="text-base text-gray-600">
              알림 기능은 곧 제공됩니다
            </p>
            <Button variant="secondary" size="large" fullWidth disabled>
              준비 중
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
