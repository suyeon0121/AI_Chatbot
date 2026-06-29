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
    <aside className="sidebar">
      {/* 상단 영역: 새 채팅방 버튼 및 방 목록 */}
      <div className="sidebar-top">
        <Button onClick={onCreateRoom} type="button">
          새 대화
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
      </div>

      {/* 하단 영역: 로그인 및 설정 버튼 푸터 배치 */}
      <div className="sidebar-footer">
        <div className="sidebar-actions">
          <Link className="sidebar-action-btn" to="/login">
            로그인
          </Link>
          <button className="sidebar-action-btn" type="button">
            설정
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;