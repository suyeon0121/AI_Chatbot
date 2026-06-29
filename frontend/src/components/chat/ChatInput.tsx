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
    <form className="w-full border-t border-gray-200 p-4 bg-white" onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto flex gap-2 w-full items-center">
        <div className="flex-1">
          <Input
            disabled={disabled}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="메시지를 입력하세요"
            value={message}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black text-sm"
          />
        </div>
        <Button 
          disabled={disabled || !message.trim()} 
          type="submit"
          className="bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:bg-gray-200 disabled:text-gray-400"
        >
          전송
        </Button>
      </div>
    </form>
  );
}

export default ChatInput;