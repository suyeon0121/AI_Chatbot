import { Link } from 'react-router-dom';
import Button from '../common/Button';
import type { ChatRoom } from '../../types/chat';

interface SidebarProps {
  activeRoomId: string | null;
  onCreateRoom: () => void;
  onSelectRoom: (roomId: string) => void;
  rooms: ChatRoom[];
}

function Sidebar({ activeRoomId, onCreateRoom, onSelectRoom, rooms }: SidebarProps) {
  return (
    <aside className="w-60 bg-gray-50 border-r border-gray-200 p-3 flex flex-col justify-between h-full select-none">
      {/* 상단 그룹: 새 대화 생성 버튼 및 채팅방 리스트 영역 */}
      <div className="flex flex-col gap-3 overflow-hidden">
        <div className="w-full text-center">
          <Button 
            onClick={onCreateRoom} 
            type="button"
            className="w-full bg-black text-white py-1.5 px-3 rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
          >
            새 대화
          </Button>
        </div>
        
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {rooms.map((room) => (
            <button
              key={room.id}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors truncate ${
                room.id.toString() === activeRoomId
                  ? 'bg-gray-200 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => onSelectRoom(room.id.toString())}
              type="button"
            >
              {room.title}
            </button>
          ))}
        </nav>
      </div>

      {/* 하단 그룹: 로그인 및 설정 고정 버튼 영역 */}
      <div className="flex flex-col gap-1.5 border-t border-gray-200 pt-3">
        <Link
          className="w-full text-center border border-gray-300 bg-white py-1.5 px-3 rounded-md text-xs text-gray-600 font-medium hover:bg-gray-50 transition-colors block"
          to="/login"
        >
          로그인
        </Link>
        <button
          className="w-full text-center border border-gray-300 bg-white py-1.5 px-3 rounded-md text-xs text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          type="button"
        >
          설정
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;