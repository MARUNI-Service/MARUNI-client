// Types (Phase 3-8: 서버 API 구조에 맞춘 타입)
export type { SendMessageRequest, MessageDto, ConversationResponseDto } from './types';

// Hooks (Phase 3-8: TanStack Query 기반 훅)
export { useConversation } from './hooks/useConversation';

// Store (Phase 3-8: Zustand Store)
export { useConversationStore } from './store';

// API (Phase 3-8: 실제 API)
export { sendMessage, getHistory } from './api';
