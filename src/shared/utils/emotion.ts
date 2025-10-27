/**
 * 감정 상태 관리 유틸리티
 * - 모든 감정 관련 로직 중앙화
 * - 일관된 이모지/텍스트/색상 제공
 */

export type EmotionStatus = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'WARNING';

export const EMOTION_CONFIG = {
  POSITIVE: {
    emoji: '😊',
    text: '좋음',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  NEGATIVE: {
    emoji: '😢',
    text: '안 좋음',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
  WARNING: {
    emoji: '⚠️',
    text: '주의',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  NEUTRAL: {
    emoji: '😐',
    text: '보통',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
} as const;

/**
 * 감정 상태에 따른 설정 반환
 */
export function getEmotionConfig(status: EmotionStatus) {
  return EMOTION_CONFIG[status] || EMOTION_CONFIG.NEUTRAL;
}

/**
 * 감정 분석 키워드
 */
export const EMOTION_KEYWORDS = {
  POSITIVE: ['좋', '행복', '즐거', '기쁘', '건강', '좋아', '재밌', '웃', '감사', '사랑'],
  NEGATIVE: ['슬프', '아프', '힘들', '외롭', '싫', '나빠', '우울', '걱정', '불안', '아파'],
};

/**
 * 텍스트에서 감정 분석 (키워드 기반)
 */
export function analyzeEmotion(content: string): EmotionStatus {
  const lower = content.toLowerCase();

  if (EMOTION_KEYWORDS.POSITIVE.some((keyword) => lower.includes(keyword))) {
    return 'POSITIVE';
  }

  if (EMOTION_KEYWORDS.NEGATIVE.some((keyword) => lower.includes(keyword))) {
    return 'NEGATIVE';
  }

  return 'NEUTRAL';
}
