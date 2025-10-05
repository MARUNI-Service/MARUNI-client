# Phase 3 실행 가이드: 핵심 기능 구현

> **MARUNI 클라이언트 Phase 3 상세 실행 계획서**
> **목표**: AI 대화, 보호자 관리, 알림 이력, 회원 정보 기능 구현 (2주 완료)
> **진행률**: 70% → 90%

## 📋 Phase 3 개요

### 핵심 목표
- **AI 대화 시스템** (features/conversation) - GPT-4o 기반 대화 및 감정 분석
- **보호자 관리 시스템** (features/guardian) - 보호자 설정 및 관계 관리
- **알림 이력 조회** (features/alert) - 이상징후 알림 이력 확인
- **회원 정보 관리** (features/member) - 프로필 조회 및 수정

### 완료 시 달성 결과
- AI와 자연스러운 대화 가능 (감정 분석 포함)
- 보호자 등록 및 알림 설정 완료
- 알림 이력 조회 및 필터링 기능
- 회원 정보 조회 및 수정 기능
- 모든 핵심 기능 서버 API 연동 완료
- TypeScript 타입 에러 0개

---

## ✅ 시작 전 준비사항 체크리스트

### Phase 2 완료 확인
- [ ] React Router 라우팅 시스템 동작
- [ ] API 클라이언트 및 JWT 자동 갱신 완성
- [ ] 로그인/로그아웃 기능 정상 동작
- [ ] 보호된 라우트 및 인증 가드 동작
- [ ] TypeScript 컴파일 에러 없음
- [ ] `npm run build` 성공

### 필수 문서 숙지
- [ ] **[API_REFERENCE.md](../api/API_REFERENCE.md)** ⭐ 필수 - 서버 API 레퍼런스
- [ ] **[IMPLEMENTATION_FLOWS.md](../flows/IMPLEMENTATION_FLOWS.md)** ⭐ 필수 - 구현 플로우 가이드
- [ ] **[TECHNICAL_ARCHITECTURE.md](../architecture/TECHNICAL_ARCHITECTURE.md)** - 시스템 아키텍처
- [ ] **[COMPONENT_DESIGN_GUIDE.md](../development/COMPONENT_DESIGN_GUIDE.md)** - 컴포넌트 설계 가이드

### 개발 환경 확인
- [ ] 개발 서버 정상 동작 (`npm run dev`)
- [ ] 서버 API 엔드포인트 확인 (.env.local 설정)
- [ ] 로그인 후 JWT 토큰 정상 발급 확인
- [ ] TanStack Query DevTools 설치 확인

### 서버 API 연동 준비
- [ ] Conversation API 문서 확인 (`POST /api/conversations/messages`)
- [ ] Guardian API 문서 확인 (`GET /api/guardians/my-guardian` 등)
- [ ] AlertRule API 문서 확인 (`GET /api/alert-rules/history`)
- [ ] Member API 문서 확인 (`GET /api/users/me`)
- [ ] 서버가 로컬에서 실행 중인지 확인 (localhost:8080)

---

## 📅 14일간 상세 실행 계획

### Week 1: AI 대화 시스템 (Day 1-7)

#### Day 1: Conversation Feature 구조 및 API 연동

**⏰ 예상 소요 시간**: 6-7시간

**🎯 목표**: features/conversation 폴더 구조 및 API 모듈 구현

**📋 상세 작업**:

1. **폴더 구조 생성** (30분)
   ```
   src/features/conversation/
   ├── api/
   │   └── conversationApi.ts   # AI 대화 API
   ├── hooks/
   │   └── useConversation.ts   # TanStack Query 훅
   ├── components/
   │   ├── ConversationView.tsx      # 대화 뷰 컨테이너
   │   ├── MessageList.tsx           # 메시지 목록
   │   ├── MessageBubble.tsx         # 메시지 말풍선
   │   ├── MessageInput.tsx          # 메시지 입력
   │   └── EmotionBadge.tsx          # 감정 아이콘
   ├── types/
   │   └── conversation.types.ts    # 타입 정의
   └── index.ts                     # Export
   ```

2. **타입 정의 작성** (1시간)
   ```typescript
   // features/conversation/types/conversation.types.ts
   export type EmotionType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
   export type MessageType = 'USER_MESSAGE' | 'AI_RESPONSE' | 'SYSTEM_MESSAGE';

   export interface Message {
     id: number;
     type: MessageType;
     content: string;
     emotion: EmotionType;
     createdAt: string;
   }

   export interface ConversationResponse {
     conversationId: number;
     userMessage: Message;
     aiMessage: Message;
   }

   export interface SendMessageRequest {
     content: string;
   }
   ```

3. **API 모듈 구현** (2시간)
   ```typescript
   // features/conversation/api/conversationApi.ts
   import { apiClient } from '@/shared/api/client';
   import type { ConversationResponse, SendMessageRequest } from '../types';

   export const conversationApi = {
     // 메시지 전송 및 AI 응답 수신
     sendMessage: async (data: SendMessageRequest): Promise<ConversationResponse> => {
       const response = await apiClient.post('/conversations/messages', data);
       return response.data.data;
     },

     // 대화 이력 조회 (선택 사항)
     getConversationHistory: async (conversationId: number) => {
       const response = await apiClient.get(`/conversations/${conversationId}`);
       return response.data.data;
     },
   };
   ```

4. **TanStack Query 훅 구현** (2-3시간)
   ```typescript
   // features/conversation/hooks/useConversation.ts
   import { useMutation, useQueryClient } from '@tanstack/react-query';
   import { conversationApi } from '../api/conversationApi';
   import type { Message } from '../types';

   export const useSendMessage = () => {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: conversationApi.sendMessage,

       // 낙관적 업데이트: 사용자 메시지 즉시 표시
       onMutate: async (newMessage) => {
         await queryClient.cancelQueries({ queryKey: ['conversation'] });

         const previousMessages = queryClient.getQueryData<Message[]>(['conversation']);

         const optimisticMessage: Message = {
           id: Date.now(),
           type: 'USER_MESSAGE',
           content: newMessage.content,
           emotion: 'NEUTRAL',
           createdAt: new Date().toISOString(),
         };

         queryClient.setQueryData<Message[]>(['conversation'], (old = []) => [
           ...old,
           optimisticMessage,
         ]);

         return { previousMessages };
       },

       // 성공: AI 응답 추가
       onSuccess: (data) => {
         queryClient.setQueryData<Message[]>(['conversation'], (old = []) => [
           ...old.slice(0, -1), // 낙관적 메시지 제거
           data.userMessage,    // 실제 사용자 메시지
           data.aiMessage,      // AI 응답
         ]);
       },

       // 에러: 롤백
       onError: (err, newMessage, context) => {
         if (context?.previousMessages) {
           queryClient.setQueryData(['conversation'], context.previousMessages);
         }
       },
     });
   };
   ```

5. **Export 파일 작성** (30분)
   ```typescript
   // features/conversation/index.ts
   export * from './api/conversationApi';
   export * from './hooks/useConversation';
   export * from './types/conversation.types';
   export { ConversationView } from './components/ConversationView';
   ```

**✅ Day 1 완료 기준**:
- [ ] features/conversation 폴더 구조 완성
- [ ] 타입 정의 완료 (TypeScript 에러 없음)
- [ ] API 모듈 및 훅 구현 완료
- [ ] Export 파일 정상 동작

---

#### Day 2-3: 대화 UI 컴포넌트 구현

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: 노인 친화적 대화 UI 컴포넌트 완성

**📋 Day 2 작업** (5-6시간):

1. **MessageBubble 컴포넌트** (2시간)
   ```typescript
   // features/conversation/components/MessageBubble.tsx
   import type { Message } from '../types';
   import { EmotionBadge } from './EmotionBadge';

   interface MessageBubbleProps {
     message: Message;
     isAI?: boolean;
   }

   export function MessageBubble({ message, isAI = false }: MessageBubbleProps) {
     return (
       <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
         <div
           className={`
             max-w-[80%] rounded-2xl px-6 py-4
             ${isAI
               ? 'bg-blue-50 text-gray-900'
               : 'bg-blue-600 text-white'
             }
           `}
         >
           {/* 메시지 내용 */}
           <p className="text-lg leading-relaxed">{message.content}</p>

           {/* 감정 및 시간 */}
           <div className="flex items-center justify-between mt-2">
             <EmotionBadge emotion={message.emotion} />
             <span className="text-sm opacity-70">
               {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                 hour: '2-digit',
                 minute: '2-digit',
               })}
             </span>
           </div>
         </div>
       </div>
     );
   }
   ```

2. **EmotionBadge 컴포넌트** (1시간)
   ```typescript
   // features/conversation/components/EmotionBadge.tsx
   import type { EmotionType } from '../types';

   interface EmotionBadgeProps {
     emotion: EmotionType;
   }

   const EMOTION_CONFIG = {
     POSITIVE: { icon: '😊', label: '긍정', color: 'text-green-600' },
     NEGATIVE: { icon: '😢', label: '부정', color: 'text-red-600' },
     NEUTRAL: { icon: '😐', label: '중립', color: 'text-gray-600' },
   };

   export function EmotionBadge({ emotion }: EmotionBadgeProps) {
     const config = EMOTION_CONFIG[emotion];

     return (
       <span className={`text-base ${config.color} flex items-center gap-1`}>
         <span role="img" aria-label={config.label}>{config.icon}</span>
         <span>{config.label}</span>
       </span>
     );
   }
   ```

3. **MessageList 컴포넌트** (2-3시간)
   ```typescript
   // features/conversation/components/MessageList.tsx
   import { useQuery } from '@tanstack/react-query';
   import { LoadingSpinner } from '@/shared/components';
   import { MessageBubble } from './MessageBubble';
   import type { Message } from '../types';

   export function MessageList() {
     const { data: messages = [], isLoading } = useQuery<Message[]>({
       queryKey: ['conversation'],
       initialData: [],
     });

     if (isLoading) {
       return (
         <div className="flex justify-center items-center h-64">
           <LoadingSpinner size="large" />
         </div>
       );
     }

     if (messages.length === 0) {
       return (
         <div className="text-center py-12 text-gray-500">
           <p className="text-xl">안녕하세요! 무엇을 도와드릴까요?</p>
         </div>
       );
     }

     return (
       <div className="flex-1 overflow-y-auto px-4 py-6">
         {messages.map((message) => (
           <MessageBubble
             key={message.id}
             message={message}
             isAI={message.type === 'AI_RESPONSE'}
           />
         ))}
       </div>
     );
   }
   ```

**📋 Day 3 작업** (5-6시간):

4. **MessageInput 컴포넌트** (3시간)
   ```typescript
   // features/conversation/components/MessageInput.tsx
   import { useState } from 'react';
   import { Button, Input } from '@/shared/components';
   import { useSendMessage } from '../hooks/useConversation';

   export function MessageInput() {
     const [input, setInput] = useState('');
     const { mutate: sendMessage, isPending } = useSendMessage();

     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();

       if (!input.trim() || isPending) return;

       sendMessage({ content: input });
       setInput('');
     };

     return (
       <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
         <div className="flex gap-3 max-w-md mx-auto">
           <Input
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="메시지를 입력하세요..."
             disabled={isPending}
             className="flex-1"
           />
           <Button
             type="submit"
             variant="primary"
             size="large"
             disabled={isPending || !input.trim()}
           >
             {isPending ? '전송 중...' : '전송'}
           </Button>
         </div>
       </form>
     );
   }
   ```

5. **ConversationView 컨테이너** (2-3시간)
   ```typescript
   // features/conversation/components/ConversationView.tsx
   import { Layout } from '@/shared/components';
   import { MessageList } from './MessageList';
   import { MessageInput } from './MessageInput';
   import { useNavigate } from 'react-router-dom';

   export function ConversationView() {
     const navigate = useNavigate();

     return (
       <Layout
         title="AI 대화"
         showBack
         onBack={() => navigate('/')}
       >
         <div className="flex flex-col h-[calc(100vh-120px)]">
           <MessageList />
           <MessageInput />
         </div>
       </Layout>
     );
   }
   ```

**✅ Day 2-3 완료 기준**:
- [ ] 모든 대화 UI 컴포넌트 완성
- [ ] 메시지 말풍선 노인 친화적 디자인 (큰 텍스트, 명확한 구분)
- [ ] 감정 아이콘 표시 정상 동작
- [ ] 메시지 입력 및 전송 기능 동작
- [ ] TypeScript 컴파일 에러 없음

---

#### Day 4: ConversationPage 및 라우팅 연결

**⏰ 예상 소요 시간**: 4-5시간

**🎯 목표**: 대화 페이지 완성 및 전체 플로우 테스트

**📋 상세 작업**:

1. **ConversationPage 생성** (1시간)
   ```typescript
   // pages/conversation/ConversationPage.tsx
   import { ConversationView } from '@/features/conversation';

   export function ConversationPage() {
     return <ConversationView />;
   }
   ```

2. **라우터에 대화 페이지 추가** (30분)
   ```typescript
   // app/router.tsx
   import { ConversationPage } from '@/pages/conversation/ConversationPage';

   // Protected Routes에 추가
   {
     path: 'conversation',
     element: <ConversationPage />,
   }
   ```

3. **대시보드에서 대화 페이지 링크 추가** (1시간)
   ```typescript
   // pages/dashboard/DashboardPage.tsx
   import { useNavigate } from 'react-router-dom';
   import { Button } from '@/shared/components';

   export function DashboardPage() {
     const navigate = useNavigate();

     return (
       <Layout title="대시보드">
         <div className="space-y-4">
           <Button
             variant="primary"
             size="extra-large"
             fullWidth
             onClick={() => navigate('/conversation')}
           >
             AI와 대화하기
           </Button>
           {/* 다른 버튼들... */}
         </div>
       </Layout>
     );
   }
   ```

4. **전체 플로우 테스트** (1-2시간)
   - 로그인 → 대시보드 → 대화 페이지 이동
   - 메시지 입력 및 AI 응답 확인
   - 감정 아이콘 표시 확인
   - 낙관적 업데이트 동작 확인
   - 에러 처리 확인 (네트워크 끊김 등)

5. **에러 처리 개선** (1시간)
   - 네트워크 에러 시 Toast 메시지
   - 메시지 전송 실패 시 재전송 버튼
   - 로딩 상태 명확한 표시

**✅ Day 4 완료 기준**:
- [ ] 대화 페이지 라우팅 정상 동작
- [ ] 메시지 전송 및 AI 응답 정상 수신
- [ ] 에러 처리 및 로딩 상태 표시
- [ ] 전체 플로우 테스트 통과
- [ ] TypeScript 빌드 성공

---

#### Day 5-6: 보호자 관리 기능 구현

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: features/guardian 모듈 완성

**📋 Day 5 작업** (5-6시간):

1. **Guardian Feature 구조 생성** (30분)
   ```
   src/features/guardian/
   ├── api/
   │   └── guardianApi.ts
   ├── hooks/
   │   └── useGuardian.ts
   ├── components/
   │   ├── GuardianInfo.tsx         # 보호자 정보 표시
   │   ├── GuardianForm.tsx         # 보호자 등록 폼
   │   └── GuardianSettings.tsx     # 설정 컨테이너
   ├── types/
   │   └── guardian.types.ts
   └── index.ts
   ```

2. **타입 정의** (1시간)
   ```typescript
   // features/guardian/types/guardian.types.ts
   export type GuardianRelation = 'FAMILY' | 'FRIEND' | 'CAREGIVER' | 'NEIGHBOR' | 'OTHER';
   export type NotificationPreference = 'PUSH' | 'EMAIL' | 'SMS' | 'ALL';

   export interface Guardian {
     id: number;
     guardianName: string;
     guardianEmail: string;
     guardianPhone: string | null;
     relation: GuardianRelation;
     notificationPreference: NotificationPreference;
     isActive: boolean;
     createdAt: string;
     updatedAt: string;
   }

   export interface CreateGuardianRequest {
     guardianName: string;
     guardianEmail: string;
     guardianPhone?: string;
     relation: GuardianRelation;
     notificationPreference: NotificationPreference;
   }
   ```

3. **API 모듈 구현** (2시간)
   ```typescript
   // features/guardian/api/guardianApi.ts
   import { apiClient } from '@/shared/api/client';
   import type { Guardian, CreateGuardianRequest } from '../types';

   export const guardianApi = {
     // 현재 보호자 조회
     getMyGuardian: async (): Promise<Guardian | null> => {
       try {
         const response = await apiClient.get('/guardians/my-guardian');
         return response.data.data;
       } catch (error) {
         if (error.response?.status === 404) {
           return null; // 보호자 없음
         }
         throw error;
       }
     },

     // 보호자 생성
     createGuardian: async (data: CreateGuardianRequest): Promise<Guardian> => {
       const response = await apiClient.post('/guardians', data);
       return response.data.data;
     },

     // 보호자 할당
     assignGuardian: async (guardianId: number): Promise<void> => {
       await apiClient.post(`/guardians/${guardianId}/assign`);
     },

     // 보호자 해제
     removeGuardian: async (): Promise<void> => {
       await apiClient.delete('/guardians/remove-guardian');
     },

     // 보호자 수정
     updateGuardian: async (guardianId: number, data: Partial<CreateGuardianRequest>): Promise<Guardian> => {
       const response = await apiClient.put(`/guardians/${guardianId}`, data);
       return response.data.data;
     },
   };
   ```

4. **TanStack Query 훅 구현** (2-3시간)
   ```typescript
   // features/guardian/hooks/useGuardian.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { guardianApi } from '../api/guardianApi';

   // 내 보호자 조회
   export const useMyGuardian = () => {
     return useQuery({
       queryKey: ['guardians', 'me'],
       queryFn: guardianApi.getMyGuardian,
       retry: false,
     });
   };

   // 보호자 생성 및 할당
   export const useCreateAndAssignGuardian = () => {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: async (data: CreateGuardianRequest) => {
         const guardian = await guardianApi.createGuardian(data);
         await guardianApi.assignGuardian(guardian.id);
         return guardian;
       },
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['guardians', 'me'] });
       },
     });
   };

   // 보호자 해제
   export const useRemoveGuardian = () => {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: guardianApi.removeGuardian,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['guardians', 'me'] });
       },
     });
   };
   ```

**📋 Day 6 작업** (5-6시간):

5. **GuardianInfo 컴포넌트** (2시간)
   ```typescript
   // features/guardian/components/GuardianInfo.tsx
   import { Card, Button } from '@/shared/components';
   import type { Guardian } from '../types';
   import { useRemoveGuardian } from '../hooks/useGuardian';

   interface GuardianInfoProps {
     guardian: Guardian;
   }

   const RELATION_LABELS = {
     FAMILY: '가족',
     FRIEND: '친구',
     CAREGIVER: '돌봄제공자',
     NEIGHBOR: '이웃',
     OTHER: '기타',
   };

   export function GuardianInfo({ guardian }: GuardianInfoProps) {
     const { mutate: removeGuardian, isPending } = useRemoveGuardian();

     return (
       <Card className="p-6">
         <h3 className="text-2xl font-bold mb-4">보호자 정보</h3>

         <div className="space-y-3 text-lg">
           <div>
             <span className="text-gray-600">이름:</span>
             <span className="ml-2 font-semibold">{guardian.guardianName}</span>
           </div>
           <div>
             <span className="text-gray-600">관계:</span>
             <span className="ml-2 font-semibold">
               {RELATION_LABELS[guardian.relation]}
             </span>
           </div>
           <div>
             <span className="text-gray-600">이메일:</span>
             <span className="ml-2">{guardian.guardianEmail}</span>
           </div>
           {guardian.guardianPhone && (
             <div>
               <span className="text-gray-600">전화번호:</span>
               <span className="ml-2">{guardian.guardianPhone}</span>
             </div>
           )}
         </div>

         <Button
           variant="secondary"
           fullWidth
           onClick={() => removeGuardian()}
           disabled={isPending}
           className="mt-6"
         >
           {isPending ? '해제 중...' : '보호자 해제'}
         </Button>
       </Card>
     );
   }
   ```

6. **GuardianForm 컴포넌트** (2-3시간)
   ```typescript
   // features/guardian/components/GuardianForm.tsx
   import { useState } from 'react';
   import { Input, Button, Card } from '@/shared/components';
   import { useCreateAndAssignGuardian } from '../hooks/useGuardian';
   import type { GuardianRelation, NotificationPreference } from '../types';

   export function GuardianForm() {
     const [formData, setFormData] = useState({
       guardianName: '',
       guardianEmail: '',
       guardianPhone: '',
       relation: 'FAMILY' as GuardianRelation,
       notificationPreference: 'ALL' as NotificationPreference,
     });

     const { mutate: createGuardian, isPending } = useCreateAndAssignGuardian();

     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       createGuardian(formData);
     };

     return (
       <Card className="p-6">
         <h3 className="text-2xl font-bold mb-4">보호자 등록</h3>

         <form onSubmit={handleSubmit} className="space-y-4">
           <Input
             label="이름"
             required
             value={formData.guardianName}
             onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
             placeholder="보호자 이름"
           />

           <Input
             label="이메일"
             type="email"
             required
             value={formData.guardianEmail}
             onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
             placeholder="guardian@example.com"
           />

           <Input
             label="전화번호 (선택)"
             type="tel"
             value={formData.guardianPhone}
             onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
             placeholder="010-1234-5678"
           />

           <div>
             <label className="block text-lg font-medium mb-2">관계</label>
             <select
               value={formData.relation}
               onChange={(e) => setFormData({
                 ...formData,
                 relation: e.target.value as GuardianRelation
               })}
               className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg"
             >
               <option value="FAMILY">가족</option>
               <option value="FRIEND">친구</option>
               <option value="CAREGIVER">돌봄제공자</option>
               <option value="NEIGHBOR">이웃</option>
               <option value="OTHER">기타</option>
             </select>
           </div>

           <Button
             type="submit"
             variant="primary"
             size="large"
             fullWidth
             disabled={isPending}
           >
             {isPending ? '등록 중...' : '보호자 등록'}
           </Button>
         </form>
       </Card>
     );
   }
   ```

7. **GuardianSettings 컨테이너** (1시간)
   ```typescript
   // features/guardian/components/GuardianSettings.tsx
   import { Layout, LoadingSpinner } from '@/shared/components';
   import { useMyGuardian } from '../hooks/useGuardian';
   import { GuardianInfo } from './GuardianInfo';
   import { GuardianForm } from './GuardianForm';

   export function GuardianSettings() {
     const { data: guardian, isLoading } = useMyGuardian();

     if (isLoading) {
       return (
         <Layout title="보호자 설정">
           <div className="flex justify-center py-12">
             <LoadingSpinner size="large" />
           </div>
         </Layout>
       );
     }

     return (
       <Layout title="보호자 설정" showBack>
         <div className="space-y-6">
           {guardian ? (
             <GuardianInfo guardian={guardian} />
           ) : (
             <GuardianForm />
           )}
         </div>
       </Layout>
     );
   }
   ```

**✅ Day 5-6 완료 기준**:
- [ ] features/guardian 모듈 완성
- [ ] 보호자 조회/등록/해제 기능 동작
- [ ] 노인 친화적 폼 디자인 (큰 입력 필드, 명확한 라벨)
- [ ] TypeScript 에러 없음

---

#### Day 7: Week 1 통합 및 테스트

**⏰ 예상 소요 시간**: 5-6시간

**🎯 목표**: Week 1 기능 통합 및 전체 플로우 테스트

**📋 상세 작업**:

1. **GuardianPage 생성 및 라우팅** (1시간)
   ```typescript
   // pages/settings/GuardianPage.tsx
   import { GuardianSettings } from '@/features/guardian';

   export function GuardianPage() {
     return <GuardianSettings />;
   }

   // app/router.tsx에 추가
   {
     path: 'settings/guardian',
     element: <GuardianPage />,
   }
   ```

2. **대시보드에 보호자 설정 링크 추가** (30분)
   ```typescript
   // pages/dashboard/DashboardPage.tsx
   <Button
     variant="secondary"
     size="large"
     fullWidth
     onClick={() => navigate('/settings/guardian')}
   >
     보호자 설정
   </Button>
   ```

3. **전체 플로우 통합 테스트** (2-3시간)
   - 로그인 → 대시보드
   - AI 대화 기능 테스트
   - 보호자 등록 → 정보 확인 → 해제
   - 에러 처리 확인
   - 로딩 상태 확인

4. **코드 품질 검사** (1시간)
   ```bash
   # TypeScript 컴파일
   npm run build

   # ESLint 검사
   npm run lint
   ```

5. **문서 업데이트** (1시간)
   - CURRENT_STATUS.md 업데이트
   - Week 1 완료 내용 기록
   - Week 2 준비사항 확인

**✅ Week 1 완료 기준**:
- [ ] AI 대화 시스템 완전 동작
- [ ] 보호자 관리 기능 완전 동작
- [ ] 모든 페이지 라우팅 정상
- [ ] TypeScript 빌드 0 에러
- [ ] ESLint 0 경고

---

### Week 2: 알림 이력 및 회원 정보 (Day 8-14)

#### Day 8-9: 알림 이력 기능 구현

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: features/alert 모듈 완성

**📋 Day 8 작업** (5-6시간):

1. **Alert Feature 구조 생성** (30분)
   ```
   src/features/alert/
   ├── api/
   │   └── alertApi.ts
   ├── hooks/
   │   └── useAlert.ts
   ├── components/
   │   ├── AlertHistoryList.tsx
   │   ├── AlertHistoryCard.tsx
   │   └── AlertLevelBadge.tsx
   ├── types/
   │   └── alert.types.ts
   └── index.ts
   ```

2. **타입 정의** (1시간)
   ```typescript
   // features/alert/types/alert.types.ts
   export type AlertType = 'EMOTION_PATTERN' | 'NO_RESPONSE' | 'KEYWORD_DETECTION';
   export type AlertLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

   export interface AlertHistory {
     id: number;
     alertType: AlertType;
     alertLevel: AlertLevel;
     alertMessage: string;
     detectionDetails: string;
     isNotificationSent: boolean;
     alertDate: string;
     createdAt: string;
   }

   export interface AlertRule {
     id: number;
     alertType: AlertType;
     alertLevel: AlertLevel;
     ruleName: string;
     condition: Record<string, any>;
     isActive: boolean;
   }
   ```

3. **API 모듈 및 훅 구현** (3-4시간)
   ```typescript
   // features/alert/api/alertApi.ts
   import { apiClient } from '@/shared/api/client';
   import type { AlertHistory, AlertRule } from '../types';

   export const alertApi = {
     getAlertHistory: async (days: number = 30): Promise<AlertHistory[]> => {
       const response = await apiClient.get('/alert-rules/history', {
         params: { days },
       });
       return response.data.data;
     },

     getAlertRules: async (): Promise<AlertRule[]> => {
       const response = await apiClient.get('/alert-rules');
       return response.data.data;
     },
   };

   // features/alert/hooks/useAlert.ts
   import { useQuery } from '@tanstack/react-query';
   import { alertApi } from '../api/alertApi';

   export const useAlertHistory = (days: number = 30) => {
     return useQuery({
       queryKey: ['alerts', 'history', days],
       queryFn: () => alertApi.getAlertHistory(days),
     });
   };

   export const useAlertRules = () => {
     return useQuery({
       queryKey: ['alerts', 'rules'],
       queryFn: alertApi.getAlertRules,
     });
   };
   ```

**📋 Day 9 작업** (5-6시간):

4. **AlertLevelBadge 컴포넌트** (1시간)
   ```typescript
   // features/alert/components/AlertLevelBadge.tsx
   import type { AlertLevel } from '../types';

   interface AlertLevelBadgeProps {
     level: AlertLevel;
   }

   const LEVEL_CONFIG = {
     EMERGENCY: { label: '긴급', color: 'bg-red-600 text-white' },
     HIGH: { label: '높음', color: 'bg-orange-500 text-white' },
     MEDIUM: { label: '보통', color: 'bg-yellow-500 text-gray-900' },
     LOW: { label: '낮음', color: 'bg-blue-500 text-white' },
   };

   export function AlertLevelBadge({ level }: AlertLevelBadgeProps) {
     const config = LEVEL_CONFIG[level];

     return (
       <span className={`px-3 py-1 rounded-full text-base font-semibold ${config.color}`}>
         {config.label}
       </span>
     );
   }
   ```

5. **AlertHistoryCard 컴포넌트** (2시간)
   ```typescript
   // features/alert/components/AlertHistoryCard.tsx
   import { Card } from '@/shared/components';
   import { AlertLevelBadge } from './AlertLevelBadge';
   import type { AlertHistory } from '../types';

   interface AlertHistoryCardProps {
     alert: AlertHistory;
   }

   const ALERT_TYPE_LABELS = {
     EMOTION_PATTERN: '감정 패턴',
     NO_RESPONSE: '미응답',
     KEYWORD_DETECTION: '키워드 감지',
   };

   export function AlertHistoryCard({ alert }: AlertHistoryCardProps) {
     return (
       <Card clickable className="p-5">
         <div className="flex justify-between items-start mb-3">
           <AlertLevelBadge level={alert.alertLevel} />
           <span className="text-sm text-gray-500">
             {new Date(alert.alertDate).toLocaleDateString('ko-KR')}
           </span>
         </div>

         <h3 className="text-lg font-semibold mb-2">
           {ALERT_TYPE_LABELS[alert.alertType]}
         </h3>

         <p className="text-base text-gray-700 mb-3">{alert.alertMessage}</p>

         <div className="flex items-center text-sm">
           <span className={alert.isNotificationSent ? 'text-green-600' : 'text-gray-500'}>
             {alert.isNotificationSent ? '✓ 알림 발송됨' : '알림 미발송'}
           </span>
         </div>
       </Card>
     );
   }
   ```

6. **AlertHistoryList 컴포넌트** (2-3시간)
   ```typescript
   // features/alert/components/AlertHistoryList.tsx
   import { useState } from 'react';
   import { Layout, LoadingSpinner, Button } from '@/shared/components';
   import { useAlertHistory } from '../hooks/useAlert';
   import { AlertHistoryCard } from './AlertHistoryCard';

   export function AlertHistoryList() {
     const [days, setDays] = useState(30);
     const { data: alerts = [], isLoading } = useAlertHistory(days);

     if (isLoading) {
       return (
         <div className="flex justify-center py-12">
           <LoadingSpinner size="large" />
         </div>
       );
     }

     return (
       <div>
         {/* 기간 필터 */}
         <div className="flex gap-2 mb-6">
           <Button
             variant={days === 7 ? 'primary' : 'secondary'}
             onClick={() => setDays(7)}
           >
             7일
           </Button>
           <Button
             variant={days === 30 ? 'primary' : 'secondary'}
             onClick={() => setDays(30)}
           >
             30일
           </Button>
           <Button
             variant={days === 90 ? 'primary' : 'secondary'}
             onClick={() => setDays(90)}
           >
             90일
           </Button>
         </div>

         {/* 알림 목록 */}
         {alerts.length === 0 ? (
           <div className="text-center py-12 text-gray-500">
             <p className="text-xl">알림 이력이 없습니다</p>
           </div>
         ) : (
           <div className="space-y-4">
             {alerts.map((alert) => (
               <AlertHistoryCard key={alert.id} alert={alert} />
             ))}
           </div>
         )}
       </div>
     );
   }
   ```

**✅ Day 8-9 완료 기준**:
- [ ] features/alert 모듈 완성
- [ ] 알림 이력 조회 및 필터링 동작
- [ ] 알림 레벨별 색상 구분 명확
- [ ] TypeScript 에러 없음

---

#### Day 10-11: 회원 정보 관리 기능

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: features/member 모듈 완성

**📋 Day 10 작업** (5-6시간):

1. **Member Feature 구조 생성** (30분)
   ```
   src/features/member/
   ├── api/
   │   └── memberApi.ts
   ├── hooks/
   │   └── useMember.ts
   ├── components/
   │   ├── ProfileView.tsx
   │   ├── ProfileEditForm.tsx
   │   └── AccountSettings.tsx
   ├── types/
   │   └── member.types.ts
   └── index.ts
   ```

2. **타입 정의 및 API** (2시간)
   ```typescript
   // features/member/types/member.types.ts
   export interface User {
     id: number;
     memberName: string;
     memberEmail: string;
     createdAt: string;
     updatedAt: string;
   }

   export interface UpdateUserRequest {
     memberName?: string;
     memberPassword?: string;
   }

   // features/member/api/memberApi.ts
   import { apiClient } from '@/shared/api/client';
   import type { User, UpdateUserRequest } from '../types';

   export const memberApi = {
     getMe: async (): Promise<User> => {
       const response = await apiClient.get('/users/me');
       return response.data.data;
     },

     updateMe: async (data: UpdateUserRequest): Promise<User> => {
       const response = await apiClient.put('/users/me', data);
       return response.data.data;
     },

     deleteAccount: async (): Promise<void> => {
       await apiClient.delete('/users/me');
     },
   };
   ```

3. **TanStack Query 훅** (2-3시간)
   ```typescript
   // features/member/hooks/useMember.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { memberApi } from '../api/memberApi';
   import { useAuthStore } from '@/features/auth';

   export const useMe = () => {
     return useQuery({
       queryKey: ['users', 'me'],
       queryFn: memberApi.getMe,
     });
   };

   export const useUpdateMe = () => {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: memberApi.updateMe,
       onSuccess: (data) => {
         queryClient.setQueryData(['users', 'me'], data);
       },
     });
   };

   export const useDeleteAccount = () => {
     const logout = useAuthStore((state) => state.logout);

     return useMutation({
       mutationFn: memberApi.deleteAccount,
       onSuccess: () => {
         logout();
       },
     });
   };
   ```

**📋 Day 11 작업** (5-6시간):

4. **ProfileView 컴포넌트** (2시간)
   ```typescript
   // features/member/components/ProfileView.tsx
   import { Card, Button, LoadingSpinner } from '@/shared/components';
   import { useMe } from '../hooks/useMember';

   export function ProfileView() {
     const { data: user, isLoading } = useMe();

     if (isLoading) {
       return <LoadingSpinner size="large" />;
     }

     if (!user) return null;

     return (
       <Card className="p-6">
         <h3 className="text-2xl font-bold mb-4">내 정보</h3>

         <div className="space-y-3 text-lg">
           <div>
             <span className="text-gray-600">이름:</span>
             <span className="ml-2 font-semibold">{user.memberName}</span>
           </div>
           <div>
             <span className="text-gray-600">이메일:</span>
             <span className="ml-2">{user.memberEmail}</span>
           </div>
           <div>
             <span className="text-gray-600">가입일:</span>
             <span className="ml-2">
               {new Date(user.createdAt).toLocaleDateString('ko-KR')}
             </span>
           </div>
         </div>
       </Card>
     );
   }
   ```

5. **ProfileEditForm 컴포넌트** (2-3시간)
   ```typescript
   // features/member/components/ProfileEditForm.tsx
   import { useState } from 'react';
   import { Card, Input, Button } from '@/shared/components';
   import { useMe, useUpdateMe } from '../hooks/useMember';

   export function ProfileEditForm() {
     const { data: user } = useMe();
     const { mutate: updateProfile, isPending } = useUpdateMe();

     const [formData, setFormData] = useState({
       memberName: user?.memberName || '',
       memberPassword: '',
     });

     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       updateProfile(formData);
     };

     return (
       <Card className="p-6">
         <h3 className="text-2xl font-bold mb-4">정보 수정</h3>

         <form onSubmit={handleSubmit} className="space-y-4">
           <Input
             label="이름"
             value={formData.memberName}
             onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
           />

           <Input
             label="새 비밀번호 (선택)"
             type="password"
             value={formData.memberPassword}
             onChange={(e) => setFormData({ ...formData, memberPassword: e.target.value })}
             placeholder="변경 시에만 입력"
           />

           <Button
             type="submit"
             variant="primary"
             size="large"
             fullWidth
             disabled={isPending}
           >
             {isPending ? '저장 중...' : '저장'}
           </Button>
         </form>
       </Card>
     );
   }
   ```

6. **AccountSettings 컨테이너** (1시간)
   ```typescript
   // features/member/components/AccountSettings.tsx
   import { Layout } from '@/shared/components';
   import { ProfileView } from './ProfileView';
   import { ProfileEditForm } from './ProfileEditForm';

   export function AccountSettings() {
     return (
       <Layout title="계정 설정" showBack>
         <div className="space-y-6">
           <ProfileView />
           <ProfileEditForm />
         </div>
       </Layout>
     );
   }
   ```

**✅ Day 10-11 완료 기준**:
- [ ] features/member 모듈 완성
- [ ] 회원 정보 조회/수정 기능 동작
- [ ] TypeScript 에러 없음

---

#### Day 12-13: 페이지 통합 및 네비게이션 개선

**⏰ 예상 소요 시간**: 10-12시간 (2일)

**🎯 목표**: 모든 페이지 라우팅 연결 및 네비게이션 UX 개선

**📋 Day 12 작업** (5-6시간):

1. **페이지 생성 및 라우팅** (2시간)
   ```typescript
   // pages/alert/AlertHistoryPage.tsx
   import { Layout } from '@/shared/components';
   import { AlertHistoryList } from '@/features/alert';

   export function AlertHistoryPage() {
     return (
       <Layout title="알림 이력" showBack>
         <AlertHistoryList />
       </Layout>
     );
   }

   // pages/settings/AccountPage.tsx
   import { AccountSettings } from '@/features/member';

   export function AccountPage() {
     return <AccountSettings />;
   }

   // app/router.tsx에 추가
   {
     path: 'alerts',
     element: <AlertHistoryPage />,
   },
   {
     path: 'settings/account',
     element: <AccountPage />,
   }
   ```

2. **대시보드 개선** (3-4시간)
   ```typescript
   // pages/dashboard/DashboardPage.tsx
   import { useNavigate } from 'react-router-dom';
   import { Layout, Button, Card } from '@/shared/components';
   import { useMe } from '@/features/member';
   import { useMyGuardian } from '@/features/guardian';
   import { useAuthStore } from '@/features/auth';

   export function DashboardPage() {
     const navigate = useNavigate();
     const logout = useAuthStore((state) => state.logout);
     const { data: user } = useMe();
     const { data: guardian } = useMyGuardian();

     return (
       <Layout title={`안녕하세요, ${user?.memberName}님`}>
         <div className="space-y-4">
           {/* 주요 기능 버튼 */}
           <Card className="p-6">
             <h2 className="text-2xl font-bold mb-4">오늘 뭐 하실래요?</h2>
             <div className="space-y-3">
               <Button
                 variant="primary"
                 size="extra-large"
                 fullWidth
                 onClick={() => navigate('/conversation')}
               >
                 AI와 대화하기
               </Button>

               <Button
                 variant="secondary"
                 size="large"
                 fullWidth
                 onClick={() => navigate('/alerts')}
               >
                 알림 확인하기
               </Button>
             </div>
           </Card>

           {/* 보호자 정보 카드 */}
           <Card className="p-6">
             <h3 className="text-xl font-bold mb-3">내 보호자</h3>
             {guardian ? (
               <div>
                 <p className="text-lg">{guardian.guardianName}</p>
                 <Button
                   variant="secondary"
                   onClick={() => navigate('/settings/guardian')}
                   className="mt-3"
                 >
                   설정 변경
                 </Button>
               </div>
             ) : (
               <Button
                 variant="primary"
                 onClick={() => navigate('/settings/guardian')}
               >
                 보호자 등록하기
               </Button>
             )}
           </Card>

           {/* 설정 및 로그아웃 */}
           <div className="space-y-2">
             <Button
               variant="secondary"
               fullWidth
               onClick={() => navigate('/settings/account')}
             >
               계정 설정
             </Button>
             <Button
               variant="secondary"
               fullWidth
               onClick={logout}
             >
               로그아웃
             </Button>
           </div>
         </div>
       </Layout>
     );
   }
   ```

**📋 Day 13 작업** (5-6시간):

3. **공통 네비게이션 개선** (3시간)
   - 뒤로가기 버튼 일관성 확보
   - 페이지 전환 애니메이션 (선택)
   - 로딩 상태 개선

4. **에러 처리 통합** (2-3시간)
   ```typescript
   // shared/hooks/useErrorHandler.ts
   import { useEffect } from 'react';
   import { useNavigate } from 'react-router-dom';

   export const useErrorHandler = (error: any) => {
     const navigate = useNavigate();

     useEffect(() => {
       if (error?.response?.status === 401) {
         navigate('/auth/login');
       }
     }, [error, navigate]);
   };
   ```

**✅ Day 12-13 완료 기준**:
- [ ] 모든 페이지 라우팅 연결 완료
- [ ] 대시보드 UX 개선
- [ ] 네비게이션 일관성 확보
- [ ] 에러 처리 통합

---

#### Day 14: Phase 3 최종 검증 및 문서화

**⏰ 예상 소요 시간**: 6-8시간

**🎯 목표**: 전체 기능 통합 테스트 및 문서 정리

**📋 상세 작업**:

1. **전체 플로우 통합 테스트** (3-4시간)
   - [ ] 로그인 → 대시보드
   - [ ] AI 대화 전체 플로우
   - [ ] 보호자 등록 → 수정 → 해제
   - [ ] 알림 이력 조회 및 필터링
   - [ ] 회원 정보 수정
   - [ ] 로그아웃 → 재로그인
   - [ ] 토큰 만료 시 자동 갱신 확인
   - [ ] 네트워크 에러 처리 확인

2. **코드 품질 최종 검사** (1-2시간)
   ```bash
   # TypeScript 컴파일
   npm run build

   # ESLint 검사
   npm run lint

   # 번들 크기 확인
   npm run preview
   ```

3. **성능 최적화** (1-2시간)
   - React.memo 적용 (필요시)
   - 불필요한 리렌더링 제거
   - 이미지 최적화 (필요시)

4. **문서 업데이트** (1-2시간)
   ```markdown
   # CURRENT_STATUS.md 업데이트
   - Phase 3 완료 내용 기록
   - 구현된 기능 목록 정리
   - 다음 단계 (Phase 4) 준비사항

   # PHASE3_EXECUTION_GUIDE.md (본 문서)
   - 실제 구현 내용과 차이점 기록
   - 개선 사항 및 배운 점 정리
   ```

**✅ Phase 3 최종 완료 기준**:
- [ ] 모든 핵심 기능 정상 동작
- [ ] TypeScript 빌드 0 에러
- [ ] ESLint 0 경고
- [ ] 번들 크기 500KB 이하 (목표)
- [ ] 전체 플로우 테스트 통과
- [ ] 문서 업데이트 완료

---

## 📊 Phase 3 완료 체크리스트

### 기능 구현
- [ ] AI 대화 시스템 완성 (features/conversation)
- [ ] 보호자 관리 시스템 완성 (features/guardian)
- [ ] 알림 이력 조회 완성 (features/alert)
- [ ] 회원 정보 관리 완성 (features/member)

### API 연동
- [ ] Conversation API 연동 (`POST /api/conversations/messages`)
- [ ] Guardian API 연동 (`GET /api/guardians/my-guardian` 등)
- [ ] AlertRule API 연동 (`GET /api/alert-rules/history`)
- [ ] Member API 연동 (`GET /api/users/me`)

### UI/UX
- [ ] 노인 친화적 디자인 (큰 텍스트, 명확한 버튼)
- [ ] 감정 아이콘 표시
- [ ] 알림 레벨별 색상 구분
- [ ] 로딩 및 에러 상태 처리

### 코드 품질
- [ ] TypeScript 타입 완전 정의
- [ ] TanStack Query 패턴 일관성
- [ ] 에러 처리 체계화
- [ ] 코드 재사용성 확보

### 테스트
- [ ] 전체 플로우 테스트 통과
- [ ] 네트워크 에러 처리 확인
- [ ] 토큰 갱신 동작 확인
- [ ] 모바일 반응형 확인

---

## 🎯 다음 단계: Phase 4 (PWA 완성 및 최적화)

Phase 3 완료 후 진행할 Phase 4 핵심 작업:

1. **PWA 기능 완성**
   - 오프라인 지원 (Service Worker)
   - 푸시 알림 (Firebase FCM)
   - 홈 화면 추가 프롬프트

2. **성능 최적화**
   - 코드 스플리팅
   - 번들 크기 최적화
   - 이미지 최적화

3. **접근성 최종 점검**
   - 스크린 리더 테스트
   - 키보드 네비게이션
   - WCAG 2.1 AA 준수

4. **배포 준비**
   - CI/CD 파이프라인
   - 환경별 설정
   - 모니터링 설정

---

## 📚 참고 문서

### 필수 참고 문서
- **[API_REFERENCE.md](../api/API_REFERENCE.md)** - 모든 API 엔드포인트 및 응답 형식
- **[IMPLEMENTATION_FLOWS.md](../flows/IMPLEMENTATION_FLOWS.md)** - 기능별 구현 플로우 가이드
- **[TECHNICAL_ARCHITECTURE.md](../architecture/TECHNICAL_ARCHITECTURE.md)** - 시스템 아키텍처
- **[COMPONENT_DESIGN_GUIDE.md](../development/COMPONENT_DESIGN_GUIDE.md)** - 컴포넌트 설계 가이드

### 이전 Phase 문서
- **[PHASE1_EXECUTION_GUIDE.md](./PHASE1_EXECUTION_GUIDE.md)** - Phase 1 실행 가이드
- **[PHASE2_EXECUTION_GUIDE.md](./PHASE2_EXECUTION_GUIDE.md)** - Phase 2 실행 가이드
- **[PHASE2_REFACTORING_REPORT.md](./PHASE2_REFACTORING_REPORT.md)** - Phase 2 리팩토링 보고서

---

**🎉 Phase 3을 성공적으로 완료하면 MARUNI 클라이언트의 모든 핵심 기능이 완성됩니다!**

**📅 마지막 업데이트**: 2025-10-05
**📝 작성자**: Claude (AI Assistant)
