import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * QueryClient 생성 (싱글톤)
 * - staleTime: 데이터가 fresh 상태로 유지되는 시간 (5분)
 * - gcTime: 캐시가 메모리에 유지되는 시간 (10분)
 * - retry: 실패 시 재시도 횟수
 * - refetchOnWindowFocus: 윈도우 포커스 시 자동 재요청 (노인 사용자 고려하여 비활성화)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
      retry: 1, // 실패 시 1번만 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    },
    mutations: {
      retry: 0, // 뮤테이션은 재시도하지 않음
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * TanStack Query Provider
 * - QueryClient 제공
 * - 개발 모드에서 devtools 활성화
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 모드에서만 devtools 표시 */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
