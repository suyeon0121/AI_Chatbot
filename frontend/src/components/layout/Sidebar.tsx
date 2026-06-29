import { Link } from 'react-router-dom';
import type { ChatRoom } from '../../types/chat';

interface SidebarProps {
  activeRoomId: string | null;
  onCreateRoom: () => void;
  onSelectRoom: (roomId: string) => void;
  rooms: ChatRoom[];
}

function Sidebar({ activeRoomId, onCreateRoom, onSelectRoom, rooms }: SidebarProps) {
  return (
    <aside className="sidebar">
      <Button onClick={onCreateRoom} type="button">
        새 채팅방 만들기
      </Button>
      <nav className="room-list">
        {rooms.map((room) => (
          <button
            key={room.id}
            className={`room ${room.id.toString() === activeRoomId ? 'active' : ''}`}
            onClick={() => onSelectRoom(room.id.toString())}
            type="button"
          >
            {room.title}
          </button>
        ))}
      </nav>
      <div className="sidebar-actions">
        <Link className="sidebar-action" to="/login">
          로그인
        </Link>
        <button className="sidebar-action" type="button">설정</button>
      </div>
    </aside>
  );
}

export default Sidebar;