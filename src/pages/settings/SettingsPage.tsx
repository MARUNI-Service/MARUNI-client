import { useNavigate } from 'react-router-dom';
import { Layout, Card } from '@/shared/components';
import { NavigationBar } from '@/shared/components/layout/NavigationBar';
import { ROUTES } from '@/shared/constants/routes';
import { User, Lock, Bell } from 'lucide-react';

/**
 * 설정 메뉴 페이지
 * - 내 정보 수정, 알림 설정, 비밀번호 변경 메뉴 제공
 */
export function SettingsPage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <User size={32} className="text-blue-600" />,
      title: '내 정보 수정',
      description: '이름, 전화번호를 변경합니다',
      path: ROUTES.SETTINGS_PROFILE,
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
      <Layout title="설정" showBack={true}>
        <div className="space-y-4 pb-24">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              padding="medium"
              onClick={() => navigate(item.path)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-base text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Layout>
      <NavigationBar />
    </>
  );
}
