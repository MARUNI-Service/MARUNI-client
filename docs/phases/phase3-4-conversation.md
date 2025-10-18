# Phase 3-4: AI 대화 기능 - 세부 구현 계획

**작성일**: 2025-10-18
**최종 업데이트**: 2025-10-18 (v1.0.0)
**예상 소요 시간**: 2일 (8-10시간)
**상태**: 📋 준비 완료
**우선순위**: 🔴 긴급 (MARUNI의 핵심 기능)
**구현 원칙**: Mock 데이터 기반 구현 - AI 대화 플로우 완성
**API 연결**: ❌ 이 Phase에서는 연결 안 함 - Phase 3-8에서 일괄 연결
**의존성**: Phase 3-1 (기반 확립) 완료 필요

---

## 📋 목차

1. [Phase 개요](#phase-개요)
2. [API 연결 전략](#api-연결-전략)
3. [최소 구현 원칙](#최소-구현-원칙)
4. [기술 부채 관리](#기술-부채-관리)
5. [작업 분해](#작업-분해)
6. [Task별 구현 가이드](#task별-구현-가이드)
7. [테스트 계획](#테스트-계획)
8. [완료 체크리스트](#완료-체크리스트)

---

## Phase 개요

### 목표

노인이 AI와 자연스러운 대화를 나눌 수 있는 핵심 기능을 완성하여, 매일 안부를 묻고 감정 상태를 파악할 수 있도록 한다.

### 핵심 요구사항

**user-flow.md Journey 2 (첫 안부 메시지 받기) 재현**:

```
[김순자] 대시보드 → 대화 시작 → AI 메시지 입력 → AI 응답 수신 → 감정 분석 결과 표시
```

**Journey 2의 5단계 구현**:
1. 🎯 Phase 1: 대화 시작 버튼 (대시보드에서)
2. 🎯 Phase 2: 대화 화면 구현
3. 🎯 Phase 3: 메시지 전송 기능
4. 🎯 Phase 4: AI 응답 수신 (Mock)
5. 🎯 Phase 5: 감정 분석 결과 표시

### 범위

**포함**:

- ✅ features/conversation 모듈 생성
  - Conversation 관련 타입 정의 (Message, Conversation)
  - Mock AI 응답 생성 API
  - Mock 대화 이력 저장/조회 API
  - useConversation 훅
- ✅ 대화 화면 1개
  - /conversation - AI 대화 화면
- ✅ 대화 컴포넌트 2개
  - ChatMessage - 메시지 말풍선 (사용자/AI 구분)
  - MessageInput - 메시지 입력창
- ✅ AI 대화 플로우
  - 메시지 전송 → Mock AI 응답 생성 → 화면 표시
  - 감정 분석 결과 표시 (POSITIVE/NEGATIVE/NEUTRAL)
  - 대화 이력 저장 및 조회
- ✅ Mock 감정 분석
  - 간단한 키워드 기반 감정 분석
  - 긍정/부정/중립 판단

**제외**:

- ❌ API 연결 (Phase 3-8에서 일괄 연결)
- ❌ OpenAI GPT-4o 연동 (Phase 3-8에서 연결)
- ❌ 푸시 알림 (Phase 3-6에서 구현)
- ❌ 스케줄링된 안부 메시지 발송 (백엔드 기능)
- ❌ 음성 입력/출력 (Phase 4)
- ❌ 이미지 전송 (Phase 4)
- ❌ 이상 징후 자동 감지 (Phase 3-6에서 구현)

---

## API 연결 전략

### Phase 3-4: Mock 데이터로 AI 대화 구현

**원칙**:

- **AI 대화 플로우만 구현, 실제 API는 호출 안 함**
- 메시지 전송 시 localStorage에 저장
- Mock AI 응답 생성 (간단한 규칙 기반)
- 감정 분석: 키워드 검사로 POSITIVE/NEGATIVE/NEUTRAL 판단

### Phase 3-4에서 할 일

1. **대화 이력 조회**

   - localStorage에서 대화 이력 조회 (`conversation-messages-{userId}`)
   - `GET /api/conversations/me` 호출 안 함

2. **메시지 전송**

   - localStorage에 사용자 메시지 저장
   - Mock AI 응답 생성 (1초 delay 후)
   - localStorage에 AI 응답 저장
   - `POST /api/conversations/messages` 호출 안 함

3. **감정 분석**

   - 간단한 키워드 기반 분석:
     - POSITIVE: "좋다", "행복", "즐겁다", "기쁘다", "건강", "좋아요" 등
     - NEGATIVE: "슬프다", "아프다", "힘들다", "외롭다", "싫다", "나빠" 등
     - NEUTRAL: 위 키워드가 없으면 중립
   - 감정 분석 결과를 메시지에 포함하여 저장

4. **대화 이력 표시**
   - localStorage에서 최근 N개 메시지 조회
   - 날짜별로 그룹화
   - 사용자/AI 메시지 구분하여 렌더링

### Phase 3-8 (API 연결) 계획

Phase 3-1 ~ 3-7 완료 후:

1. **대화 이력 API 연동**

   - `GET /api/conversations/me` 실제 호출
   - 서버에서 대화 이력 반환

2. **메시지 전송 API 연동**

   - `POST /api/conversations/messages` 실제 호출
   - OpenAI GPT-4o 연동
   - 실시간 감정 분석 (GPT-4o 프롬프트 활용)

3. **감정 상태 업데이트 API 연동**
   - `PATCH /api/members/me/emotion-status` 실제 호출
   - 보호자가 보는 감정 상태 실시간 업데이트

**장점**:

- ✅ AI 대화 플로우를 먼저 완성하고 나중에 API 연결
- ✅ OpenAI API 키 없이도 프론트 개발 가능
- ✅ 대화 UI/UX 먼저 완성하고 나중에 AI 품질 개선

---

## 최소 구현 원칙

### 1. 대화 화면만 구현

- ✅ /conversation 라우트만 구현
- ✅ 대시보드에서 "대화 시작" 버튼 클릭 → /conversation 이동
- ❌ 푸시 알림은 Phase 3-6에서 구현

### 2. 텍스트 메시지만 지원

- ✅ 텍스트 입력 및 전송
- ❌ 음성 입력/출력 (Phase 4)
- ❌ 이미지 전송 (Phase 4)

### 3. Mock AI 응답은 단순 규칙 기반

- ✅ 사용자 메시지 키워드 검사
- ✅ 미리 정의된 응답 목록에서 선택
- ❌ 실제 GPT-4o 연동 (Phase 3-8)

### 4. 감정 분석은 키워드 기반

- ✅ 긍정/부정 키워드 목록으로 판단
- ✅ POSITIVE/NEGATIVE/NEUTRAL 3가지만
- ❌ WARNING 상태는 Phase 3-6에서 구현

### 5. 대화 이력은 localStorage

- ✅ `conversation-messages-{userId}` 키로 저장
- ✅ 최근 100개 메시지만 저장 (메모리 절약)
- ❌ 서버 저장 (Phase 3-8)

---

## 기술 부채 관리

### Phase 3-7에서 해결할 항목

- **TODO 주석**: alert → Toast 컴포넌트 교체
- **TODO 주석**: 에러 처리 개선

### Phase 3-8에서 해결할 항목

- **TODO 주석**: Mock API → 실제 API 교체
- **TODO 주석**: Mock AI 응답 → GPT-4o 연동

### 의도적으로 남겨둘 기술 부채

- ❌ 음성 입력/출력 (Phase 4)
- ❌ 이미지 전송 (Phase 4)
- ❌ 대화 검색 기능 (Phase 4)

---

## 작업 분해

### Task 1: features/conversation 모듈 생성 (2시간)

**목표**: Conversation 관련 타입, API, 훅 구현

**파일 구조**:

```
src/features/conversation/
├── api/
│   └── mockConversationApi.ts
├── hooks/
│   └── useConversation.ts
├── types/
│   └── conversation.types.ts
└── index.ts
```

**체크리스트**:

- [ ] `conversation.types.ts` - Message, Conversation 타입 정의
- [ ] `mockConversationApi.ts` - Mock API 4개 함수
- [ ] `useConversation.ts` - Conversation 관리 훅
- [ ] `index.ts` - Public exports 정의

---

### Task 2: 대화 컴포넌트 2개 구현 (2시간)

**목표**: ChatMessage, MessageInput 컴포넌트 구현

**파일 구조**:

```
src/shared/components/business/
├── ChatMessage/
│   ├── ChatMessage.tsx
│   ├── ChatMessage.types.ts
│   └── index.ts
└── MessageInput/
    ├── MessageInput.tsx
    ├── MessageInput.types.ts
    └── index.ts
```

**체크리스트**:

- [ ] `ChatMessage.tsx` - 메시지 말풍선 컴포넌트
- [ ] `MessageInput.tsx` - 메시지 입력 컴포넌트
- [ ] 노인 친화적 UI (큰 폰트, 큰 버튼)
- [ ] 사용자/AI 메시지 시각적 구분

---

### Task 3: ConversationPage 구현 (2시간)

**목표**: AI 대화 화면 구현

**파일 구조**:

```
src/pages/conversation/
├── ConversationPage.tsx
└── index.ts
```

**체크리스트**:

- [ ] `ConversationPage.tsx` - 대화 화면
- [ ] 대화 이력 표시 (날짜별 그룹화)
- [ ] 메시지 전송 처리
- [ ] AI 응답 대기 로딩 표시
- [ ] 자동 스크롤 (최신 메시지로)

---

### Task 4: 대시보드 연동 (1시간)

**목표**: 대시보드에서 대화 시작 버튼 추가

**파일**:

- `src/pages/dashboard/DashboardPage.tsx`

**체크리스트**:

- [ ] MessageCard에 "대화 시작" 버튼 추가
- [ ] 버튼 클릭 시 /conversation 이동
- [ ] dailyCheckEnabled = true인 경우만 표시

---

### Task 5: 라우팅 설정 (30분)

**목표**: /conversation 라우트 추가

**파일**:

- `src/app/router.tsx`
- `src/shared/constants/routes.ts`

**체크리스트**:

- [ ] ROUTES.CONVERSATION 상수 추가
- [ ] /conversation 라우트 추가 (ProtectedRoute)
- [ ] ConversationPage import 및 연결

---

## Task별 구현 가이드

### Task 1: features/conversation 모듈 생성

#### 1.1 타입 정의 (`conversation.types.ts`)

```typescript
/**
 * 메시지 발신자 타입
 */
export type MessageSender = 'USER' | 'AI';

/**
 * 감정 상태 (ManagedMember와 동일)
 */
export type EmotionStatus = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

/**
 * 메시지
 */
export interface Message {
  id: number;
  sender: MessageSender;
  content: string;
  emotionStatus?: EmotionStatus; // 사용자 메시지만
  createdAt: string; // ISO 8601
}

/**
 * 대화 (전체 대화 이력)
 */
export interface Conversation {
  id: number;
  memberId: number;
  messages: Message[];
  lastMessageAt: string | null;
}

/**
 * 메시지 전송 요청
 */
export interface SendMessageRequest {
  content: string;
}
```

#### 1.2 Mock API (`mockConversationApi.ts`)

```typescript
import type { Message, Conversation } from '../types/conversation.types';

const STORAGE_KEY_PREFIX = 'conversation-messages-';
const MAX_MESSAGES = 100; // 최대 저장 메시지 수

// Mock AI 응답 규칙
const AI_RESPONSES = {
  GREETING: [
    '안녕하세요! 오늘 하루 어떠셨어요? 😊',
    '좋은 아침이에요! 잘 주무셨나요?',
    '반가워요! 오늘 기분이 어떠세요?',
  ],
  POSITIVE: [
    '정말 좋으시네요! 기분 좋은 하루를 보내시길 바래요 🌞',
    '그거 참 좋네요! 행복한 하루 되세요!',
    '와, 정말 기쁘시겠어요! 앞으로도 좋은 일만 가득하시길!',
  ],
  NEGATIVE: [
    '힘드시군요... 괜찮으신가요? 😢',
    '걱정이 되네요. 조금 쉬시는 건 어떠세요?',
    '많이 힘드셨겠어요. 천천히 이야기해주세요.',
  ],
  NEUTRAL: [
    '그렇군요. 더 말씀해주시겠어요?',
    '알겠습니다. 오늘 특별히 하고 싶은 일이 있으신가요?',
    '네, 잘 들었어요. 편안하게 이야기 나눠요.',
  ],
  DEFAULT: [
    '오늘 하루는 어떠셨어요?',
    '요즘 건강은 어떠세요?',
    '오늘 날씨가 좋네요. 산책 가실 계획이 있으신가요?',
  ],
};

// 감정 분석 키워드
const EMOTION_KEYWORDS = {
  POSITIVE: ['좋', '행복', '즐거', '기쁘', '건강', '좋아', '재밌', '웃', '감사', '사랑'],
  NEGATIVE: ['슬프', '아프', '힘들', '외롭', '싫', '나빠', '우울', '걱정', '불안', '아파'],
};

/**
 * 감정 분석 (간단한 키워드 기반)
 */
function analyzeEmotion(content: string): EmotionStatus {
  const lowerContent = content.toLowerCase();

  // 긍정 키워드 검사
  const hasPositive = EMOTION_KEYWORDS.POSITIVE.some((keyword) =>
    lowerContent.includes(keyword)
  );
  if (hasPositive) return 'POSITIVE';

  // 부정 키워드 검사
  const hasNegative = EMOTION_KEYWORDS.NEGATIVE.some((keyword) =>
    lowerContent.includes(keyword)
  );
  if (hasNegative) return 'NEGATIVE';

  // 기본값: 중립
  return 'NEUTRAL';
}

/**
 * AI 응답 생성 (간단한 규칙 기반)
 */
function generateAIResponse(userMessage: string, emotionStatus: EmotionStatus): string {
  // 첫 메시지 감지 (인사말)
  if (
    userMessage.includes('안녕') ||
    userMessage.includes('처음') ||
    userMessage.length < 10
  ) {
    const responses = AI_RESPONSES.GREETING;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 감정 상태에 따른 응답
  let responses: string[];
  switch (emotionStatus) {
    case 'POSITIVE':
      responses = AI_RESPONSES.POSITIVE;
      break;
    case 'NEGATIVE':
      responses = AI_RESPONSES.NEGATIVE;
      break;
    case 'NEUTRAL':
      responses = AI_RESPONSES.NEUTRAL;
      break;
    default:
      responses = AI_RESPONSES.DEFAULT;
  }

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * 메시지 목록 조회
 */
export async function mockGetMessages(userId: number): Promise<Message[]> {
  await new Promise((resolve) => setTimeout(resolve, 300)); // 네트워크 지연 시뮬레이션

  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);

  if (!stored) {
    return [];
  }

  const messages: Message[] = JSON.parse(stored);
  return messages;
}

/**
 * 메시지 전송 (사용자 메시지 + AI 응답 생성)
 */
export async function mockSendMessage(
  userId: number,
  content: string
): Promise<{ userMessage: Message; aiMessage: Message }> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션

  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  const messages: Message[] = stored ? JSON.parse(stored) : [];

  // 감정 분석
  const emotionStatus = analyzeEmotion(content);

  // 사용자 메시지 생성
  const userMessage: Message = {
    id: Date.now(),
    sender: 'USER',
    content,
    emotionStatus,
    createdAt: new Date().toISOString(),
  };

  messages.push(userMessage);

  // AI 응답 생성 (1초 delay)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const aiResponse = generateAIResponse(content, emotionStatus);
  const aiMessage: Message = {
    id: Date.now() + 1,
    sender: 'AI',
    content: aiResponse,
    createdAt: new Date().toISOString(),
  };

  messages.push(aiMessage);

  // 최대 메시지 수 제한
  const trimmedMessages = messages.slice(-MAX_MESSAGES);

  // 저장
  localStorage.setItem(key, JSON.stringify(trimmedMessages));

  return { userMessage, aiMessage };
}

/**
 * 대화 이력 삭제
 */
export async function mockClearMessages(userId: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  localStorage.removeItem(key);
}
```

#### 1.3 Conversation 훅 (`useConversation.ts`)

```typescript
import { useState } from 'react';
import { useAuthStore } from '@/features/auth';
import type { Message } from '../types/conversation.types';
import { mockGetMessages, mockSendMessage } from '../api/mockConversationApi';

export function useConversation() {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  /**
   * 메시지 목록 조회
   */
  const loadMessages = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await mockGetMessages(user.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 메시지 전송
   */
  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    setIsSending(true);
    try {
      const { userMessage, aiMessage } = await mockSendMessage(user.id, content.trim());

      // 메시지 추가
      setMessages((prev) => [...prev, userMessage, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    loadMessages,
    sendMessage,
  };
}
```

#### 1.4 Public exports (`index.ts`)

```typescript
// Types
export type { Message, Conversation, MessageSender, EmotionStatus } from './types/conversation.types';

// Hooks
export { useConversation } from './hooks/useConversation';

// API (테스트용)
export { mockGetMessages, mockSendMessage, mockClearMessages } from './api/mockConversationApi';
```

---

### Task 2: 대화 컴포넌트 2개 구현

#### 2.1 ChatMessage 컴포넌트

**파일**: `src/shared/components/business/ChatMessage/ChatMessage.tsx`

```typescript
import type { Message } from '@/features/conversation';

export interface ChatMessageProps {
  message: Message;
}

/**
 * 메시지 말풍선 컴포넌트
 * - 사용자 메시지: 오른쪽 정렬, 파란색 배경
 * - AI 메시지: 왼쪽 정렬, 회색 배경
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'USER';
  const time = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // 감정 상태 이모지
  const emotionEmoji = message.emotionStatus
    ? {
        POSITIVE: '😊',
        NEGATIVE: '😢',
        NEUTRAL: '😐',
      }[message.emotionStatus]
    : null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* 메시지 말풍선 */}
        <div
          className={`rounded-2xl px-5 py-4 ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="text-xl leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* 시간 및 감정 상태 */}
        <div className={`flex items-center gap-2 mt-2 px-2 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm text-gray-500">{time}</span>
          {emotionEmoji && <span className="text-lg">{emotionEmoji}</span>}
        </div>
      </div>
    </div>
  );
}
```

**파일**: `src/shared/components/business/ChatMessage/ChatMessage.types.ts`

```typescript
import type { Message } from '@/features/conversation';

export interface ChatMessageProps {
  message: Message;
}
```

**파일**: `src/shared/components/business/ChatMessage/index.ts`

```typescript
export { ChatMessage } from './ChatMessage';
export type { ChatMessageProps } from './ChatMessage.types';
```

#### 2.2 MessageInput 컴포넌트

**파일**: `src/shared/components/business/MessageInput/MessageInput.tsx`

```typescript
import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/components/ui';

export interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * 메시지 입력 컴포넌트
 * - 큰 입력창 (노인 친화적)
 * - Enter 키로 전송
 * - 전송 버튼
 */
export function MessageInput({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요',
}: MessageInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;

    onSend(value.trim());
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      {/* 입력창 */}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        className="flex-1 resize-none rounded-2xl border-2 border-gray-300 px-5 py-4 text-xl leading-relaxed focus:border-blue-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        onKeyDown={(e) => {
          // Enter 키로 전송 (Shift+Enter는 줄바꿈)
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />

      {/* 전송 버튼 */}
      <Button
        type="submit"
        variant="primary"
        size="extra-large"
        disabled={disabled || !value.trim()}
        className="h-[72px] px-8"
      >
        전송
      </Button>
    </form>
  );
}
```

**파일**: `src/shared/components/business/MessageInput/MessageInput.types.ts`

```typescript
export interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}
```

**파일**: `src/shared/components/business/MessageInput/index.ts`

```typescript
export { MessageInput } from './MessageInput';
export type { MessageInputProps } from './MessageInput.types';
```

---

### Task 3: ConversationPage 구현

**파일**: `src/pages/conversation/ConversationPage.tsx`

```typescript
import { useEffect, useRef } from 'react';
import { Layout } from '@/shared/components/layout';
import { ChatMessage, MessageInput } from '@/shared/components/business';
import { useConversation } from '@/features/conversation';

/**
 * AI 대화 페이지
 * - Journey 2: 첫 안부 메시지 받기
 * - Mock 데이터로 AI 대화 구현 (Phase 3-8에서 API 연결)
 */
export function ConversationPage() {
  const { messages, isLoading, isSending, loadMessages, sendMessage } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 초기 메시지 로드
  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 새 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    try {
      await sendMessage(content);
    } catch {
      // TODO: Phase 3-7에서 공통 Toast 컴포넌트로 교체 예정
      alert('메시지 전송에 실패했습니다');
    }
  };

  return (
    <Layout title="안부 메시지" showBack={true}>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-500">대화 불러오는 중...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  첫 대화를 시작해보세요
                </h2>
                <p className="text-lg text-gray-600">
                  오늘 하루 어떠셨는지 이야기해주세요
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* 메시지 입력창 */}
        <div className="border-t border-gray-200 bg-white px-4 py-4">
          <MessageInput
            onSend={handleSend}
            disabled={isSending}
            placeholder={isSending ? 'AI가 응답 중...' : '메시지를 입력하세요'}
          />
        </div>
      </div>
    </Layout>
  );
}
```

**파일**: `src/pages/conversation/index.ts`

```typescript
export { ConversationPage } from './ConversationPage';
```

---

### Task 4: 대시보드 연동

**파일**: `src/pages/dashboard/DashboardPage.tsx` (수정)

MessageCard에 "대화 시작" 버튼 추가:

```typescript
// 기존 코드...
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export function DashboardPage() {
  const navigate = useNavigate();
  // ...

  return (
    // ...
    {/* 내 안부 메시지 섹션 */}
    {user.dailyCheckEnabled && (
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📬 내 안부 메시지</h2>
        <MessageCard
          title="오늘의 안부 메시지"
          subtitle="AI와 대화를 나눠보세요"
          buttonText="대화 시작"
          onButtonClick={() => navigate(ROUTES.CONVERSATION)}
        />
      </section>
    )}
    // ...
  );
}
```

---

### Task 5: 라우팅 설정

**파일**: `src/shared/constants/routes.ts` (수정)

```typescript
export const ROUTES = {
  // ...
  DASHBOARD: '/dashboard',
  CONVERSATION: '/conversation', // 🆕 추가

  // 보호자 관리 (Phase 3-3)
  GUARDIANS: '/guardians',
  // ...
} as const;
```

**파일**: `src/app/router.tsx` (수정)

```typescript
import { ConversationPage } from '@/pages/conversation'; // 🆕 추가

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFoundPage />,
    children: [
      // ...

      // 🆕 Phase 3-4: AI 대화 라우트
      {
        path: ROUTES.CONVERSATION,
        element: (
          <ProtectedRoute>
            <ConversationPage />
          </ProtectedRoute>
        ),
      },

      // ...
    ],
  },
]);
```

---

## 테스트 계획

### 통합 테스트 시나리오

#### ✅ Journey 2: 김순자 첫 대화

**시나리오**:

1. 김순자 로그인 (soonja@example.com)
2. 대시보드 → "대화 시작" 버튼 클릭
3. /conversation 페이지 진입
4. "안녕하세요" 입력 후 전송
5. AI 응답 확인 (인사말)
6. "오늘 날씨가 좋네요" 입력 후 전송
7. AI 응답 확인 (긍정적 응답)
8. 감정 상태 확인 (POSITIVE 😊)
9. 대화 이력 저장 확인 (localStorage)

**예상 결과**:

- ✅ 메시지 전송 성공
- ✅ AI 응답 1초 후 표시
- ✅ 감정 상태 이모지 표시
- ✅ 자동 스크롤 (최신 메시지로)
- ✅ localStorage에 메시지 저장됨

---

#### ✅ 회귀 테스트: 빈 메시지 전송 방지

**시나리오**:

1. 대화 페이지 진입
2. 빈 메시지 전송 시도 (공백만 입력)
3. 전송 버튼 비활성화 확인

**예상 결과**:

- ✅ 전송 버튼 비활성화
- ✅ 메시지 전송 안 됨

---

#### ✅ 회귀 테스트: 대화 이력 표시

**시나리오**:

1. 대화 페이지에서 메시지 여러 개 전송
2. 페이지 새로고침
3. 대화 이력 표시 확인

**예상 결과**:

- ✅ 이전 대화 이력 표시
- ✅ 날짜/시간 순서 정렬

---

### 빌드 및 품질 검증

| 검증 항목          | 목표  | 비고                  |
| ------------------ | ----- | --------------------- |
| TypeScript 컴파일  | ✅ 통과 | 0 errors              |
| ESLint 검증        | ✅ 통과 | 0 errors, 0 warnings  |
| npm run build      | ✅ 성공 | 빌드 성공             |
| 개발 서버 실행     | ✅ 정상 | 모든 페이지 렌더링 성공 |
| 대화 전송 테스트   | ✅ 통과 | 메시지 전송 및 AI 응답 |
| 감정 분석 테스트   | ✅ 통과 | 키워드 기반 분석 작동  |

---

## 완료 체크리스트

### 기능 완성도

- [ ] features/conversation 모듈 생성 완료
- [ ] ChatMessage, MessageInput 컴포넌트 구현 완료
- [ ] ConversationPage 구현 완료
- [ ] 대시보드 연동 완료
- [ ] 라우팅 설정 완료
- [ ] Mock AI 응답 생성 작동
- [ ] 감정 분석 키워드 기반 작동
- [ ] 대화 이력 localStorage 저장/조회

### 코드 품질

- [ ] TypeScript 빌드 에러 0건
- [ ] ESLint 경고 0건
- [ ] 모든 컴포넌트 타입 정의 완료
- [ ] TODO 주석 적절히 추가 (Phase 3-7, 3-8)

### 사용자 경험

- [ ] 노인 친화적 UI (큰 폰트, 큰 버튼)
- [ ] 사용자/AI 메시지 시각적 구분
- [ ] 자동 스크롤 (최신 메시지로)
- [ ] 전송 중 로딩 표시
- [ ] Enter 키로 메시지 전송 가능
- [ ] 빈 메시지 전송 방지

### 테스트

- [ ] Journey 2 (첫 대화) 시나리오 통과
- [ ] 회귀 테스트: 빈 메시지 방지
- [ ] 회귀 테스트: 대화 이력 표시
- [ ] 빌드 성공
- [ ] 개발 서버 정상 실행

### 문서화

- [ ] Phase 3-4 세부 계획서 작성 완료
- [ ] PHASE3_EXECUTION_PLAN.md 업데이트
- [ ] TODO 주석으로 기술 부채 관리

---

## 마무리

Phase 3-4 (AI 대화 기능) 완료 시:

1. **PHASE3_EXECUTION_PLAN.md 업데이트**

   - Phase 3-4 상태를 "완료"로 변경
   - 진행률 업데이트 (43% → 57%)

2. **다음 단계**
   - Phase 3-5 (설정 관리) 세부 계획 작성
   - 또는 Phase 3-7 (공통 기능 보완) 먼저 구현 (Toast, Modal)

---

**📅 작성일**: 2025-10-18
**✏️ 작성자**: Claude Code
**🔄 버전**: 1.0.0
**📍 Phase**: 3-4 (AI 대화 기능)
**✅ 의존성**: Phase 3-1 (기반 확립) 완료
**🎯 목표**: Journey 2 (첫 안부 메시지 받기) 재현 가능
