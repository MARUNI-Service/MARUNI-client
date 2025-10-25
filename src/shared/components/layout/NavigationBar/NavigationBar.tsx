import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Bell, Settings } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import type { NavigationItem } from './NavigationBar.types';

const NAV_ITEMS: NavigationItem[] = [
  {
    path: ROUTES.DASHBOARD,
    label: '홈',
    icon: <Home size={32} />,
  },
  {
    path: ROUTES.CONVERSATION,
    label: '대화',
    icon: <MessageCircle size={32} />,
  },
  {
    path: ROUTES.NOTIFICATIONS,
    label: '알림',
    icon: <Bell size={32} />,
  },
  {
    path: ROUTES.SETTINGS,
    label: '설정',
    icon: <Settings size={32} />,
  },
];

/**
 * 하단 네비게이션 바
 * - [홈] [대화] [알림] [설정] 4개 탭
 * - 현재 페이지 하이라이트
 * - Lucide 아이콘 사용 (CLAUDE.md 준수)
 */
export function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      role="navigation"
      aria-label="메인 네비게이션"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-[72px] px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center
                w-full h-full
                transition-colors relative
                ${isActive ? 'text-blue-600' : 'text-gray-500'}
                hover:text-blue-600
                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
              `}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* 아이콘 */}
              <div className="mb-1">{item.icon}</div>

              {/* 라벨 */}
              <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>

              {/* 활성 표시 */}
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-blue-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
