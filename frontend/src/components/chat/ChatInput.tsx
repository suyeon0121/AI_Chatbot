import { FormEvent, useState } from 'react';

interface ChatInputProps {
  disabled?: boolean;
  onSend: (message: string) => Promise<unknown> | unknown;
}

function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false); // 메시지 전송 중 로딩 상태 추가

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    
    // 이미 전송 중이거나 메시지가 비어있다면 실행 방지
    if (!trimmedMessage || isSending || disabled) return;

    try {
      setIsSending(true);
      await onSend(trimmedMessage);
      setMessage(''); // 전송 성공 시에만 입력창 초기화
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      // 필요에 따라 사용자에게 에러 알림(Toast 등)을 띄울 수 있습니다.
    } finally {
      setIsSending(false);
    }
  };

  const isInputDisabled = disabled || isSending;

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
        <input
          disabled={isInputDisabled}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={isSending ? "메시지를 보내는 중..." : "메시지를 입력하세요"}
          value={message}
          className="input" 
        />
        <button 
          disabled={isInputDisabled || !message.trim()} // 빈 메시지일 때 버튼 비활성화
          type="submit"
          className="button" 
        >
          {isSending ? "전송 중..." : "전송"}
        </button>
      </div>
    </form>
  );
}

export default ChatInput;