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
    <aside 
      style={{
        width: '240px',
        backgroundColor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'between',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* 상단 그룹 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <button 
          onClick={onCreateRoom} 
          type="button"
          style={{
            width: '105px',
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          새 대화
        </button>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id.toString())}
              type="button"
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                border: 'none',
                backgroundColor: room.id.toString() === activeRoomId ? '#e5e7eb' : 'transparent',
                color: room.id.toString() === activeRoomId ? '#111827' : '#4b5563',
                cursor: 'pointer'
              }}
            >
              {room.title}
            </button>
          ))}
        </nav>
      </div>

      {/* 하단 그룹 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
        <Link
          to="/login"
          style={{
            width: '100%',
            textAlign: 'center',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#374151',
            textDecoration: 'none',
            fontWeight: '500',
            boxSizing: 'border-box',
            display: 'block'
          }}
        >
          로그인
        </Link>
        <button
          type="button"
          style={{
            width: '100%',
            textAlign: 'center',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#374151',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          설정
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;