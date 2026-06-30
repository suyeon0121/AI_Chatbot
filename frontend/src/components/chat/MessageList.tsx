import { useEffect, useRef } from 'react';
import type { Message } from '../../types/chat';

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 새로운 메시지가 추가되면 자동으로 최하단으로 스크롤 이동
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="empty-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
        아직 메시지가 없습니다.
      </div>
    );
  }

  return (
    <div className="message-list" style={{ overflowY: 'auto', height: '100%', padding: '16px' }}>
      {messages.map((message) => (
        <article 
          className={`message ${message.sender_type === 'user' ? 'message-user' : ''}`} 
          key={message.id}
          style={{ marginBottom: '12px' }}
        >
          <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            {message.sender_type === 'user' ? '나' : 'AI'}
          </span>
          {/* whiteSpace 지정을 통해 줄바꿈(\n)이 화면에 그대로 표시되도록 설정 */}
          <p style={{ whiteSpace: 'pre-wrap', margin: 0, wordBreak: 'break-word' }}>
            {message.content}
          </p>
        </article>
      ))}
      {/* 스크롤 위치를 잡기 위한 더미 div */}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;