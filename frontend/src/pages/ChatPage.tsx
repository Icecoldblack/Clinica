import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useChat } from '../hooks/useChat';
import { summarizeSession } from '../services/profileService';
import SidebarLayout from '../components/layout/SidebarLayout';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';

export default function ChatPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { situation, chatHistory, addMessage, suggestClinics, sessionId, language, completeSession } = useAppContext();
  const { isLoading, error, sendMessage } = useChat();
  const [isFinishing, setIsFinishing] = useState(false);
  const seededRef = useRef(false);

  // Seed opening message (ref prevents StrictMode double-fire)
  useEffect(() => {
    if (situation && chatHistory.length === 0 && !seededRef.current) {
      seededRef.current = true;
      const openingKey = `chat.opening_${situation}`;
      addMessage({
        role: 'model',
        content: t(openingKey),
        timestamp: new Date().toISOString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [situation]);

  const handleFinishSession = async () => {
    setIsFinishing(true);
    try {
      const summary = await summarizeSession(sessionId, language, situation!, chatHistory);
      completeSession(sessionId, summary);
      navigate('/profile');
    } catch (e) {
      console.error(e);
      navigate('/profile');
    } finally {
      setIsFinishing(false);
    }
  };

  if (!situation) return <Navigate to="/" replace />;

  return (
    <SidebarLayout activeNav="chat">
      <main className="flex flex-col max-w-3xl w-full mx-auto px-4 py-6" style={{ height: 'calc(100vh - 73px)' }}>
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start items-center text-center md:text-left gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black font-headline text-primary tracking-tight mb-2">
              {t('chat.title')}
            </h1>
            <p className="text-on-surface-variant font-body text-base max-w-xl">
              {t('chat.subtitle')}
            </p>
          </div>
          <button
            onClick={handleFinishSession}
            disabled={isFinishing || chatHistory.length === 0}
            className="flex bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-5 py-2.5 rounded-lg font-bold items-center gap-2 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            {isFinishing ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined">task_alt</span>
            )}
            {t('profile.finish_session', 'Finish Session')}
          </button>
        </div>

        {/* Chat Window */}
        <ChatWindow messages={chatHistory} isLoading={isLoading} />

        {/* Error */}
        {error && (
          <div className="text-center mb-3">
            <p className="text-sm text-error bg-error/10 inline-block px-4 py-2 rounded-xl">{error}</p>
          </div>
        )}

        {suggestClinics && (
          <div className="text-center mb-3">
            <button
              onClick={() => navigate('/hospitals')}
              className="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-on-secondary-container transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">local_hospital</span>
              {t('nav.hospitals')}
            </button>
          </div>
        )}

        {/* Chat Input */}
        <ChatInput onSend={sendMessage} disabled={isLoading} />

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-on-surface-variant/60 mt-4 px-12">
          {t('chat.disclaimer')}
        </p>
      </main>
    </SidebarLayout>
  );
}
