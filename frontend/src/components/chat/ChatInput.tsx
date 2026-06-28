import { FormEvent, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

interface ChatInputProps {
  disabled?: boolean;
  onSend: (message: string) => Promise<unknown> | unknown;
}

function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    await onSend(trimmedMessage);
    setMessage('');
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <Input
        disabled={disabled}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="메시지를 입력하세요"
        value={message}
      />
      <Button disabled={disabled || !message.trim()} type="submit">
        전송
      </Button>
    </form>
  );
}

export default ChatInput;
