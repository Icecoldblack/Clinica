import { useEffect, useRef, useState } from 'react';
import { apiUrl } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
}

const SUGGESTED_QUESTIONS = [
  'Can I take over-the-counter medication for this?',
  'What home remedies might help?',
  'When should I go to the ER?',
  'How long until I feel better?',
  'Should I avoid any foods or activities?',
  'Is this contagious?',
];

export default function ChatPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = sessionStorage.getItem('sessionId');

  // Load existing chat history
  useEffect(() => {
    if (!sessionId) {
      setInitialLoading(false);
      return;
    }
    fetch(apiUrl(`/api/chat/history/${sessionId}`))
      .then(res => res.json())
      .then((history: Message[]) => {
        setMessages(history);
        setInitialLoading(false);
      })
      .catch(() => setInitialLoading(false));
  }, [sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !sessionId || loading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: parseInt(sessionId, 10), message: text.trim() })
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json();
      const aiMessage: Message = { role: 'model', content: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSaveReport = () => {
    if (!sessionId) return;
    window.open(apiUrl(`/api/summary/${sessionId}`), '_blank');
  };

  if (!sessionId) {
    return (
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24 text-center">
        <h1 className="text-2xl font-bold mb-4">No Session Found</h1>
        <p className="mb-6">Please start from the intake page.</p>
        <button onClick={() => navigate('/intake')} className="bg-primary px-6 py-2 text-white rounded-xl">
          Go to Intake
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 pt-8 pb-24 flex flex-col" style={{ minHeight: 'calc(100vh - 160px)' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface">MedaPath AI Assistant</h1>
              <p className="text-xs text-on-surface-variant">Ask follow-up questions about your diagnosis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveReport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Save Report
            </button>
            <button
              onClick={() => navigate('/results')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Results
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600 text-sm">info</span>
          <p className="text-xs text-amber-800">
            This AI assistant provides general health information only. It is <strong>not</strong> a substitute for professional medical advice.
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px]">
        {initialLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          /* Welcome State */
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary/20 to-primary-container/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
            </div>
            <h2 className="text-lg font-bold text-on-surface mb-2">How can I help?</h2>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
              I have your symptom details and diagnosis. Ask me anything about your condition, treatment options, or what to expect.
            </p>

            {/* Suggested Questions */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="px-3.5 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed-variant hover:border-primary/20 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      smart_toy
                    </span>
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-surface-container-lowest border border-outline-variant/10 text-on-surface rounded-bl-md shadow-sm'
                  }`}
                >
                  {msg.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-sm text-error bg-error/10 inline-block px-4 py-2 rounded-xl">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions after first exchange */}
      {messages.length > 0 && messages.length <= 4 && !loading && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SUGGESTED_QUESTIONS.slice(0, 3)
            .filter(q => !messages.some(m => m.content === q))
            .map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-full bg-surface-container text-xs text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-all"
              >
                {q}
              </button>
            ))}
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={loading}
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-5 py-3.5 pr-12 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        </button>
      </form>
    </main>
  );
}
