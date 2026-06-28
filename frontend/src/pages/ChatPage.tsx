import ChatInput from '../components/chat/ChatInput';
import MessageList from '../components/chat/MessageList';
import Sidebar from '../components/layout/Sidebar';
import { useChat } from '../hooks/useChat';

function ChatPage() {
  const {
    activeRoomId,
    createRoom,
    isLoading,
    messages,
    rooms,
    sendMessage,
    setActiveRoomId,
  } = useChat();

  return (
    <main className="chat-page">
      <Sidebar
        activeRoomId={activeRoomId}
        onCreateRoom={createRoom}
        onSelectRoom={setActiveRoomId}
        rooms={rooms}
      />
      <section className="chat-panel">
        <MessageList messages={messages} />
        <ChatInput disabled={isLoading || !activeRoomId} onSend={sendMessage} />
      </section>
    </main>
  );
}

export default ChatPage;
