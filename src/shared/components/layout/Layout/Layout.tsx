import type { LayoutProps } from './Layout.types';
import { Button } from '../../ui/Button';

/**
 * 노인 친화적 페이지 레이아웃 컴포넌트
 *
 * @features
 * - Header/Main 영역으로 명확한 구조 분리
 * - 노인 친화적 큰 버튼과 제목
 * - 뒤로가기 기능 지원
 * - 모바일 우선 반응형 디자인
 * - 최대 너비 제한으로 가독성 향상
 *
 * @example
 * // 기본 사용법
 * <Layout title="안부 확인">
 *   <div>메인 콘텐츠</div>
 * </Layout>
 *
 * // 뒤로가기 포함
 * <Layout
 *   title="설정"
 *   showBack
 *   onBack={() => navigate(-1)}
 * >
 *   <div>설정 내용</div>
 * </Layout>
 */
export function Layout({
  title,
  showBack = false,
  onBack,
  children,
  className = ''
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Header - 노인 친화적 높이와 패딩 */}
      <header className="bg-blue-50 border-b border-blue-100 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* 뒤로가기 버튼 */}
          {showBack && (
            <Button
              variant="secondary"
              size="large"
              onClick={onBack}
              aria-label="뒤로 가기"
            >
              ← 뒤로
            </Button>
          )}

          {/* 제목 */}
          {title && (
            <h1 className={`text-2xl font-bold text-gray-900 text-center ${showBack ? 'flex-1' : ''}`}>
              {title}
            </h1>
          )}

          {/* 뒤로가기 버튼이 있을 때 레이아웃 균형을 위한 빈 공간 */}
          {showBack && <div className="w-[120px]" />}
        </div>
      </header>

      {/* Main Content - 충분한 패딩과 최대 너비 제한 */}
      <main className="max-w-md mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}