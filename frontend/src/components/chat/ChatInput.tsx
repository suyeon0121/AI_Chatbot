import { FormEvent, useState } from 'react';

interface ChatInputProps {
  disabled?: boolean;
  onSend: (message: string) => Promise<unknown> | unknown;
}

function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    await onSend(trimmedMessage);
    setMessage('');
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        borderTop: '1px solid #e5e7eb',
        padding: '16px',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', gap: '8px', width: '100%' }}>
        <input
          disabled={disabled}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="메시지를 입력하세요"
          value={message}
          style={{
            flex: 1,
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button 
          disabled={disabled || !message.trim()} 
          type="submit"
          style={{
            backgroundColor: message.trim() ? '#1f2937' : '#e5e7eb',
            color: message.trim() ? '#ffffff' : '#9ca3af',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: message.trim() ? 'pointer' : 'default'
          }}
        >
          전송
        </button>
      </div>
    </form>
  );
}

export default ChatInput;