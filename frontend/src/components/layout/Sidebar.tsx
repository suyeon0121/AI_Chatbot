import { Link } from 'react-router-dom';
import Button from '../common/Button';
import type { ChatRoom } from '../../types/chat';

interface SidebarProps {
  activeRoomId: string | null;
  isCreateRoomDisabled?: boolean;
  onCreateRoom: () => void;
  onSelectRoom: (roomId: string) => void;
  rooms: ChatRoom[];
}

function Sidebar({
  rooms,
  onCreateRoom,
  onSelectRoom,
  activeRoomId,
  isCreateRoomDisabled = false,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Button disabled={isCreateRoomDisabled} onClick={onCreateRoom}>
          새 대화
        </Button>
        
        <nav className="room-list">
          {rooms.map(room => (
            <button 
              key={room.id} 
              className={`room ${room.id.toString() === activeRoomId ? 'active' : ''}`}
              onClick={() => onSelectRoom(room.id.toString())}
            >
              {room.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer-actions">
        <Link to="/login" className="button sidebar-footer-btn">로그인</Link>
        <Button className="sidebar-footer-btn">설정</Button>
      </div>
    </aside>
  );
}
export default Sidebar;
