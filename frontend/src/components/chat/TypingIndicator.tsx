export default function TypingIndicator() {
  return (
    <div className="flex gap-4 max-w-[85%]">
      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-secondary">smart_toy</span>
      </div>
      <div className="bg-surface-container-lowest p-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 border border-outline-variant/10">
        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-typing-1" />
        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-typing-2" />
        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-typing-3" />
        <span className="text-xs text-secondary font-medium ml-2">Clínica</span>
      </div>
    </div>
  );
}
