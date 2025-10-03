import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';
import { App } from './app';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 에러 로깅 (향후 서버 전송 등)
        console.error('Global error caught:', error, errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
