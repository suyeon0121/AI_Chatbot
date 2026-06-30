import ChatInput from '../components/chat/ChatInput';
import MessageList from '../components/chat/MessageList';
import Sidebar from '../components/layout/Sidebar';
import Spinner from '../components/common/Spinner'; // 이전에 만든 Spinner 활용
import { useChat } from '../hooks/useChat'; // 고도화한 useChat 훅 import

function ChatPage() {
  // 1. 커스텀 훅에서 필요한 모든 상태와 액션 가져오기
  const {
    activeRoomId,
    rooms,
    messages,
    isLoadingRooms,
    isLoadingMessages,
    isSendingMessage,
    createRoom,
    selectRoom,
    sendMessage,
    error,
    clearError
  } = useChat();

  return (
    <main className="chat-page">
      {/* 2. 에러가 발생했을 때 상단에 글로벌 토스트/바 형태로 보여주기 (선택) */}
      {error && (
        <div className="absolute top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-md flex items-center gap-2">
          <span>{error}</span>
          <button onClick={clearError} className="font-bold hover:text-red-900">×</button>
        </div>
      )}

      {/* 3. 사이드바 연결 */}
      <Sidebar
        activeRoomId={activeRoomId ? activeRoomId.toString() : null}
        onCreateRoom={createRoom}
        onSelectRoom={(id) => selectRoom(Number(id))} // string을 다시 number로 변환하여 훅에 전달
        rooms={rooms}
      />

      {/* 4. 메인 채팅 영역 */}
      {/* 사이드바가 fixed(width: 260px)이므로, 메인 영역이 겹치지 않도록 pl-[260px] 레이아웃 추가 */}
      <section className="flex-1 flex flex-col h-full pl-[260px] relative overflow-hidden">
        {isLoadingRooms ? (
          // 초기 방 목록 로딩 시 전체 화면 스피너
          <div className="flex-1 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* 메시지 리스트 영역 */}
            <div className="flex-1 overflow-y-auto relative">
              {isLoadingMessages ? (
                // 특정 방의 대화 내역을 가져올 때의 로딩 처리
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <Spinner size="md" />
                </div>
              ) : null}
              <MessageList messages={messages} />
            </div>

            {/* 메시지 입력창 영역 */}
            {/* 방이 하나도 없거나 선택되지 않았다면 입력창을 원천 비활성화 */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <ChatInput 
                disabled={activeRoomId === null || isSendingMessage} 
                onSend={sendMessage} 
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default ChatPage;