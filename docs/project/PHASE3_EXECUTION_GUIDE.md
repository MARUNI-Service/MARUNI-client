# Phase 3 실행 가이드: 핵심 기능 구현

> **MARUNI 클라이언트 Phase 3 상세 실행 계획서**
> **목표**: AI 대화, 안부 확인, 보호자 관리 핵심 기능 구현 (2주 완료)
> **진행률**: 65% → 85%

## 🎯 Phase 3 개요

### 핵심 목표
- **AI 대화 시스템** - 노인과 AI의 자연스러운 대화 기능
- **안부 확인 시스템** - 일일 안부 체크 및 응답 기능
- **보호자 관리 시스템** - 보호자 등록 및 알림 설정
- **대시보드 통합** - 모든 기능을 통합한 메인 화면

### 완료 시 달성 결과
- AI와 실시간 대화 가능
- 매일 안부 확인 및 간편 응답
- 보호자 추가/관리 및 알림 설정
- 전체 기능이 통합된 대시보드
- TypeScript 타입 에러 0개
- 노인 사용자 테스트 통과

### Phase 3 아키텍처 개요
```
┌─────────────────────────────────────────────┐
│           Pages (화면 조합)                  │
│  ┌──────────┬──────────────┬─────────────┐ │
│  │Dashboard │ Conversation │  Guardians  │ │
│  └──────────┴──────────────┴─────────────┘ │
├─────────────────────────────────────────────┤
│         Features (비즈니스 로직)             │
│  ┌──────────────┬──────────────┬─────────┐ │
│  │conversation/ │ daily-check/ │guardian/│ │
│  │  - API       │   - API      │  - API  │ │
│  │  - Store     │   - Store    │  - Store│ │
│  │  - Hooks     │   - Hooks    │  - Hooks│ │
│  │  - Components│   - Components│ - Comps │ │
│  └──────────────┴──────────────┴─────────┘ │
├─────────────────────────────────────────────┤
│      Shared (재사용 컴포넌트 + 유틸)        │
│  - Button, Input, Card, Layout              │
│  - API Client, Storage Utils                │
└─────────────────────────────────────────────┘
```

---

## ✅ 시작 전 준비사항 체크리스트

### Phase 2 완료 확인
- [ ] React Router 설정 완료 및 페이지 이동 동작
- [ ] API 클라이언트 및 JWT 인증 시스템 완성
- [ ] 로그인 → 대시보드 전체 플로우 동작
- [ ] TanStack Query Provider 설정 완료
- [ ] TypeScript 컴파일 에러 없음

### 개발 환경 확인
- [ ] 개발 서버 정상 동작 (`npm run dev`)
- [ ] 서버 API 문서 확인 (conversation, daily-check, guardian)
- [ ] 서버가 로컬에서 실행 중 (localhost:8080)

### 필수 문서 숙지
- [ ] [USER_FLOW_DESIGN.md](../architecture/USER_FLOW_DESIGN.md) - 사용자 플로우 이해
- [ ] [COMPONENT_DESIGN_GUIDE.md](../development/COMPONENT_DESIGN_GUIDE.md) - 컴포넌트 설계 원칙
- [ ] [TECHNICAL_ARCHITECTURE.md](../architecture/TECHNICAL_ARCHITECTURE.md) - 시스템 아키텍처

### 서버 API 엔드포인트 확인
```typescript
// 확인 필요한 API 목록
- POST   /api/conversations         // 대화 시작
- POST   /api/conversations/{id}/messages  // 메시지 전송
- GET    /api/conversations/{id}    // 대화 조회
- POST   /api/daily-checks          // 안부 체크 생성
- GET    /api/daily-checks/today    // 오늘 안부 조회
- GET    /api/guardians             // 보호자 목록
- POST   /api/guardians             // 보호자 추가
- PUT    /api/guardians/{id}        // 보호자 수정
- DELETE /api/guardians/{id}        // 보호자 삭제
```

---

## 📅 Week 1: AI 대화 시스템 (7일)

### Day 1: Conversation Feature 기본 구조 + ConfirmDialog 컴포넌트

**⏰ 예상 소요 시간**: 7-8시간

**🎯 목표**: features/conversation 모듈 구조 및 타입 정의, ConfirmDialog 공용 컴포넌트 추가

**📋 상세 작업**:

1. **폴더 구조 생성** (30분)
   ```
   src/features/conversation/
   ├── api/
   │   ├── conversationApi.ts
   │   └── index.ts
   ├── components/
   │   ├── ChatMessage/
   │   ├── MessageInput/
   │   ├── EmotionBadge/
   │   └── index.ts
   ├── hooks/
   │   ├── useConversation.ts
   │   ├── useSendMessage.ts
   │   └── index.ts
   ├── store/
   │   ├── conversationStore.ts
   │   └── index.ts
   ├── types/
   │   ├── conversation.types.ts
   │   └── index.ts
   └── index.ts

   src/shared/components/ui/
   ├── ConfirmDialog/
   │   ├── ConfirmDialog.tsx
   │   └── index.ts
   ```

2. **타입 정의** (2시간)
   ```typescript
   // types/conversation.types.ts

   // 메시지 타입
   export interface Message {
     id: number;
     conversationId: number;
     content: string;
     sender: 'USER' | 'AI';
     timestamp: string;
     emotionScore?: number;  // 감정 점수 (0-100)
     emotionLabel?: string;  // 감정 라벨 (긍정/중립/부정)
   }

   // 대화 세션 타입
   export interface Conversation {
     id: number;
     memberId: number;
     startedAt: string;
     endedAt?: string;
     status: 'ACTIVE' | 'ENDED';
     messages: Message[];
     averageEmotionScore?: number;
   }

   // 메시지 전송 요청
   export interface SendMessageRequest {
     conversationId: number;
     content: string;
   }

   // 메시지 전송 응답
   export interface SendMessageResponse {
     message: Message;
     aiResponse: Message;
   }

   // 대화 시작 응답
   export interface StartConversationResponse {
     conversation: Conversation;
     initialMessage: Message;
   }
   ```

3. **API 클라이언트 구현** (2-3시간)
   ```typescript
   // api/conversationApi.ts
   import apiClient from '@/shared/api/client';
   import { API_ENDPOINTS } from '@/shared/constants/api';
   import type {
     Conversation,
     Message,
     SendMessageRequest,
     SendMessageResponse,
     StartConversationResponse,
   } from '../types/conversation.types';

   export const conversationApi = {
     // 대화 시작
     async startConversation(): Promise<StartConversationResponse> {
       const response = await apiClient.post<StartConversationResponse>(
         API_ENDPOINTS.CONVERSATION.START
       );
       return response.data;
     },

     // 대화 조회
     async getConversation(conversationId: number): Promise<Conversation> {
       const response = await apiClient.get<Conversation>(
         API_ENDPOINTS.CONVERSATION.BASE + `/${conversationId}`
       );
       return response.data;
     },

     // 메시지 전송
     async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
       const response = await apiClient.post<SendMessageResponse>(
         API_ENDPOINTS.CONVERSATION.MESSAGES(request.conversationId),
         { content: request.content }
       );
       return response.data;
     },

     // 대화 종료
     async endConversation(conversationId: number): Promise<void> {
       await apiClient.post(
         API_ENDPOINTS.CONVERSATION.END(conversationId)
       );
     },

     // 최근 대화 목록
     async getRecentConversations(limit: number = 10): Promise<Conversation[]> {
       const response = await apiClient.get<Conversation[]>(
         API_ENDPOINTS.CONVERSATION.RECENT,
         { params: { limit } }
       );
       return response.data;
     },
   };
   ```

4. **API 상수 추가** (30분)
   ```typescript
   // shared/constants/api.ts 업데이트
   export const API_ENDPOINTS = {
     // ... 기존 AUTH 등
     CONVERSATION: {
       BASE: '/api/conversations',
       START: '/api/conversations',
       MESSAGES: (id: number) => `/api/conversations/${id}/messages`,
       END: (id: number) => `/api/conversations/${id}/end`,
       RECENT: '/api/conversations/recent',
     },
   } as const;
   ```

5. **ConfirmDialog 컴포넌트 구현** (2-3시간)
   ```typescript
   // shared/components/ui/ConfirmDialog/ConfirmDialog.tsx
   import { Dialog } from '@headlessui/react';
   import { Button } from '../Button';

   interface ConfirmDialogProps {
     isOpen: boolean;
     onClose: () => void;
     onConfirm: () => void;
     title: string;
     message: string;
     confirmText?: string;
     cancelText?: string;
     confirmVariant?: 'primary' | 'danger';
   }

   export function ConfirmDialog({
     isOpen,
     onClose,
     onConfirm,
     title,
     message,
     confirmText = '확인',
     cancelText = '취소',
     confirmVariant = 'primary',
   }: ConfirmDialogProps) {
     const handleConfirm = () => {
       onConfirm();
       onClose();
     };

     return (
       <Dialog open={isOpen} onClose={onClose} className="relative z-50">
         {/* 배경 오버레이 */}
         <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

         {/* 중앙 컨테이너 */}
         <div className="fixed inset-0 flex items-center justify-center p-4">
           <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-2xl shadow-xl p-6">
             {/* 제목 */}
             <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
               {title}
             </Dialog.Title>

             {/* 메시지 */}
             <Dialog.Description className="text-lg text-gray-700 mb-6 leading-relaxed">
               {message}
             </Dialog.Description>

             {/* 버튼 그룹 */}
             <div className="flex gap-3">
               <Button
                 variant="secondary"
                 size="extra-large"
                 fullWidth
                 onClick={onClose}
               >
                 {cancelText}
               </Button>
               <Button
                 variant={confirmVariant}
                 size="extra-large"
                 fullWidth
                 onClick={handleConfirm}
               >
                 {confirmText}
               </Button>
             </div>
           </Dialog.Panel>
         </div>
       </Dialog>
     );
   }
   ```

   ```typescript
   // shared/components/ui/ConfirmDialog/index.ts
   export { ConfirmDialog } from './ConfirmDialog';
   ```

   ```typescript
   // shared/components/index.ts 업데이트
   export { Button } from './ui/Button';
   export { Card } from './ui/Card';
   export { Input } from './ui/Input';
   export { LoadingSpinner } from './ui/LoadingSpinner';
   export { Layout } from './layout/Layout';
   export { ConfirmDialog } from './ui/ConfirmDialog';  // 추가
   ```

**🔍 중간 점검 (Day 1 종료 시)**:
- [ ] 폴더 구조 완성
- [ ] 모든 타입 정의 완료
- [ ] conversationApi 함수 정의 완료
- [ ] TypeScript 컴파일 에러 없음
- [ ] API 상수 추가 완료
- [ ] ConfirmDialog 컴포넌트 구현 완료
- [ ] Dialog가 열리고 닫히는 동작 확인
- [ ] 큰 버튼 (60px+) 터치 영역 확인

**✅ Day 1 완료 기준**:
- [ ] features/conversation 기본 구조 완성
- [ ] 타입 정의 및 API 함수 작성 완료
- [ ] ConfirmDialog 컴포넌트 정상 동작
- [ ] `npm run build` 성공
- [ ] 다음 단계 준비 완료

---

### Day 2: Conversation Hooks 및 Store

**⏰ 예상 소요 시간**: 5-7시간

**🎯 목표**: TanStack Query 기반 데이터 페칭 훅 및 Zustand 스토어 구현

**📋 상세 작업**:

1. **Conversation Store 구현** (2시간)
   ```typescript
   // store/conversationStore.ts
   import { create } from 'zustand';
   import type { Conversation, Message } from '../types/conversation.types';

   interface ConversationState {
     currentConversation: Conversation | null;
     isConversationActive: boolean;
   }

   interface ConversationActions {
     setCurrentConversation: (conversation: Conversation | null) => void;
     addMessage: (message: Message) => void;
     clearConversation: () => void;
   }

   type ConversationStore = ConversationState & ConversationActions;

   export const useConversationStore = create<ConversationStore>((set) => ({
     // 초기 상태
     currentConversation: null,
     isConversationActive: false,

     // 현재 대화 설정
     setCurrentConversation: (conversation) => {
       set({
         currentConversation: conversation,
         isConversationActive: conversation?.status === 'ACTIVE',
       });
     },

     // 메시지 추가
     addMessage: (message) => {
       set((state) => {
         if (!state.currentConversation) return state;

         return {
           currentConversation: {
             ...state.currentConversation,
             messages: [...state.currentConversation.messages, message],
           },
         };
       });
     },

     // 대화 초기화
     clearConversation: () => {
       set({
         currentConversation: null,
         isConversationActive: false,
       });
     },
   }));
   ```

2. **useConversation 훅 구현** (2-3시간)
   ```typescript
   // hooks/useConversation.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { conversationApi } from '../api/conversationApi';
   import { useConversationStore } from '../store/conversationStore';

   export function useConversation() {
     const queryClient = useQueryClient();
     const {
       currentConversation,
       setCurrentConversation,
       clearConversation,
     } = useConversationStore();

     // 대화 시작 mutation
     const startConversation = useMutation({
       mutationFn: conversationApi.startConversation,
       onSuccess: (data) => {
         setCurrentConversation(data.conversation);
         queryClient.invalidateQueries({ queryKey: ['conversations'] });
       },
     });

     // 대화 종료 mutation
     const endConversation = useMutation({
       mutationFn: (conversationId: number) =>
         conversationApi.endConversation(conversationId),
       onSuccess: () => {
         clearConversation();
         queryClient.invalidateQueries({ queryKey: ['conversations'] });
       },
     });

     // 최근 대화 목록 조회
     const { data: recentConversations, isLoading } = useQuery({
       queryKey: ['conversations', 'recent'],
       queryFn: () => conversationApi.getRecentConversations(10),
       staleTime: 5 * 60 * 1000, // 5분
     });

     return {
       currentConversation,
       isConversationActive: currentConversation?.status === 'ACTIVE',
       recentConversations,
       isLoading,
       startConversation: startConversation.mutate,
       endConversation: endConversation.mutate,
       isStarting: startConversation.isPending,
       isEnding: endConversation.isPending,
     };
   }
   ```

3. **useSendMessage 훅 구현 (에러 처리 강화)** (2-3시간)
   ```typescript
   // hooks/useSendMessage.ts
   import { useMutation } from '@tanstack/react-query';
   import { conversationApi } from '../api/conversationApi';
   import { useConversationStore } from '../store/conversationStore';
   import type { SendMessageRequest } from '../types/conversation.types';

   export function useSendMessage() {
     const { addMessage } = useConversationStore();

     const sendMessage = useMutation({
       mutationFn: (request: SendMessageRequest) =>
         conversationApi.sendMessage(request),
       onMutate: async (variables) => {
         // Optimistic update: 사용자 메시지 즉시 표시
         const optimisticMessage = {
           id: Date.now(), // 임시 ID
           conversationId: variables.conversationId,
           content: variables.content,
           sender: 'USER' as const,
           timestamp: new Date().toISOString(),
         };

         addMessage(optimisticMessage);

         return { optimisticMessage };
       },
       onSuccess: (data, variables, context) => {
         // 서버 응답으로 메시지 교체 및 AI 응답 추가
         // 실제로는 store에서 임시 메시지를 제거하고 실제 메시지로 교체
         if (data.aiResponse) {
           addMessage(data.aiResponse);
         }
       },
       onError: (error, variables, context) => {
         // 에러 발생 시 optimistic update 롤백
         console.error('Failed to send message:', error);

         // 사용자에게 에러 알림 표시
         // ConversationPage에서 error 상태를 확인하여 UI로 표시
         // 예: Toast 메시지 또는 에러 메시지 표시
       },
     });

     return {
       sendMessage: sendMessage.mutate,
       isSending: sendMessage.isPending,
       error: sendMessage.error,
       isError: sendMessage.isError,
     };
   }
   ```

4. **index.ts Export 파일 작성** (30분)
   ```typescript
   // features/conversation/index.ts

   // API
   export { conversationApi } from './api/conversationApi';

   // Hooks
   export { useConversation } from './hooks/useConversation';
   export { useSendMessage } from './hooks/useSendMessage';

   // Store
   export { useConversationStore } from './store/conversationStore';

   // Types
   export * from './types/conversation.types';

   // Components (다음 단계에서 추가 예정)
   ```

**🔍 중간 점검 (Day 2 종료 시)**:
- [ ] conversationStore 정상 동작 확인
- [ ] useConversation 훅 타입 에러 없음
- [ ] useSendMessage 훅 구현 완료
- [ ] Optimistic update 로직 작동 확인
- [ ] 에러 처리 로직 (isError, error) 추가 완료
- [ ] TypeScript 컴파일 성공

**✅ Day 2 완료 기준**:
- [ ] TanStack Query 기반 훅 구현 완료
- [ ] Zustand 스토어 정상 동작
- [ ] 메시지 전송 실패 처리 준비 완료
- [ ] `npm run build` 성공
- [ ] 다음 단계(UI 컴포넌트) 준비 완료

---

### Day 3-4: 채팅 UI 컴포넌트

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: ChatMessage, MessageInput, EmotionBadge 컴포넌트 구현

#### Day 3: ChatMessage 컴포넌트

**📋 상세 작업** (5-6시간):

1. **ChatMessage 컴포넌트 구현** (3-4시간)
   ```typescript
   // components/ChatMessage/ChatMessage.tsx
   import { Message } from '../../types/conversation.types';
   import { EmotionBadge } from '../EmotionBadge';

   interface ChatMessageProps {
     message: Message;
   }

   export function ChatMessage({ message }: ChatMessageProps) {
     const isUser = message.sender === 'USER';
     const isAI = message.sender === 'AI';

     // 시간 포맷팅
     const formattedTime = new Date(message.timestamp).toLocaleTimeString('ko-KR', {
       hour: '2-digit',
       minute: '2-digit',
     });

     return (
       <div
         className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
       >
         <div
           className={`max-w-[75%] ${
             isUser ? 'order-2' : 'order-1'
           }`}
         >
           {/* 발신자 표시 */}
           <div
             className={`text-base font-medium mb-2 ${
               isUser ? 'text-right text-blue-700' : 'text-left text-gray-700'
             }`}
           >
             {isUser ? '나' : 'AI'}
           </div>

           {/* 메시지 말풍선 */}
           <div
             className={`
               rounded-2xl px-6 py-4
               ${
                 isUser
                   ? 'bg-blue-600 text-white rounded-tr-sm'
                   : 'bg-gray-100 text-gray-900 rounded-tl-sm'
               }
             `}
           >
             <p className="text-lg leading-relaxed break-words">
               {message.content}
             </p>
           </div>

           {/* 시간 및 감정 표시 */}
           <div
             className={`flex items-center gap-2 mt-2 ${
               isUser ? 'justify-end' : 'justify-start'
             }`}
           >
             <span className="text-sm text-gray-500">{formattedTime}</span>
             {isAI && message.emotionScore !== undefined && (
               <EmotionBadge
                 score={message.emotionScore}
                 label={message.emotionLabel}
               />
             )}
           </div>
         </div>
       </div>
     );
   }
   ```

2. **EmotionBadge 컴포넌트 구현** (1-2시간)
   ```typescript
   // components/EmotionBadge/EmotionBadge.tsx

   interface EmotionBadgeProps {
     score?: number;  // 0-100
     label?: string;  // '긍정', '중립', '부정'
   }

   export function EmotionBadge({ score = 50, label }: EmotionBadgeProps) {
     // 점수에 따른 색상 결정
     const getEmotionColor = (score: number) => {
       if (score >= 70) return 'bg-green-100 text-green-700 border-green-300';
       if (score >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
       return 'bg-orange-100 text-orange-700 border-orange-300';
     };

     // 점수에 따른 이모지
     const getEmotionEmoji = (score: number) => {
       if (score >= 70) return '😊';
       if (score >= 40) return '😐';
       return '😔';
     };

     const displayLabel = label || (score >= 70 ? '긍정' : score >= 40 ? '중립' : '부정');

     return (
       <span
         className={`
           inline-flex items-center gap-1
           px-3 py-1 rounded-full
           text-sm font-medium border
           ${getEmotionColor(score)}
         `}
         aria-label={`감정 상태: ${displayLabel}`}
       >
         <span>{getEmotionEmoji(score)}</span>
         <span>{displayLabel}</span>
       </span>
     );
   }
   ```

**🔍 중간 점검 (Day 3 종료 시)**:
- [ ] ChatMessage 컴포넌트 렌더링 확인
- [ ] 사용자/AI 메시지 구분 표시
- [ ] EmotionBadge 정상 표시
- [ ] 노인 친화적 크기 (18px+ 폰트)
- [ ] 접근성 속성 적용

#### Day 4: MessageInput 컴포넌트

**📋 상세 작업** (5-6시간):

1. **MessageInput 컴포넌트 구현** (4-5시간)
   ```typescript
   // components/MessageInput/MessageInput.tsx
   import { useState, FormEvent, KeyboardEvent } from 'react';
   import { Button } from '@/shared/components';

   interface MessageInputProps {
     onSend: (message: string) => void;
     disabled?: boolean;
     placeholder?: string;
   }

   export function MessageInput({
     onSend,
     disabled = false,
     placeholder = '메시지를 입력하세요...',
   }: MessageInputProps) {
     const [message, setMessage] = useState('');

     const handleSubmit = (e: FormEvent) => {
       e.preventDefault();

       const trimmedMessage = message.trim();
       if (!trimmedMessage || disabled) return;

       onSend(trimmedMessage);
       setMessage(''); // 전송 후 입력창 초기화
     };

     const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
       // Enter 키로 전송 (Shift+Enter는 줄바꿈)
       if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(e as unknown as FormEvent);
       }
     };

     return (
       <form
         onSubmit={handleSubmit}
         className="border-t border-gray-200 bg-white p-4"
       >
         <div className="flex gap-3 items-end max-w-4xl mx-auto">
           {/* 텍스트 입력 영역 */}
           <div className="flex-1">
             <textarea
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder={placeholder}
               disabled={disabled}
               rows={3}
               className="
                 w-full px-4 py-3
                 text-lg leading-relaxed
                 border-2 border-gray-300 rounded-lg
                 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-300
                 disabled:bg-gray-100 disabled:cursor-not-allowed
                 resize-none
               "
               aria-label="메시지 입력"
             />
             <p className="text-sm text-gray-500 mt-1">
               Enter: 전송 | Shift+Enter: 줄바꿈
             </p>
           </div>

           {/* 전송 버튼 */}
           <Button
             type="submit"
             variant="primary"
             size="large"
             disabled={disabled || !message.trim()}
             aria-label="메시지 전송"
           >
             전송
           </Button>
         </div>
       </form>
     );
   }
   ```

2. **컴포넌트 통합 테스트** (1시간)
   ```typescript
   // features/conversation/components/index.ts
   export { ChatMessage } from './ChatMessage/ChatMessage';
   export { MessageInput } from './MessageInput/MessageInput';
   export { EmotionBadge } from './EmotionBadge/EmotionBadge';
   ```

   ```typescript
   // features/guardian/components/index.ts
   export { GuardianCard } from './GuardianCard/GuardianCard';
   export { GuardianForm } from './GuardianForm/GuardianForm';
   ```

**🔍 중간 점검 (Day 4 종료 시)**:
- [ ] MessageInput 정상 동작
- [ ] Enter 키로 전송 확인
- [ ] 전송 후 입력창 초기화
- [ ] disabled 상태 정상 동작
- [ ] 노인 친화적 크기 (큰 입력창, 큰 버튼)

**✅ Day 3-4 완료 기준**:
- [ ] ChatMessage, MessageInput, EmotionBadge 완성
- [ ] 모든 컴포넌트 정상 렌더링
- [ ] TypeScript 타입 에러 없음
- [ ] 접근성 속성 적용 완료
- [ ] `npm run build` 성공

---

### Day 5-6: ConversationPage 구현

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: AI 대화 페이지 전체 구현 및 실시간 대화 기능

**📋 상세 작업**:

1. **ConversationPage 컴포넌트 생성** (4-5시간)
   ```typescript
   // pages/conversation/ConversationPage.tsx
   import { useEffect, useRef, useState } from 'react';
   import { Layout, Button, LoadingSpinner, ConfirmDialog } from '@/shared/components';
   import {
     ChatMessage,
     MessageInput,
     useConversation,
     useSendMessage,
   } from '@/features/conversation';
   import { useNavigate } from 'react-router-dom';
   import { ROUTES } from '@/shared/constants/routes';

   export function ConversationPage() {
     const navigate = useNavigate();
     const messagesEndRef = useRef<HTMLDivElement>(null);
     const [showEndConfirm, setShowEndConfirm] = useState(false);

     const {
       currentConversation,
       isConversationActive,
       startConversation,
       endConversation,
       isStarting,
     } = useConversation();

     const { sendMessage, isSending, isError, error } = useSendMessage();

     // 대화 시작 (페이지 로드 시 자동)
     useEffect(() => {
       if (!currentConversation && !isStarting) {
         startConversation();
       }
     }, [currentConversation, isStarting, startConversation]);

     // 새 메시지 도착 시 스크롤
     useEffect(() => {
       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
     }, [currentConversation?.messages]);

     const handleSendMessage = (content: string) => {
       if (!currentConversation) return;

       sendMessage({
         conversationId: currentConversation.id,
         content,
       });
     };

     const handleEndConversation = () => {
       if (!currentConversation) return;
       setShowEndConfirm(true);
     };

     const confirmEndConversation = () => {
       if (!currentConversation) return;
       endConversation(currentConversation.id);
       navigate(ROUTES.DASHBOARD);
     };

     // 로딩 상태
     if (isStarting || !currentConversation) {
       return (
         <Layout title="AI 대화">
           <div className="flex items-center justify-center min-h-[60vh]">
             <LoadingSpinner size="large" />
             <p className="text-xl text-gray-600 mt-4">대화를 준비하고 있어요...</p>
           </div>
         </Layout>
       );
     }

     return (
       <Layout
         title="AI 대화"
         showBack
         onBack={() => navigate(ROUTES.DASHBOARD)}
       >
         <div className="flex flex-col h-[calc(100vh-120px)]">
           {/* 대화 종료 버튼 */}
           <div className="mb-4">
             <Button
               variant="secondary"
               size="large"
               onClick={handleEndConversation}
             >
               대화 종료
             </Button>
           </div>

           {/* 메시지 목록 */}
           <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 rounded-lg">
             {currentConversation.messages.length === 0 ? (
               <div className="text-center text-gray-500 mt-8">
                 <p className="text-xl">안녕하세요! 무엇을 도와드릴까요?</p>
               </div>
             ) : (
               <>
                 {currentConversation.messages.map((message) => (
                   <ChatMessage key={message.id} message={message} />
                 ))}
                 <div ref={messagesEndRef} />
               </>
             )}

             {/* 전송 중 표시 */}
             {isSending && (
               <div className="flex justify-start mb-6">
                 <div className="bg-gray-100 rounded-2xl px-6 py-4">
                   <LoadingSpinner size="small" />
                 </div>
               </div>
             )}
           </div>

           {/* 메시지 입력 */}
           <div className="mt-4">
             <MessageInput
               onSend={handleSendMessage}
               disabled={isSending || !isConversationActive}
               placeholder="메시지를 입력하세요..."
             />

             {/* 전송 실패 에러 메시지 */}
             {isError && (
               <div
                 className="mt-3 p-4 bg-red-50 border-2 border-red-300 rounded-lg"
                 role="alert"
               >
                 <p className="text-lg text-red-700 font-semibold">
                   ⚠️ 메시지 전송에 실패했습니다
                 </p>
                 <p className="text-base text-red-600 mt-1">
                   네트워크 연결을 확인하고 다시 시도해주세요.
                 </p>
               </div>
             )}
           </div>
         </div>

         {/* 대화 종료 확인 다이얼로그 */}
         <ConfirmDialog
           isOpen={showEndConfirm}
           onClose={() => setShowEndConfirm(false)}
           onConfirm={confirmEndConversation}
           title="대화 종료"
           message="정말 대화를 종료하시겠습니까?"
           confirmText="종료"
           cancelText="취소"
           confirmVariant="primary"
         />
       </Layout>
     );
   }
   ```

2. **라우터에 ConversationPage 추가** (30분)
   ```typescript
   // app/router.tsx 업데이트
   import { ConversationPage } from '@/pages/conversation/ConversationPage';

   // 보호된 라우트에 추가
   {
     path: ROUTES.CONVERSATION,
     element: (
       <ProtectedRoute>
         <ConversationPage />
       </ProtectedRoute>
     ),
   }
   ```

3. **전체 플로우 테스트** (2-3시간)
   - 대화 시작 → 메시지 전송 → AI 응답 → 대화 종료
   - Optimistic update 동작 확인
   - 에러 처리 확인
   - 로딩 상태 확인

4. **성능 최적화** (1-2시간)
   ```typescript
   // ChatMessage 메모이제이션
   export const ChatMessage = React.memo<ChatMessageProps>(({ message }) => {
     // ... 구현
   });

   // 메시지 목록 가상화 (선택사항, 메시지 많을 때)
   // react-window 또는 react-virtual 사용 고려
   ```

**🔍 중간 점검 (Day 5-6 종료 시)**:
- [ ] ConversationPage 정상 렌더링
- [ ] 대화 시작/종료 플로우 동작
- [ ] ConfirmDialog로 종료 확인 (confirm() 대체)
- [ ] 메시지 전송 및 수신 정상
- [ ] 메시지 전송 실패 시 에러 메시지 표시
- [ ] 자동 스크롤 동작
- [ ] 로딩/에러 상태 처리

**✅ Day 5-6 완료 기준**:
- [ ] 전체 대화 플로우 완성
- [ ] 실시간 메시지 전송/수신 동작
- [ ] ConfirmDialog를 통한 사용자 확인
- [ ] 전송 실패 에러 UI 표시
- [ ] UI/UX 노인 친화적
- [ ] TypeScript 에러 0개
- [ ] `npm run build` 성공

---

### Day 7: Week 1 통합 테스트 및 검증

**⏰ 예상 소요 시간**: 4-6시간

**🎯 목표**: AI 대화 시스템 전체 검증 및 품질 확인

**📋 상세 작업**:

1. **기능 테스트** (2시간)
   - [ ] 대화 시작 정상 동작
   - [ ] 메시지 전송 및 AI 응답 수신
   - [ ] 감정 분석 결과 표시
   - [ ] 대화 종료 및 상태 초기화
   - [ ] 최근 대화 목록 조회

2. **에러 케이스 테스트** (1-2시간)
   - [ ] 네트워크 에러 처리
   - [ ] 타임아웃 처리
   - [ ] 빈 메시지 전송 방지
   - [ ] 대화 없이 메시지 전송 방지

3. **접근성 검증** (1시간)
   - [ ] 키보드 네비게이션 (Tab, Enter)
   - [ ] 스크린 리더 호환성
   - [ ] aria-label 적절성
   - [ ] 색상 대비 확인

4. **코드 품질 검사** (1시간)
   ```bash
   # TypeScript 컴파일
   npm run build

   # ESLint 검사
   npm run lint

   # 불필요한 console.log 제거
   ```

5. **문서 업데이트** (1시간)
   - CURRENT_STATUS.md 업데이트 (Week 1 완료)
   - COMPONENT_CATALOG.md에 새 컴포넌트 추가

**🔍 Week 1 최종 점검**:
- [ ] AI 대화 기능 100% 동작
- [ ] 모든 컴포넌트 노인 친화적 기준 충족
- [ ] TypeScript/ESLint 통과
- [ ] 접근성 기준 충족
- [ ] 문서 업데이트 완료

**✅ Week 1 완료 기준**:
- [ ] features/conversation 모듈 완성
- [ ] ConversationPage 완전 동작
- [ ] 전체 품질 기준 충족
- [ ] Week 2 준비 완료

---

## 📅 Week 2: 안부 확인 & 보호자 관리 (7일)

### Day 8-9: Daily Check Feature

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: 안부 확인 기능 구현

#### Day 8: DailyCheck 기본 구조 및 API

**📋 상세 작업** (5-6시간):

1. **폴더 구조 생성** (30분)
   ```
   src/features/daily-check/
   ├── api/
   │   ├── dailyCheckApi.ts
   │   └── index.ts
   ├── components/
   │   ├── DailyCheckCard/
   │   ├── QuickResponse/
   │   └── index.ts
   ├── hooks/
   │   ├── useDailyCheck.ts
   │   └── index.ts
   ├── types/
   │   ├── dailyCheck.types.ts
   │   └── index.ts
   └── index.ts
   ```

2. **타입 정의** (1시간)
   ```typescript
   // types/dailyCheck.types.ts

   // 안부 확인 상태
   export type DailyCheckStatus = 'PENDING' | 'COMPLETED' | 'SKIPPED';

   // 응답 타입
   export type ResponseType = 'GOOD' | 'NORMAL' | 'BAD' | 'CONVERSATION';

   // 안부 확인 엔티티
   export interface DailyCheck {
     id: number;
     memberId: number;
     checkDate: string;
     status: DailyCheckStatus;
     responseType?: ResponseType;
     emotionScore?: number;
     note?: string;
     completedAt?: string;
     createdAt: string;
   }

   // 안부 확인 생성 요청
   export interface CreateDailyCheckRequest {
     responseType: ResponseType;
     note?: string;
   }

   // 안부 확인 응답
   export interface DailyCheckResponse {
     dailyCheck: DailyCheck;
     message: string;
   }
   ```

3. **API 구현** (2-3시간)
   ```typescript
   // api/dailyCheckApi.ts
   import apiClient from '@/shared/api/client';
   import { API_ENDPOINTS } from '@/shared/constants/api';
   import type {
     DailyCheck,
     CreateDailyCheckRequest,
     DailyCheckResponse,
   } from '../types/dailyCheck.types';

   export const dailyCheckApi = {
     // 오늘의 안부 확인 조회
     async getTodayCheck(): Promise<DailyCheck | null> {
       try {
         const response = await apiClient.get<DailyCheck>(
           `${API_ENDPOINTS.DAILY_CHECK.BASE}/today`
         );
         return response.data;
       } catch (error: any) {
         if (error.response?.status === 404) {
           return null; // 오늘 안부 확인 없음
         }
         throw error;
       }
     },

     // 안부 확인 생성
     async createDailyCheck(
       request: CreateDailyCheckRequest
     ): Promise<DailyCheckResponse> {
       const response = await apiClient.post<DailyCheckResponse>(
         API_ENDPOINTS.DAILY_CHECK.BASE,
         request
       );
       return response.data;
     },

     // 최근 안부 확인 목록
     async getRecentChecks(days: number = 7): Promise<DailyCheck[]> {
       const response = await apiClient.get<DailyCheck[]>(
         `${API_ENDPOINTS.DAILY_CHECK.BASE}/recent`,
         { params: { days } }
       );
       return response.data;
     },

     // 안부 확인 통계
     async getCheckStats(period: 'week' | 'month' = 'week') {
       const response = await apiClient.get(
         `${API_ENDPOINTS.DAILY_CHECK.BASE}/stats`,
         { params: { period } }
       );
       return response.data;
     },
   };
   ```

4. **useDailyCheck 훅 구현** (1-2시간)
   ```typescript
   // hooks/useDailyCheck.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { dailyCheckApi } from '../api/dailyCheckApi';
   import type { CreateDailyCheckRequest } from '../types/dailyCheck.types';

   export function useDailyCheck() {
     const queryClient = useQueryClient();

     // 오늘의 안부 확인 조회
     const {
       data: todayCheck,
       isLoading,
       refetch,
     } = useQuery({
       queryKey: ['dailyCheck', 'today'],
       queryFn: dailyCheckApi.getTodayCheck,
       staleTime: 1 * 60 * 1000, // 1분
     });

     // 안부 확인 생성
     const createCheck = useMutation({
       mutationFn: (request: CreateDailyCheckRequest) =>
         dailyCheckApi.createDailyCheck(request),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['dailyCheck'] });
       },
     });

     // 최근 안부 목록
     const { data: recentChecks } = useQuery({
       queryKey: ['dailyCheck', 'recent'],
       queryFn: () => dailyCheckApi.getRecentChecks(7),
       staleTime: 5 * 60 * 1000,
     });

     return {
       todayCheck,
       isLoading,
       isCompleted: todayCheck?.status === 'COMPLETED',
       recentChecks,
       createCheck: createCheck.mutate,
       isCreating: createCheck.isPending,
       refetch,
     };
   }
   ```

**🔍 중간 점검 (Day 8 종료 시)**:
- [ ] DailyCheck 타입 정의 완료
- [ ] dailyCheckApi 구현 완료
- [ ] useDailyCheck 훅 동작 확인
- [ ] TypeScript 컴파일 성공

#### Day 9: DailyCheck UI 컴포넌트

**📋 상세 작업** (5-6시간):

1. **DailyCheckCard 컴포넌트** (3-4시간)
   ```typescript
   // components/DailyCheckCard/DailyCheckCard.tsx
   import { Card, Button } from '@/shared/components';
   import { useDailyCheck } from '../../hooks/useDailyCheck';
   import { QuickResponse } from '../QuickResponse/QuickResponse';
   import type { ResponseType } from '../../types/dailyCheck.types';

   export function DailyCheckCard() {
     const { todayCheck, isLoading, isCompleted, createCheck, isCreating } =
       useDailyCheck();

     const handleResponse = (responseType: ResponseType) => {
       createCheck({ responseType });
     };

     if (isLoading) {
       return (
         <Card padding="large">
           <p className="text-xl text-center">로딩 중...</p>
         </Card>
       );
     }

     if (isCompleted) {
       return (
         <Card padding="large">
           <div className="text-center">
             <h3 className="text-2xl font-bold text-green-700 mb-4">
               ✅ 오늘 안부 확인 완료!
             </h3>
             <p className="text-lg text-gray-600">
               응답: {getResponseLabel(todayCheck?.responseType!)}
             </p>
             <p className="text-base text-gray-500 mt-2">
               {new Date(todayCheck?.completedAt!).toLocaleTimeString('ko-KR')}
             </p>
           </div>
         </Card>
       );
     }

     return (
       <Card padding="large">
         <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
           오늘 기분은 어떠세요?
         </h3>

         <QuickResponse onResponse={handleResponse} disabled={isCreating} />
       </Card>
     );
   }

   function getResponseLabel(type: ResponseType): string {
     const labels = {
       GOOD: '😊 좋아요',
       NORMAL: '😐 그저 그래요',
       BAD: '😔 안 좋아요',
       CONVERSATION: '💬 대화했어요',
     };
     return labels[type] || type;
   }
   ```

2. **QuickResponse 컴포넌트** (2시간)
   ```typescript
   // components/QuickResponse/QuickResponse.tsx
   import { Button } from '@/shared/components';
   import type { ResponseType } from '../../types/dailyCheck.types';

   interface QuickResponseProps {
     onResponse: (type: ResponseType) => void;
     disabled?: boolean;
   }

   export function QuickResponse({ onResponse, disabled }: QuickResponseProps) {
     const responses: { type: ResponseType; label: string; color: string }[] = [
       {
         type: 'GOOD',
         label: '😊 좋아요',
         color: 'bg-green-600 hover:bg-green-700 focus:ring-green-300',
       },
       {
         type: 'NORMAL',
         label: '😐 그저 그래요',
         color: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300',
       },
       {
         type: 'BAD',
         label: '😔 안 좋아요',
         color: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-300',
       },
       {
         type: 'CONVERSATION',
         label: '💬 대화하고 싶어요',
         color: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300',
       },
     ];

     return (
       <div className="space-y-4">
         {responses.map((response) => (
           <button
             key={response.type}
             onClick={() => onResponse(response.type)}
             disabled={disabled}
             className={`
               w-full py-6 px-6
               text-2xl font-semibold text-white
               rounded-xl
               transition-all
               focus:outline-none focus:ring-4
               disabled:opacity-50 disabled:cursor-not-allowed
               min-h-[80px]
               ${response.color}
             `}
           >
             {response.label}
           </button>
         ))}
       </div>
     );
   }
   ```

**🔍 중간 점검 (Day 9 종료 시)**:
- [ ] DailyCheckCard 정상 렌더링
- [ ] QuickResponse 버튼 동작
- [ ] 안부 확인 생성 성공
- [ ] 완료 상태 표시 확인
- [ ] 노인 친화적 크기 (80px 높이 버튼)

**✅ Day 8-9 완료 기준**:
- [ ] features/daily-check 모듈 완성
- [ ] DailyCheckCard, QuickResponse 컴포넌트 완성
- [ ] 안부 확인 전체 플로우 동작
- [ ] TypeScript 에러 0개
- [ ] `npm run build` 성공

---

### Day 10-11: Guardian Feature

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: 보호자 관리 기능 구현

#### Day 10: Guardian 기본 구조 및 API

**📋 상세 작업** (5-6시간):

1. **폴더 구조 및 타입 정의** (1시간)
   ```typescript
   // types/guardian.types.ts

   // 보호자 관계
   export type GuardianRelation =
     | 'SON'
     | 'DAUGHTER'
     | 'SPOUSE'
     | 'CAREGIVER'
     | 'OTHER';

   // 알림 타입
   export type NotificationType =
     | 'DAILY_SUMMARY'     // 일일 요약
     | 'EMOTION_ALERT'     // 감정 이상
     | 'NO_RESPONSE'       // 무응답
     | 'EMERGENCY';        // 긴급

   // 보호자 엔티티
   export interface Guardian {
     id: number;
     memberId: number;
     name: string;
     phoneNumber: string;
     email?: string;
     relation: GuardianRelation;
     notificationSettings: NotificationType[];
     isActive: boolean;
     createdAt: string;
   }

   // 보호자 등록 요청
   export interface CreateGuardianRequest {
     name: string;
     phoneNumber: string;
     email?: string;
     relation: GuardianRelation;
     notificationSettings: NotificationType[];
   }

   // 보호자 수정 요청
   export interface UpdateGuardianRequest {
     name?: string;
     phoneNumber?: string;
     email?: string;
     relation?: GuardianRelation;
     notificationSettings?: NotificationType[];
     isActive?: boolean;
   }
   ```

2. **Guardian API 구현** (2-3시간)
   ```typescript
   // api/guardianApi.ts
   import apiClient from '@/shared/api/client';
   import { API_ENDPOINTS } from '@/shared/constants/api';
   import type {
     Guardian,
     CreateGuardianRequest,
     UpdateGuardianRequest,
   } from '../types/guardian.types';

   export const guardianApi = {
     // 보호자 목록 조회
     async getGuardians(): Promise<Guardian[]> {
       const response = await apiClient.get<Guardian[]>(
         API_ENDPOINTS.GUARDIAN.BASE
       );
       return response.data;
     },

     // 보호자 등록
     async createGuardian(request: CreateGuardianRequest): Promise<Guardian> {
       const response = await apiClient.post<Guardian>(
         API_ENDPOINTS.GUARDIAN.BASE,
         request
       );
       return response.data;
     },

     // 보호자 수정
     async updateGuardian(
       id: number,
       request: UpdateGuardianRequest
     ): Promise<Guardian> {
       const response = await apiClient.put<Guardian>(
         `${API_ENDPOINTS.GUARDIAN.BASE}/${id}`,
         request
       );
       return response.data;
     },

     // 보호자 삭제
     async deleteGuardian(id: number): Promise<void> {
       await apiClient.delete(`${API_ENDPOINTS.GUARDIAN.BASE}/${id}`);
     },

     // 테스트 알림 전송
     async sendTestNotification(id: number): Promise<void> {
       await apiClient.post(
         `${API_ENDPOINTS.GUARDIAN.BASE}/${id}/test-notification`
       );
     },
   };
   ```

3. **useGuardians 훅 구현** (2시간)
   ```typescript
   // hooks/useGuardians.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { guardianApi } from '../api/guardianApi';
   import type {
     CreateGuardianRequest,
     UpdateGuardianRequest,
   } from '../types/guardian.types';

   export function useGuardians() {
     const queryClient = useQueryClient();

     // 보호자 목록 조회
     const {
       data: guardians = [],
       isLoading,
       error,
     } = useQuery({
       queryKey: ['guardians'],
       queryFn: guardianApi.getGuardians,
       staleTime: 5 * 60 * 1000,
     });

     // 보호자 등록
     const createGuardian = useMutation({
       mutationFn: (request: CreateGuardianRequest) =>
         guardianApi.createGuardian(request),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['guardians'] });
       },
     });

     // 보호자 수정
     const updateGuardian = useMutation({
       mutationFn: ({ id, data }: { id: number; data: UpdateGuardianRequest }) =>
         guardianApi.updateGuardian(id, data),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['guardians'] });
       },
     });

     // 보호자 삭제
     const deleteGuardian = useMutation({
       mutationFn: (id: number) => guardianApi.deleteGuardian(id),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['guardians'] });
       },
     });

     // 테스트 알림
     const sendTestNotification = useMutation({
       mutationFn: (id: number) => guardianApi.sendTestNotification(id),
     });

     return {
       guardians,
       isLoading,
       error,
       createGuardian: createGuardian.mutate,
       updateGuardian: updateGuardian.mutate,
       deleteGuardian: deleteGuardian.mutate,
       sendTestNotification: sendTestNotification.mutate,
       isCreating: createGuardian.isPending,
       isUpdating: updateGuardian.isPending,
       isDeleting: deleteGuardian.isPending,
     };
   }
   ```

**🔍 중간 점검 (Day 10 종료 시)**:
- [ ] Guardian 타입 정의 완료
- [ ] guardianApi 구현 완료
- [ ] useGuardians 훅 동작 확인
- [ ] TypeScript 컴파일 성공

#### Day 11: Guardian UI 컴포넌트

**📋 상세 작업** (5-6시간):

1. **GuardianForm 컴포넌트** (3-4시간)
   ```typescript
   // components/GuardianForm/GuardianForm.tsx
   import { useState, FormEvent } from 'react';
   import { Input, Button, Card } from '@/shared/components';
   import type {
     Guardian,
     GuardianRelation,
     NotificationType,
     CreateGuardianRequest,
     UpdateGuardianRequest,
   } from '../../types/guardian.types';

   interface GuardianFormProps {
     guardian?: Guardian;  // 수정 시 전달
     onSubmit: (data: CreateGuardianRequest | UpdateGuardianRequest) => void;
     onCancel: () => void;
     isSubmitting?: boolean;
   }

   export function GuardianForm({
     guardian,
     onSubmit,
     onCancel,
     isSubmitting = false,
   }: GuardianFormProps) {
     const [formData, setFormData] = useState({
       name: guardian?.name || '',
       phoneNumber: guardian?.phoneNumber || '',
       email: guardian?.email || '',
       relation: guardian?.relation || 'DAUGHTER' as GuardianRelation,
       notificationSettings: guardian?.notificationSettings || [] as NotificationType[],
     });

     const [errors, setErrors] = useState<Record<string, string>>({});

     const relations: { value: GuardianRelation; label: string }[] = [
       { value: 'DAUGHTER', label: '딸' },
       { value: 'SON', label: '아들' },
       { value: 'SPOUSE', label: '배우자' },
       { value: 'CAREGIVER', label: '간병인' },
       { value: 'OTHER', label: '기타' },
     ];

     const notificationTypes: { value: NotificationType; label: string }[] = [
       { value: 'DAILY_SUMMARY', label: '일일 요약' },
       { value: 'EMOTION_ALERT', label: '감정 이상' },
       { value: 'NO_RESPONSE', label: '무응답 알림' },
       { value: 'EMERGENCY', label: '긴급 상황' },
     ];

     const handleSubmit = (e: FormEvent) => {
       e.preventDefault();

       // 유효성 검사
       const newErrors: Record<string, string> = {};

       if (!formData.name.trim()) {
         newErrors.name = '이름을 입력해주세요';
       }

       if (!formData.phoneNumber.trim()) {
         newErrors.phoneNumber = '전화번호를 입력해주세요';
       } else if (!/^[0-9-]+$/.test(formData.phoneNumber)) {
         newErrors.phoneNumber = '올바른 전화번호 형식이 아닙니다';
       }

       if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
         newErrors.email = '올바른 이메일 형식이 아닙니다';
       }

       if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
       }

       onSubmit(formData);
     };

     const toggleNotification = (type: NotificationType) => {
       setFormData((prev) => ({
         ...prev,
         notificationSettings: prev.notificationSettings.includes(type)
           ? prev.notificationSettings.filter((t) => t !== type)
           : [...prev.notificationSettings, type],
       }));
     };

     return (
       <Card padding="large">
         <h2 className="text-2xl font-bold text-gray-900 mb-6">
           {guardian ? '보호자 수정' : '보호자 추가'}
         </h2>

         <form onSubmit={handleSubmit} className="space-y-6">
           {/* 이름 */}
           <Input
             label="이름"
             value={formData.name}
             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
             error={errors.name}
             required
             disabled={isSubmitting}
           />

           {/* 전화번호 */}
           <Input
             label="전화번호"
             type="tel"
             placeholder="010-0000-0000"
             value={formData.phoneNumber}
             onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
             error={errors.phoneNumber}
             required
             disabled={isSubmitting}
           />

           {/* 이메일 (선택) */}
           <Input
             label="이메일 (선택사항)"
             type="email"
             placeholder="example@email.com"
             value={formData.email}
             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
             error={errors.email}
             disabled={isSubmitting}
           />

           {/* 관계 선택 */}
           <div>
             <label className="block text-lg font-semibold text-gray-700 mb-3">
               관계 <span className="text-red-600">*</span>
             </label>
             <div className="grid grid-cols-2 gap-3">
               {relations.map((relation) => (
                 <button
                   key={relation.value}
                   type="button"
                   onClick={() => setFormData({ ...formData, relation: relation.value })}
                   disabled={isSubmitting}
                   className={`
                     py-4 px-4 rounded-lg text-lg font-medium
                     border-2 transition-colors
                     ${
                       formData.relation === relation.value
                         ? 'bg-blue-600 text-white border-blue-600'
                         : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                     }
                     disabled:opacity-50 disabled:cursor-not-allowed
                   `}
                 >
                   {relation.label}
                 </button>
               ))}
             </div>
           </div>

           {/* 알림 설정 */}
           <div>
             <label className="block text-lg font-semibold text-gray-700 mb-3">
               알림 설정
             </label>
             <div className="space-y-3">
               {notificationTypes.map((type) => (
                 <label
                   key={type.value}
                   className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                 >
                   <input
                     type="checkbox"
                     checked={formData.notificationSettings.includes(type.value)}
                     onChange={() => toggleNotification(type.value)}
                     disabled={isSubmitting}
                     className="w-6 h-6 cursor-pointer"
                   />
                   <span className="text-lg text-gray-700">{type.label}</span>
                 </label>
               ))}
             </div>
           </div>

           {/* 버튼 */}
           <div className="flex gap-3 pt-4">
             <Button
               type="submit"
               variant="primary"
               size="extra-large"
               fullWidth
               disabled={isSubmitting}
             >
               {isSubmitting ? '저장 중...' : guardian ? '수정 완료' : '보호자 추가'}
             </Button>
             <Button
               type="button"
               variant="secondary"
               size="extra-large"
               fullWidth
               onClick={onCancel}
               disabled={isSubmitting}
             >
               취소
             </Button>
           </div>
         </form>
       </Card>
     );
   }
   ```

2. **GuardianCard 컴포넌트** (1-2시간)
   ```typescript
   // components/GuardianCard/GuardianCard.tsx
   import { Card, Button } from '@/shared/components';
   import type { Guardian, GuardianRelation } from '../../types/guardian.types';

   interface GuardianCardProps {
     guardian: Guardian;
     onEdit: (guardian: Guardian) => void;
     onDelete: (id: number) => void;
     onTestNotification: (id: number) => void;
   }

   export function GuardianCard({
     guardian,
     onEdit,
     onDelete,
     onTestNotification,
   }: GuardianCardProps) {
     return (
       <Card padding="large" className="mb-4">
         <div className="flex items-start justify-between">
           <div className="flex-1">
             {/* 이름 및 관계 */}
             <h3 className="text-2xl font-bold text-gray-900 mb-2">
               {guardian.name}
             </h3>
             <p className="text-lg text-gray-600 mb-4">
               {getRelationLabel(guardian.relation)}
             </p>

             {/* 연락처 */}
             <div className="space-y-2 mb-4">
               <p className="text-base text-gray-700">
                 📞 {guardian.phoneNumber}
               </p>
               {guardian.email && (
                 <p className="text-base text-gray-700">✉️ {guardian.email}</p>
               )}
             </div>

             {/* 알림 설정 */}
             <div className="mb-4">
               <p className="text-base font-semibold text-gray-700 mb-2">
                 알림 설정:
               </p>
               <div className="flex flex-wrap gap-2">
                 {guardian.notificationSettings.map((type) => (
                   <span
                     key={type}
                     className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                   >
                     {getNotificationLabel(type)}
                   </span>
                 ))}
               </div>
             </div>

             {/* 상태 */}
             <div>
               <span
                 className={`
                   px-3 py-1 rounded-full text-sm font-medium
                   ${
                     guardian.isActive
                       ? 'bg-green-100 text-green-700'
                       : 'bg-gray-100 text-gray-700'
                   }
                 `}
               >
                 {guardian.isActive ? '✓ 활성' : '✗ 비활성'}
               </span>
             </div>
           </div>
         </div>

         {/* 액션 버튼 */}
         <div className="flex gap-3 mt-6">
           <Button
             variant="secondary"
             size="large"
             onClick={() => onEdit(guardian)}
             className="flex-1"
           >
             수정
           </Button>
           <Button
             variant="secondary"
             size="large"
             onClick={() => onTestNotification(guardian.id)}
             className="flex-1"
           >
             테스트 알림
           </Button>
           <Button
             variant="secondary"
             size="large"
             onClick={() => onDelete(guardian.id)}
             className="flex-1"
           >
             삭제
           </Button>
         </div>
       </Card>
     );
   }

   function getRelationLabel(relation: GuardianRelation): string {
     const labels = {
       SON: '아들',
       DAUGHTER: '딸',
       SPOUSE: '배우자',
       CAREGIVER: '간병인',
       OTHER: '기타',
     };
     return labels[relation] || relation;
   }

   function getNotificationLabel(type: string): string {
     const labels: Record<string, string> = {
       DAILY_SUMMARY: '일일 요약',
       EMOTION_ALERT: '감정 이상',
       NO_RESPONSE: '무응답',
       EMERGENCY: '긴급',
     };
     return labels[type] || type;
   }
   ```

3. **GuardiansPage 페이지 (ConfirmDialog 적용)** (2-3시간)
   ```typescript
   // pages/guardians/GuardiansPage.tsx
   import { useState } from 'react';
   import { Layout, Button, LoadingSpinner, ConfirmDialog } from '@/shared/components';
   import {
     GuardianCard,
     GuardianForm,
     useGuardians,
   } from '@/features/guardian';
   import { useNavigate } from 'react-router-dom';
   import { ROUTES } from '@/shared/constants/routes';
   import type { Guardian, CreateGuardianRequest } from '@/features/guardian';

   type FormMode = 'list' | 'add' | 'edit';

   export function GuardiansPage() {
     const navigate = useNavigate();
     const {
       guardians,
       isLoading,
       createGuardian,
       updateGuardian,
       deleteGuardian,
       sendTestNotification,
       isCreating,
       isUpdating,
     } = useGuardians();

     const [mode, setMode] = useState<FormMode>('list');
     const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);
     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
     const [deletingGuardianId, setDeletingGuardianId] = useState<number | null>(null);

     const handleAdd = () => {
       setMode('add');
       setEditingGuardian(null);
     };

     const handleEdit = (guardian: Guardian) => {
       setMode('edit');
       setEditingGuardian(guardian);
     };

     const handleSubmit = (data: CreateGuardianRequest) => {
       if (mode === 'add') {
         createGuardian(data, {
           onSuccess: () => {
             setMode('list');
             alert('보호자가 추가되었습니다!');
           },
         });
       } else if (mode === 'edit' && editingGuardian) {
         updateGuardian(
           { id: editingGuardian.id, data },
           {
             onSuccess: () => {
               setMode('list');
               setEditingGuardian(null);
               alert('보호자 정보가 수정되었습니다!');
             },
           }
         );
       }
     };

     const handleCancel = () => {
       setMode('list');
       setEditingGuardian(null);
     };

     const handleDelete = (id: number) => {
       setDeletingGuardianId(id);
       setShowDeleteConfirm(true);
     };

     const confirmDelete = () => {
       if (deletingGuardianId === null) return;

       deleteGuardian(deletingGuardianId, {
         onSuccess: () => {
           alert('보호자가 삭제되었습니다.');
           setDeletingGuardianId(null);
         },
       });
     };

     const handleTestNotification = (id: number) => {
       sendTestNotification(id, {
         onSuccess: () => {
           alert('테스트 알림이 전송되었습니다!');
         },
       });
     };

     if (isLoading) {
       return (
         <Layout title="보호자 관리" showBack onBack={() => navigate(ROUTES.DASHBOARD)}>
           <div className="flex items-center justify-center min-h-[60vh]">
             <LoadingSpinner size="large" />
           </div>
         </Layout>
       );
     }

     // 폼 표시 모드
     if (mode === 'add' || mode === 'edit') {
       return (
         <Layout
           title={mode === 'add' ? '보호자 추가' : '보호자 수정'}
           showBack
           onBack={handleCancel}
         >
           <GuardianForm
             guardian={editingGuardian || undefined}
             onSubmit={handleSubmit}
             onCancel={handleCancel}
             isSubmitting={isCreating || isUpdating}
           />
         </Layout>
       );
     }

     // 목록 표시 모드
     return (
       <Layout title="보호자 관리" showBack onBack={() => navigate(ROUTES.DASHBOARD)}>
         {/* 보호자 추가 버튼 */}
         <div className="mb-6">
           <Button
             variant="primary"
             size="extra-large"
             fullWidth
             onClick={handleAdd}
           >
             + 보호자 추가
           </Button>
         </div>

         {/* 보호자 목록 */}
         {guardians.length === 0 ? (
           <div className="text-center py-12">
             <p className="text-xl text-gray-600 mb-4">
               등록된 보호자가 없습니다.
             </p>
             <p className="text-base text-gray-500">
               보호자를 추가하면 안부 알림을 받을 수 있어요.
             </p>
           </div>
         ) : (
           <div className="space-y-4">
             {guardians.map((guardian) => (
               <GuardianCard
                 key={guardian.id}
                 guardian={guardian}
                 onEdit={handleEdit}
                 onDelete={handleDelete}
                 onTestNotification={handleTestNotification}
               />
             ))}
           </div>
         )}

         {/* 삭제 확인 다이얼로그 */}
         <ConfirmDialog
           isOpen={showDeleteConfirm}
           onClose={() => {
             setShowDeleteConfirm(false);
             setDeletingGuardianId(null);
           }}
           onConfirm={confirmDelete}
           title="보호자 삭제"
           message="정말 이 보호자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
           confirmText="삭제"
           cancelText="취소"
           confirmVariant="danger"
         />
       </Layout>
     );
   }
   ```

**🔍 중간 점검 (Day 11 종료 시)**:
- [ ] GuardianForm 유효성 검사 동작
- [ ] GuardianCard 정상 렌더링
- [ ] 보호자 목록 조회 성공
- [ ] 보호자 추가 전체 플로우 동작
- [ ] 보호자 수정 전체 플로우 동작
- [ ] ConfirmDialog로 삭제 확인 (confirm() 대체)
- [ ] 삭제 기능 동작
- [ ] 테스트 알림 전송
- [ ] 노인 친화적 UI (큰 버튼, 체크박스)

**✅ Day 10-11 완료 기준**:
- [ ] features/guardian 모듈 완성
- [ ] GuardianForm 컴포넌트 완성
- [ ] GuardiansPage 완전 동작
- [ ] ConfirmDialog를 통한 삭제 확인
- [ ] CRUD 전체 기능 정상 동작
- [ ] TypeScript 에러 0개
- [ ] `npm run build` 성공

---

### Day 12-13: 대시보드 통합

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: 모든 기능을 통합한 대시보드 완성

**📋 상세 작업**:

1. **DashboardPage 리팩토링 (ConfirmDialog 적용)** (4-5시간)
   ```typescript
   // pages/dashboard/DashboardPage.tsx
   import { useState } from 'react';
   import { Layout, Button, Card, ConfirmDialog } from '@/shared/components';
   import { DailyCheckCard } from '@/features/daily-check';
   import { useAuth } from '@/features/auth';
   import { useNavigate } from 'react-router-dom';
   import { ROUTES } from '@/shared/constants/routes';

   export function DashboardPage() {
     const navigate = useNavigate();
     const { user, logout } = useAuth();
     const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

     const handleLogout = () => {
       setShowLogoutConfirm(true);
     };

     const confirmLogout = () => {
       logout();
       navigate(ROUTES.LOGIN);
     };

     return (
       <Layout title="MARUNI">
         <div className="space-y-6">
           {/* 사용자 정보 */}
           <Card padding="large">
             <h2 className="text-2xl font-bold text-gray-900 mb-2">
               안녕하세요, {user?.name}님!
             </h2>
             <p className="text-lg text-gray-600">
               오늘도 좋은 하루 보내세요 😊
             </p>
           </Card>

           {/* 오늘의 안부 확인 */}
           <DailyCheckCard />

           {/* 주요 기능 메뉴 */}
           <Card padding="large">
             <h3 className="text-xl font-bold text-gray-900 mb-4">
               주요 기능
             </h3>
             <div className="space-y-3">
               <Button
                 variant="primary"
                 size="extra-large"
                 fullWidth
                 onClick={() => navigate(ROUTES.CONVERSATION)}
               >
                 💬 AI와 대화하기
               </Button>
               <Button
                 variant="secondary"
                 size="extra-large"
                 fullWidth
                 onClick={() => navigate(ROUTES.GUARDIANS)}
               >
                 👨‍👩‍👧 보호자 관리
               </Button>
             </div>
           </Card>

           {/* 로그아웃 */}
           <Button
             variant="secondary"
             size="large"
             fullWidth
             onClick={handleLogout}
           >
             로그아웃
           </Button>
         </div>

         {/* 로그아웃 확인 다이얼로그 */}
         <ConfirmDialog
           isOpen={showLogoutConfirm}
           onClose={() => setShowLogoutConfirm(false)}
           onConfirm={confirmLogout}
           title="로그아웃"
           message="정말 로그아웃 하시겠습니까?"
           confirmText="로그아웃"
           cancelText="취소"
           confirmVariant="primary"
         />
       </Layout>
     );
   }
   ```

2. **라우터 최종 업데이트** (1시간)
   ```typescript
   // app/router.tsx 최종 버전
   import { createBrowserRouter, Navigate } from 'react-router-dom';
   import { ProtectedRoute } from '@/features/auth';
   import { LoginPage } from '@/pages/auth/LoginPage';
   import { DashboardPage } from '@/pages/dashboard/DashboardPage';
   import { ConversationPage } from '@/pages/conversation/ConversationPage';
   import { GuardiansPage } from '@/pages/guardians/GuardiansPage';
   import { NotFoundPage } from '@/pages/NotFoundPage';
   import { ROUTES } from '@/shared/constants/routes';

   export const router = createBrowserRouter([
     {
       path: '/',
       errorElement: <NotFoundPage />,
       children: [
         {
           index: true,
           element: <Navigate to={ROUTES.DASHBOARD} replace />,
         },
         {
           path: ROUTES.LOGIN,
           element: <LoginPage />,
         },
         {
           path: ROUTES.DASHBOARD,
           element: (
             <ProtectedRoute>
               <DashboardPage />
             </ProtectedRoute>
           ),
         },
         {
           path: ROUTES.CONVERSATION,
           element: (
             <ProtectedRoute>
               <ConversationPage />
             </ProtectedRoute>
           ),
         },
         {
           path: ROUTES.GUARDIANS,
           element: (
             <ProtectedRoute>
               <GuardiansPage />
             </ProtectedRoute>
           ),
         },
         {
           path: '*',
           element: <NotFoundPage />,
         },
       ],
     },
   ]);
   ```

3. **전체 사용자 플로우 테스트** (3-4시간)
   - 로그인 → 대시보드
   - 안부 확인 → 완료 상태 확인
   - AI 대화 시작 → 메시지 전송 → 대화 종료
   - 보호자 관리 → 추가/수정/삭제
   - 로그아웃 → 로그인 페이지

4. **통합 검증** (2-3시간)
   - 모든 페이지 네비게이션 동작
   - 데이터 흐름 확인
   - 에러 처리 확인
   - 로딩 상태 확인

**🔍 중간 점검 (Day 12-13 종료 시)**:
- [ ] 대시보드 모든 기능 링크 동작
- [ ] ConfirmDialog로 로그아웃 확인 (confirm() 대체)
- [ ] 전체 사용자 플로우 완성
- [ ] 페이지 간 이동 정상
- [ ] 데이터 일관성 유지
- [ ] 에러 없이 동작

**✅ Day 12-13 완료 기준**:
- [ ] 대시보드 통합 완료
- [ ] 모든 confirm() 제거 및 ConfirmDialog 적용
- [ ] 모든 페이지 연결 완료
- [ ] 전체 플로우 정상 동작
- [ ] TypeScript 에러 0개
- [ ] `npm run build` 성공

---

### Day 14: Phase 3 최종 검증

**⏰ 예상 소요 시간**: 5-6시간

**🎯 목표**: Phase 3 전체 품질 확인 및 문서화

**📋 상세 작업**:

1. **전체 기능 테스트** (2시간)
   - [ ] 로그인/로그아웃
   - [ ] 안부 확인 (GOOD, NORMAL, BAD, CONVERSATION)
   - [ ] AI 대화 전체 플로우
   - [ ] 보호자 CRUD
   - [ ] 대시보드 모든 기능

2. **에러 케이스 테스트** (1-2시간)
   - [ ] 네트워크 에러
   - [ ] API 에러 응답
   - [ ] 타임아웃
   - [ ] 토큰 만료
   - [ ] 잘못된 입력

3. **접근성 최종 검증** (1시간)
   - [ ] 키보드 네비게이션 (모든 페이지)
   - [ ] 스크린 리더 테스트
   - [ ] 색상 대비 확인
   - [ ] ARIA 속성 적절성

4. **성능 검증** (1시간)
   ```bash
   # 번들 크기 확인
   npm run build

   # Lighthouse 성능 측정
   # - Performance: 90+
   # - Accessibility: 95+
   # - Best Practices: 90+
   # - SEO: 90+
   ```

5. **코드 품질 최종 검사** (1시간)
   ```bash
   # TypeScript 컴파일
   npm run build

   # ESLint 검사
   npm run lint

   # 불필요한 코드 제거
   # - console.log
   # - 사용하지 않는 import
   # - 주석 처리된 코드
   ```

6. **문서 업데이트** (1-2시간)
   - CURRENT_STATUS.md 업데이트 (Phase 3 완료)
   - COMPONENT_CATALOG.md 업데이트 (새 컴포넌트 추가)
   - README.md 업데이트 (필요 시)

**🔍 Phase 3 최종 점검**:
- [ ] 3가지 핵심 기능 100% 동작
- [ ] 모든 페이지 노인 친화적
- [ ] TypeScript/ESLint 통과
- [ ] 접근성 기준 AAA 충족
- [ ] 성능 지표 만족
- [ ] 문서 업데이트 완료

**✅ Phase 3 완료 기준**:
- [ ] AI 대화 시스템 완성
- [ ] 안부 확인 시스템 완성
- [ ] 보호자 관리 시스템 완성
- [ ] 대시보드 통합 완료
- [ ] 전체 품질 기준 충족
- [ ] Phase 4 준비 완료

---

## 🧪 테스트 및 검증 가이드

### 1. 기능 테스트 체크리스트

#### AI 대화 시스템
- [ ] 대화 시작 정상 동작
- [ ] 메시지 전송 및 AI 응답 수신
- [ ] 감정 분석 결과 표시
- [ ] 대화 종료 및 상태 초기화
- [ ] 자동 스크롤 동작
- [ ] Optimistic update 동작

#### 안부 확인 시스템
- [ ] 오늘의 안부 조회
- [ ] 4가지 응답 타입 선택
- [ ] 응답 저장 성공
- [ ] 완료 상태 표시
- [ ] 최근 안부 목록 조회

#### 보호자 관리 시스템
- [ ] 보호자 목록 조회
- [ ] 보호자 추가
- [ ] 보호자 수정
- [ ] 보호자 삭제
- [ ] 테스트 알림 전송

### 2. 통합 테스트 시나리오

#### 시나리오 1: 첫 사용자
```
1. 로그인
2. 대시보드 확인
3. 안부 확인 (GOOD 선택)
4. AI 대화 시작
5. 메시지 3개 이상 주고받기
6. 대화 종료
7. 보호자 추가
8. 로그아웃
```

#### 시나리오 2: 일상 사용
```
1. 로그인 (자동)
2. 오늘 안부 확인 완료 여부 확인
3. 안부 미완료 시 응답
4. AI 대화 (선택사항)
5. 보호자 알림 설정 확인
6. 로그아웃 (선택)
```

#### 시나리오 3: 에러 복구
```
1. 네트워크 차단 상태에서 기능 사용
2. 에러 메시지 확인
3. 네트워크 복구
4. 자동 재시도 또는 수동 재시도
5. 정상 동작 확인
```

### 3. 접근성 테스트

#### 키보드 네비게이션
- [ ] Tab 키로 모든 요소 접근
- [ ] Enter/Space로 버튼 활성화
- [ ] Shift+Tab으로 역순 이동
- [ ] Escape로 모달/폼 닫기

#### 스크린 리더 호환성
- [ ] 모든 버튼에 적절한 label
- [ ] 폼 요소에 label 연결
- [ ] 에러 메시지 role="alert"
- [ ] heading 구조 논리적

### 4. 성능 테스트

#### 번들 크기
```bash
# 빌드 후 확인
npm run build

# 목표 크기
# - Total: < 500KB (gzipped)
# - Main chunk: < 300KB
# - Vendor chunks: < 200KB
```

#### 로딩 시간
- [ ] 초기 페이지 로드: < 2초
- [ ] 페이지 전환: < 500ms
- [ ] API 응답: < 1초
- [ ] 이미지 로딩: < 2초

---

## 🚨 문제 해결 가이드

### 1. API 연동 문제

#### 401 Unauthorized
```typescript
// 원인: 토큰 만료 또는 누락
// 해결: API 클라이언트의 자동 토큰 갱신 확인

// shared/api/client.ts 확인
// - 요청 인터셉터에서 토큰 첨부
// - 응답 인터셉터에서 401 처리
```

#### CORS 에러
```bash
# 서버 측 CORS 설정 확인
# Spring Boot application.yml
cors:
  allowed-origins: http://localhost:3001
  allowed-methods: GET, POST, PUT, DELETE
  allowed-headers: "*"
```

#### 네트워크 에러
```typescript
// 해결: TanStack Query retry 설정 활용
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,  // 2번 재시도
      retryDelay: 1000,  // 1초 대기
    },
  },
});
```

### 2. 상태 관리 문제

#### Zustand 상태 유실
```typescript
// 원인: 새로고침 시 상태 초기화
// 해결: persist 미들웨어 확인

// 대화 상태를 persist하려면
export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      // ... 상태 및 액션
    }),
    {
      name: 'conversation-storage',
      partialize: (state) => ({
        // 저장할 상태만 선택
        currentConversation: state.currentConversation,
      }),
    }
  )
);
```

#### TanStack Query 캐시 무효화
```typescript
// 원인: 데이터 변경 후 UI 미반영
// 해결: invalidateQueries 호출

const createCheck = useMutation({
  mutationFn: dailyCheckApi.createDailyCheck,
  onSuccess: () => {
    // 캐시 무효화
    queryClient.invalidateQueries({ queryKey: ['dailyCheck'] });
  },
});
```

### 3. UI/UX 문제

#### 자동 스크롤 안됨
```typescript
// 원인: ref 미설정 또는 타이밍 문제
// 해결: useEffect에서 scrollIntoView 호출

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);  // messages 변경 시마다 실행
```

#### 버튼 터치 영역 부족
```css
/* 해결: min-h 클래스 추가 */
.button {
  min-height: 60px;  /* 최소 60px */
  padding: 1rem 1.5rem;
}
```

### 4. TypeScript 문제

#### Type 'undefined' is not assignable
```typescript
// 원인: Optional 체이닝 누락
// 해결: ?. 연산자 사용

// ❌ 잘못된 예
const userName = user.name;

// ✅ 올바른 예
const userName = user?.name;
```

#### Property does not exist on type
```typescript
// 원인: 타입 정의 불일치
// 해결: 타입 확장 또는 수정

// types/conversation.types.ts
export interface Message {
  id: number;
  content: string;
  sender: 'USER' | 'AI';
  timestamp: string;
  emotionScore?: number;  // Optional 추가
}
```

---

## 📚 Phase 3 완료 후 다음 단계

### Phase 4 준비사항

**Phase 4: PWA 완성 및 최적화 (1-2주)**

1. **PWA 기능 완성**
   - Service Worker 오프라인 지원
   - 푸시 알림 (Firebase FCM)
   - 홈 화면 추가 안내
   - 앱 아이콘 및 스플래시 화면

2. **성능 최적화**
   - 코드 스플리팅
   - 이미지 최적화
   - 번들 크기 최적화
   - React.memo 적용

3. **접근성 AAA 달성**
   - 스크린 리더 최적화
   - 키보드 네비게이션 완성
   - 색상 대비 강화
   - 에러 메시지 개선

4. **배포 준비**
   - CI/CD 파이프라인
   - 환경별 설정 분리
   - 모니터링 설정
   - 에러 추적 (Sentry 등)

### 지속적인 개선

Phase 3 완료 후에도 지속적인 개선 필요:

- **사용자 피드백 반영**
- **성능 모니터링**
- **보안 강화**
- **기능 확장**

---

## 🎯 Phase 3 성공 지표

### 기술적 지표
- [ ] TypeScript 컴파일 에러 0개
- [ ] ESLint 경고 0개
- [ ] 번들 크기 < 500KB
- [ ] Lighthouse 성능 점수 90+
- [ ] 접근성 점수 95+

### 기능적 지표
- [ ] 3가지 핵심 기능 100% 동작
- [ ] 모든 페이지 정상 렌더링
- [ ] 에러 처리 완벽 동작
- [ ] 로딩 상태 명확 표시
- [ ] 사용자 피드백 적절

### 사용자 경험 지표
- [ ] 노인 사용자 테스트 통과
- [ ] 터치 영역 48px 이상
- [ ] 폰트 크기 18px 이상
- [ ] 색상 대비 4.5:1 이상
- [ ] 에러 메시지 이해 가능

---

**🎉 Phase 3를 완료하면 MARUNI 클라이언트의 핵심 기능이 모두 완성됩니다!**

**🚀 Phase 3 성공적 완료를 위해 이 가이드를 단계별로 따라 진행하세요!**

**📞 문제 발생 시**: 문제 해결 가이드를 참조하거나, 각 Day별 완료 기준을 다시 확인해보세요.

**📝 진행 상황 추적**: 각 체크리스트 항목을 완료할 때마다 체크 표시하여 진행 상황을 관리하세요.

**🔍 중간 점검 필수**: 각 Day 종료 시 중간 점검 항목을 반드시 확인하세요.
