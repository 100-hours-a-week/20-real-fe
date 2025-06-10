import { Send } from 'lucide-react';

import { Button } from '../../../../shared/ui/component/Button';
import { Input } from '../../../../shared/ui/component/Input';

interface ChatInputProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, isLoading, onChange, onSend }: ChatInputProps) {
  return (
    <form
      className="relative bottom-0 w-full max-w-app"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <div className="bg-white p-4 border-t border-gray-100 rounded-t-3xl">
        <div className="flex items-center bg-white rounded-full pr-2 gap-2">
          <Input
            type="text"
            placeholder="질문을 입력하세요"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-gray-700 rounded-full"
            autoFocus
            data-testid="chat-input"
          />
          <Button
            type="submit"
            size="icon"
            className={`text-white shrink-0 ${isLoading || value === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading || value === ''}
            data-testid="send-button"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </form>
  );
}
