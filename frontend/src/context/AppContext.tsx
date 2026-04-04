import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Simple UUID v4 generator
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Types ───
export type Situation = 'no_insurance' | 'undocumented' | 'mental_health' | 'insured';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
}

export interface Filters {
  noInsurance: boolean;
  noDocuments: boolean;
  mentalHealth: boolean;
}

export interface AppState {
  language: 'en' | 'es';
  situation: Situation | null;
  sessionId: string;
  chatHistory: ChatMessage[];
  filters: Filters;
  userLocation: { lat: number; lng: number } | null;
  suggestClinics: boolean;
}

interface AppContextType extends AppState {
  setLanguage: (lang: 'en' | 'es') => void;
  setSituation: (s: Situation) => void;
  addMessage: (msg: ChatMessage) => void;
  setFilters: (f: Filters) => void;
  setUserLocation: (coords: { lat: number; lng: number }) => void;
  setSuggestClinics: (v: boolean) => void;
}

const SITUATION_FILTER_MAP: Record<Situation, Filters> = {
  no_insurance: { noInsurance: true, noDocuments: false, mentalHealth: false },
  undocumented: { noInsurance: true, noDocuments: true, mentalHealth: false },
  mental_health: { noInsurance: false, noDocuments: false, mentalHealth: true },
  insured: { noInsurance: false, noDocuments: false, mentalHealth: false },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  const [language, _setLanguage] = useState<'en' | 'es'>('en');
  const [situation, _setSituation] = useState<Situation | null>(null);
  const [sessionId] = useState(() => generateId());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [filters, _setFilters] = useState<Filters>({ noInsurance: false, noDocuments: false, mentalHealth: false });
  const [userLocation, _setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [suggestClinics, _setSuggestClinics] = useState(false);

  const setLanguage = useCallback((lang: 'en' | 'es') => {
    _setLanguage(lang);
    i18n.changeLanguage(lang);
  }, [i18n]);

  const setSituation = useCallback((s: Situation) => {
    _setSituation(s);
    _setFilters(SITUATION_FILTER_MAP[s]);
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setChatHistory(prev => [...prev, msg]);
  }, []);

  const setFilters = useCallback((f: Filters) => {
    _setFilters(f);
  }, []);

  const setUserLocation = useCallback((coords: { lat: number; lng: number }) => {
    _setUserLocation(coords);
  }, []);

  const setSuggestClinics = useCallback((v: boolean) => {
    _setSuggestClinics(v);
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        situation,
        sessionId,
        chatHistory,
        filters,
        userLocation,
        suggestClinics,
        setLanguage,
        setSituation,
        addMessage,
        setFilters,
        setUserLocation,
        setSuggestClinics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
