import type { Message } from '../../types/chat';

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 font-medium text-sm select-none">
        아직 메시지가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full max-w-3xl mx-auto flex flex-col">
      {messages.map((message) => (
        <article 
          className={`flex flex-col gap-1 max-w-[80%] ${
            message.sender_type === 'user' ? 'self-end items-end' : 'self-start items-start'
          }`} 
          key={message.id}
        >
          <span className="text-xs text-gray-400 font-medium px-1">
            {message.sender_type === 'user' ? '나' : 'AI'}
          </span>
          <p className={`p-3 rounded-lg text-sm ${
            message.sender_type === 'user' 
              ? 'bg-black text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}>
            {message.content}
          </p>
        </article>
      ))}
    </div>
  );
}

export default MessageList;