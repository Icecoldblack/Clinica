import type { ChatMessage as ChatMsg } from '../../context/AppContext';

interface ChatMessageProps {
  message: ChatMsg;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex gap-4 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-secondary">smart_toy</span>
        </div>
      )}
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary-container text-xl">person</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`p-5 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-primary text-white rounded-tr-none shadow-md'
            : 'bg-surface-container-lowest border border-outline-variant/10 rounded-tl-none'
        }`}
      >
        <p className="font-body leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {time && (
          <span
            className={`text-[10px] mt-2 block font-medium uppercase tracking-widest ${
              isUser ? 'text-white/70 text-right' : 'text-on-surface-variant/50'
            }`}
          >
            {time}
          </span>
        )}
      </div>
    </div>
  );
}
