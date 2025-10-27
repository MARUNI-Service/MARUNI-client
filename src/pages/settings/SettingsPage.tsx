import { useNavigate } from 'react-router-dom';
import { Layout, Card, Button } from '@/shared/components';
import { NavigationBar } from '@/shared/components/layout/NavigationBar';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/features/auth/hooks';
import { User, Lock, Bell, LogOut, Users } from 'lucide-react';

/**
 * 설정 메뉴 페이지
 * - 내 정보 수정, 알림 설정, 비밀번호 변경 메뉴 제공
 * - 로그아웃 기능
 */
export function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const menuItems = [
    {
      icon: <User size={32} className="text-blue-600" />,
      title: '내 정보 수정',
      description: '이름, 전화번호를 변경합니다',
      path: ROUTES.SETTINGS_PROFILE,
    },
    {
      icon: <Users size={32} className="text-blue-600" />,
      title: '보호자 관리',
      description: '보호자 등록 및 변경',
      path: ROUTES.GUARDIANS,
    },
    {
      icon: <Bell size={32} className="text-blue-600" />,
      title: '알림 설정',
      description: '안부 메시지 및 푸시 알림 설정',
      path: ROUTES.SETTINGS_NOTIFICATIONS,
    },
    {
      icon: <Lock size={32} className="text-blue-600" />,
      title: '비밀번호 변경',
      description: '새 비밀번호로 변경합니다',
      path: ROUTES.SETTINGS_PASSWORD,
    },
  ];

  return (
    <>
      <Layout title="설정" showBack={false}>
        <div className="space-y-4 pb-24">
          {/* 설정 메뉴 */}
          {menuItems.map((item) => (
            <Card
              key={item.path}
              padding="medium"
              onClick={() => navigate(item.path)}
              className="cursor-pointer hover:bg-gray-50 transition-colors min-h-[100px] w-full"
            >
              <div className="flex items-center gap-4 h-full">
                {item.icon}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-base text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}

          {/* 로그아웃 버튼 */}
          <div className="pt-4">
            <Button
              variant="secondary"
              size="extra-large"
              fullWidth
              onClick={handleLogout}
            >
              <div className="flex items-center justify-center gap-3">
                <LogOut size={24} />
                <span>로그아웃</span>
              </div>
            </Button>
          </div>
        </div>
      </Layout>
      <NavigationBar />
    </>
  );
}
