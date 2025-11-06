import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Layout, Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants/routes';

/**
 * 라우터 에러 페이지 컴포넌트
 *
 * 라우터 에러 발생 시 표시되는 페이지
 * - 개발 환경: 에러 상세 정보 표시
 * - 프로덕션: 사용자 친화적 메시지만 표시
 *
 * @example
 * // router.tsx에서 사용
 * {
 *   path: '/',
 *   errorElement: <ErrorPage />,
 *   children: [...]
 * }
 */
export function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

  // 에러 정보 파싱
  let errorMessage = '알 수 없는 오류가 발생했습니다.';
  let errorStatus: number | null = null;
  let errorDetails: string | null = null;

  if (isRouteErrorResponse(error)) {
    // React Router의 표준 에러 응답
    errorStatus = error.status;
    errorMessage = error.statusText || errorMessage;
    errorDetails = error.data?.message || error.data;
  } else if (error instanceof Error) {
    // JavaScript 에러
    errorMessage = error.message;
    errorDetails = error.stack || null;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  // 개발 환경에서 콘솔에 에러 로깅
  if (import.meta.env.DEV) {
    console.error('🔥 Router Error:', {
      error,
      message: errorMessage,
      status: errorStatus,
      details: errorDetails,
    });
  }

  return (
    <Layout title="오류가 발생했어요">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        {/* 에러 아이콘 */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* 에러 상태 코드 (있을 경우) */}
          {errorStatus && (
            <h1 className="text-6xl font-bold text-red-500 mb-4">
              {errorStatus}
            </h1>
          )}

          {/* 에러 메시지 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            문제가 발생했어요
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            {errorMessage}
          </p>
          <p className="text-base text-gray-500">
            잠시 후 다시 시도해주세요
          </p>
        </div>

        {/* 개발 환경: 에러 상세 정보 */}
        {import.meta.env.DEV && errorDetails && (
          <div className="mb-8 w-full max-w-2xl">
            <details className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <summary className="text-sm font-semibold text-red-800 cursor-pointer hover:text-red-900">
                🔍 개발 모드 - 에러 상세 정보 (클릭하여 펼치기)
              </summary>
              <pre className="mt-4 text-xs font-mono text-red-700 overflow-x-auto whitespace-pre-wrap break-all">
                {errorDetails}
              </pre>
            </details>
          </div>
        )}

        {/* 액션 버튼 */}
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

          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={() => window.location.reload()}
          >
            페이지 새로고침
          </Button>
        </div>
      </div>
    </Layout>
  );
}
