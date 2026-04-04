import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000" />
      <div className="relative bg-surface-container-lowest rounded-full p-2 flex items-center shadow-lg border border-outline-variant/20 focus-within:ring-2 ring-secondary/20 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-body px-4 text-base placeholder:text-on-surface-variant/40 resize-none overflow-hidden"
          placeholder={t('chat.placeholder')}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-on-secondary-container transition-all active:scale-95 shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </form>
  );
}
