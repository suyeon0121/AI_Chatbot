import type { Message } from '../../types/chat';

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return <div className="empty-state">아직 메시지가 없습니다.</div>;
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <article className={`message message-${message.sender_type}`} key={message.id}>
          <span>{message.sender_type === 'user' ? '나' : 'AI'}</span>
          <p>{message.content}</p>
        </article>
      ))}
    </div>
  );
}

export default MessageList;
