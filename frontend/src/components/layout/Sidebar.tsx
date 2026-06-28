import Button from '../common/Button';
import type { ChatRoom } from '../../types/chat';

interface SidebarProps {
  activeRoomId: number | null;
  onCreateRoom: () => Promise<unknown> | unknown;
  onSelectRoom: (roomId: number) => void;
  rooms: ChatRoom[];
}

function Sidebar({ activeRoomId, onCreateRoom, onSelectRoom, rooms }: SidebarProps) {
  return (
    <aside className="sidebar">
      <Button onClick={onCreateRoom}>새 대화</Button>
      <nav className="room-list">
        {rooms.map((room) => (
          <button
            className={room.id === activeRoomId ? 'room active' : 'room'}
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            type="button"
          >
            {room.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
