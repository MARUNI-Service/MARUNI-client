import { Layout } from '@/shared/components';
import { MessageInput, MessageList } from '@/features/conversation/components';

export const ConversationPage = () => {
  return (
    <Layout title="AI 대화" showBack>
      <div className="flex flex-col h-full">
        <MessageList />
        <MessageInput />
      </div>
    </Layout>
  );
};
