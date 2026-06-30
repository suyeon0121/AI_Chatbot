import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import type { ChatRoom } from '../../types/chat';

interface SidebarProps {
  activeRoomId: string | null;
  isAuthenticated?: boolean;
  isCreateRoomDisabled?: boolean;
  onLogout?: () => void;
  onCreateRoom: () => void;
  onSelectRoom: (roomId: string) => void;
  rooms: ChatRoom[];
}

function Sidebar({
  rooms,
  onCreateRoom,
  onSelectRoom,
  onLogout,
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
        <button className="button sidebar-footer-btn" onClick={handleAuthAction} type="button">
          {isAuthenticated ? '로그아웃' : '로그인'}
        </button>
        <Button className="sidebar-footer-btn">설정</Button>
      </div>
    </aside>
  );
}
export default Sidebar;
