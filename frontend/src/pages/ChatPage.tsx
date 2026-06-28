import ChatInput from '../components/chat/ChatInput';
import MessageList from '../components/chat/MessageList';
import Sidebar from '../components/layout/Sidebar';
import type { ChatRoom, Message } from '../types/chat';

const emptyRooms: ChatRoom[] = [];
const emptyMessages: Message[] = [];

function createRoom(): Promise<void> {
  return Promise.resolve();
}

function selectRoom(): void {
  return undefined;
}

function sendMessage(): Promise<void> {
  return Promise.resolve();
}

function ChatPage() {
  return (
    <main className="chat-page">
      <Sidebar
        activeRoomId={null}
        onCreateRoom={createRoom}
        onSelectRoom={selectRoom}
        rooms={emptyRooms}
      />
      <section className="chat-panel">
        <MessageList messages={emptyMessages} />
        <ChatInput disabled onSend={sendMessage} />
      </section>
    </main>
  );
}

export default ChatPage;
