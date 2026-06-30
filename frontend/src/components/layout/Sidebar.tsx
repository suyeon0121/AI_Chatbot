import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import type { ChatRoom } from '../../types/chat';

interface SidebarProps {
  activeRoomId: string | null;
  isAuthenticated?: boolean;
  isCreateRoomDisabled?: boolean;
  onCreateRoom: () => void;
  onDeleteRoom: (roomId: string) => void;
  onLogout?: () => void;
  onSelectRoom: (roomId: string) => void;
  rooms: ChatRoom[];
}

function Sidebar({
  rooms,
  onCreateRoom,
  onDeleteRoom,
  onLogout,
  onSelectRoom,
  activeRoomId,
  isAuthenticated = false,
  isCreateRoomDisabled = false,
}: SidebarProps) {
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      onLogout?.();
      navigate('/login');
      return;
    }

    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Button disabled={isCreateRoomDisabled} onClick={onCreateRoom}>
          새 대화
        </Button>
        
        <nav className="room-list">
          {rooms.map(room => (
            <div
              className={`room-row ${room.id.toString() === activeRoomId ? 'active' : ''}`}
              key={room.id}
            >
              <button
                className="room"
                onClick={() => onSelectRoom(room.id.toString())}
                type="button"
              >
                {room.title}
              </button>
              <button
                aria-label={`${room.title} 삭제`}
                className="room-delete"
                onClick={() => onDeleteRoom(room.id.toString())}
                type="button"
              >
                🗑
              </button>
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer-actions">
        <button className="button sidebar-footer-btn" onClick={handleAuthAction} type="button">
          {isAuthenticated ? '로그아웃' : '로그인'}
        </button>
        <Button className="sidebar-footer-btn">설정</Button>
      </div>
    </aside>
  );
}
export default Sidebar;
