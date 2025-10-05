import { useState } from 'react';
import { Button, Input } from '@/shared/components';
import { useSendMessage } from '../hooks';

export const MessageInput = () => {
  const [input, setInput] = useState('');
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    sendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 bg-white border-t">
      <div className="flex-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={isPending}
        />
      </div>
      <Button type="submit" disabled={isPending || !input.trim()} variant="primary">
        전송
      </Button>
    </form>
  );
};
