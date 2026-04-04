import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ChatMessage as ChatMsg } from '../../context/AppContext';
import EmbeddedHospitalCards from './EmbeddedHospitalCards';

interface ChatMessageProps {
  message: ChatMsg;
}

// Detect resource/legal topics in model responses
const RESOURCE_TRIGGERS = [
  { patterns: ['fqhc', 'federally qualified', 'centro de salud calificado'], icon: 'verified_user', labelKey: 'chat.learn_fqhc', url: 'https://findahealthcenter.hrsa.gov/' },
  { patterns: ['immigration', 'immigrant', 'inmigración', 'estatus migratorio', 'public charge', 'carga pública', 'deport'], icon: 'gavel', labelKey: 'chat.learn_rights', url: 'https://www.nilc.org/issues/health-care/update-on-access-to-health-care-for-immigrants-and-their-families/' },
  { patterns: ['sliding fee', 'escala móvil', 'sliding scale', 'based on your income', 'según sus ingresos'], icon: 'payments', labelKey: 'chat.learn_costs', url: 'https://www.healthcare.gov/uninsured/getting-health-care/' },
  { patterns: ['988', 'suicide', 'crisis lifeline', 'línea de crisis', 'suicidio'], icon: 'emergency', labelKey: 'chat.crisis_resources', url: 'https://988lifeline.org/' },
];

function detectResources(text: string) {
  const lower = text.toLowerCase();
  return RESOURCE_TRIGGERS.filter(t => t.patterns.some(p => lower.includes(p)));
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const navigate = useNavigate();
  const { t } = useTranslation();
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const detectedResources = !isUser ? detectResources(message.content) : [];

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

      {/* Bubble + embeds */}
      <div className="flex flex-col gap-0 min-w-0">
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

        {/* Resource links — only for model messages */}
        {!isUser && detectedResources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 ml-4 mb-2">
            {detectedResources.map((r) => (
              <a
                key={r.labelKey}
                href={r.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary text-xs font-bold px-3 py-1.5 rounded-full hover:bg-tertiary/20 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">{r.icon}</span>
                {t(r.labelKey, r.labelKey.split('.').pop()?.replace(/_/g, ' ') || '')}
              </a>
            ))}
          </div>
        )}

        {/* Embedded hospital cards — only for model messages with hospitals */}
        {!isUser && message.hospitals && message.hospitals.length > 0 && (
          <EmbeddedHospitalCards
            hospitals={message.hospitals}
            hospitalSearchContext={message.hospitalSearchContext}
            searchInsurance={message.searchInsurance}
            searchPlan={message.searchPlan}
          />
        )}
      </div>
    </div>
  );
}
