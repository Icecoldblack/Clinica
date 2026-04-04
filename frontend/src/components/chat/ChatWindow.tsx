import { useRef, useEffect } from 'react';
import type { ChatMessage as ChatMsg } from '../../context/AppContext';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: ChatMsg[];
  isLoading: boolean;
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 bg-surface-container-low rounded-3xl p-4 md:p-8 overflow-y-auto custom-scrollbar mb-6 flex flex-col gap-6">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg} />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={endRef} />
    </div>
  );
}
