import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/components/ui';
import type { MessageInputProps } from './MessageInput.types';

/**
 * 메시지 입력 컴포넌트
 * - 큰 입력창 (노인 친화적)
 * - Enter 키로 전송
 * - 전송 버튼
 *
 * TODO: Phase 3-6 완료 후 컴포넌트 위치 재검토
 * - 1개 feature에서만 사용 시 features/conversation/components/로 이동
 * - 2개 이상 feature에서 사용 확인되면 현재 위치 유지
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
