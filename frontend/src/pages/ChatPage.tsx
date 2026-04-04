import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useChat } from '../hooks/useChat';
import Navbar from '../components/common/Navbar';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';

export default function ChatPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { situation, chatHistory, addMessage, suggestClinics } = useAppContext();
  const { isLoading, error, sendMessage } = useChat();
  const seededRef = useRef(false);

  // Route guard: redirect if no situation selected
  useEffect(() => {
    if (!situation) {
      navigate('/', { replace: true });
    }
  }, [situation, navigate]);

  // Seed opening message on mount (ref prevents StrictMode double-fire)
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

  if (!situation) return null;

  // Need seed(1) + user(1) + model response(1) = 3 messages for a real exchange
  const clinicsActive = chatHistory.length >= 3;

  return (
    <div className="bg-surface min-h-screen flex flex-col overflow-hidden">
      <Navbar
        showFindClinics
        clinicsActive={clinicsActive}
        suggestPulse={suggestClinics}
      />

      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pt-6 pb-6">
        {/* Header */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black font-headline text-primary tracking-tight mb-2">
            {t('chat.title')}
          </h1>
          <p className="text-on-surface-variant font-body text-base max-w-xl">
            {t('chat.subtitle')}
          </p>
        </div>

        {/* Chat Window */}
        <ChatWindow messages={chatHistory} isLoading={isLoading} />

        {/* Error */}
        {error && (
          <div className="text-center mb-3">
            <p className="text-sm text-error bg-error/10 inline-block px-4 py-2 rounded-xl">{error}</p>
          </div>
        )}

        {/* Chat Input */}
        <ChatInput onSend={sendMessage} disabled={isLoading} />

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-on-surface-variant/60 mt-4 px-12">
          {t('chat.disclaimer')}
        </p>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav active="chat" />
    </div>
  );
}

function MobileBottomNav({ active }: { active: 'home' | 'chat' | 'map' | 'support' }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const items = [
    { key: 'home', icon: 'home', label: t('nav.home'), path: '/' },
    { key: 'chat', icon: 'medical_services', label: t('nav.triage'), path: '/chat' },
    { key: 'map', icon: 'location_on', label: t('nav.map'), path: '/clinics' },
    { key: 'support', icon: 'contact_support', label: t('nav.support'), path: '#' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 md:hidden bg-surface/80 backdrop-blur-xl border-t border-primary/10 shadow-[0_-4px_24px_rgba(154,64,40,0.08)]">
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => item.path !== '#' && navigate(item.path)}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive
                ? 'bg-primary text-white rounded-full p-3 mb-2 scale-110'
                : 'text-secondary opacity-60'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[11px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </footer>
  );
}
