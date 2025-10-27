import type { Message, EmotionStatus } from '../types/conversation.types';
import { storage } from '@/shared/services/storage';
import { analyzeEmotion } from '@/shared/utils/emotion';
import { simulateError } from '@/__dev__/errorSimulator';

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

  const stored = storage.getConversationMessages(userId);

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
  // 🧪 에러 시뮬레이션 (개발 환경에서만 자동 동작)
  simulateError(content);

  await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션

  const stored = storage.getConversationMessages(userId);
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
  storage.setConversationMessages(userId, JSON.stringify(trimmedMessages));

  return { userMessage, aiMessage };
}
