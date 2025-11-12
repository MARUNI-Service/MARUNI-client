import type { ChatMessageProps } from './ChatMessage.types';

/**
 * 메시지 말풍선 컴포넌트
 * - 사용자 메시지: 오른쪽 정렬, 파란색 배경
 * - AI 메시지: 왼쪽 정렬, 회색 배경
 *
 * TODO: Phase 3-6 완료 후 컴포넌트 위치 재검토
 * - 1개 feature에서만 사용 시 features/conversation/components/로 이동
 * - 2개 이상 feature에서 사용 확인되면 현재 위치 유지
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'USER_MESSAGE';
  const time = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  });

  // 감정 상태 이모지 (Phase 3-8: EmotionType으로 변경)
  const emotionEmoji = message.emotion
    ? {
        POSITIVE: '😊',
        NEGATIVE: '😢',
        NEUTRAL: '😐',
      }[message.emotion]
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
