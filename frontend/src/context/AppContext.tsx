import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  TriageSession,
  SavedHospital,
  SessionSummaryResponse,
} from '../services/profileService';
import {
  loadSessions,
  saveSessions,
  loadSavedHospitals,
  saveSavedHospitals,
} from '../services/profileService';
import type { HospitalResult } from '../services/insuranceService';

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

const SITUATION_STORAGE_KEY = 'clinica_situation';

function isSituation(value: unknown): value is Situation {
  return value === 'no_insurance' || value === 'undocumented' || value === 'mental_health' || value === 'insured';
}

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

export interface InsuranceInfo {
  provider: string;
  planName: string;
  isCustom: boolean;
}

export interface AppState {
  language: 'en' | 'es';
  situation: Situation | null;
  sessionId: string;
  chatHistory: ChatMessage[];
  filters: Filters;
  userLocation: { lat: number; lng: number } | null;
  suggestClinics: boolean;
  insuranceInfo: InsuranceInfo | null;
  sessions: TriageSession[];
  savedHospitals: SavedHospital[];
}

interface AppContextType extends AppState {
  setLanguage: (lang: 'en' | 'es') => void;
  setSituation: (s: Situation) => void;
  addMessage: (msg: ChatMessage) => void;
  setFilters: (f: Filters) => void;
  setUserLocation: (coords: { lat: number; lng: number }) => void;
  setSuggestClinics: (v: boolean) => void;
  setInsuranceInfo: (info: InsuranceInfo | null) => void;
  saveSession: (session: TriageSession) => void;
  completeSession: (sessionId: string, summary: SessionSummaryResponse) => void;
  toggleSaveHospital: (hospital: HospitalResult) => void;
  isHospitalSaved: (hospitalId: string) => boolean;
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
  const [situation, _setSituation] = useState<Situation | null>(() => {
    try {
      const saved = localStorage.getItem(SITUATION_STORAGE_KEY);
      return isSituation(saved) ? saved : null;
    } catch {
      return null;
    }
  });
  const [sessionId] = useState(() => generateId());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [filters, _setFilters] = useState<Filters>(() => (
    situation ? SITUATION_FILTER_MAP[situation] : { noInsurance: false, noDocuments: false, mentalHealth: false }
  ));
  const [userLocation, _setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [suggestClinics, _setSuggestClinics] = useState(false);
  const [insuranceInfo, _setInsuranceInfo] = useState<InsuranceInfo | null>(() => {
    try {
      const saved = localStorage.getItem('clinica_insurance');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [sessions, _setSessions] = useState<TriageSession[]>(loadSessions);
  const [savedHospitals, _setSavedHospitals] = useState<SavedHospital[]>(loadSavedHospitals);

  const setLanguage = useCallback((lang: 'en' | 'es') => {
    _setLanguage(lang);
    i18n.changeLanguage(lang);
  }, [i18n]);

  const setSituation = useCallback((s: Situation) => {
    _setSituation(s);
    _setFilters(SITUATION_FILTER_MAP[s]);
    localStorage.setItem(SITUATION_STORAGE_KEY, s);
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

  const setInsuranceInfo = useCallback((info: InsuranceInfo | null) => {
    _setInsuranceInfo(info);
    if (info) {
      localStorage.setItem('clinica_insurance', JSON.stringify(info));
    } else {
      localStorage.removeItem('clinica_insurance');
    }
  }, []);

  const saveSession = useCallback((session: TriageSession) => {
    _setSessions(prev => {
      const idx = prev.findIndex(s => s.sessionId === session.sessionId);
      const newSessions = [...prev];
      if (idx >= 0) {
        newSessions[idx] = session;
      } else {
        newSessions.push(session);
      }
      saveSessions(newSessions);
      return newSessions;
    });
  }, []);

  const completeSession = useCallback((sessionId: string, summary: SessionSummaryResponse) => {
    _setSessions(prev => {
      const newSessions = prev.map(s => {
        if (s.sessionId === sessionId) {
          return {
            ...s,
            status: 'completed' as const,
            title: summary.title,
            summary: summary.summary,
            severity: summary.severity,
            tags: summary.tags,
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      });
      saveSessions(newSessions);
      return newSessions;
    });
  }, []);

  const toggleSaveHospital = useCallback((hospital: HospitalResult) => {
    _setSavedHospitals(prev => {
      const exists = prev.some(h => h.hospital.id === hospital.id);
      let newSaved;
      if (exists) {
        newSaved = prev.filter(h => h.hospital.id !== hospital.id);
      } else {
        newSaved = [...prev, { hospital, savedAt: new Date().toISOString() }];
      }
      saveSavedHospitals(newSaved);
      return newSaved;
    });
  }, []);

  const isHospitalSaved = useCallback((hospitalId: string) => {
    return savedHospitals.some(h => h.hospital.id === hospitalId);
  }, [savedHospitals]);

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
        insuranceInfo,
        sessions,
        savedHospitals,
        setLanguage,
        setSituation,
        addMessage,
        setFilters,
        setUserLocation,
        setSuggestClinics,
        setInsuranceInfo,
        saveSession,
        completeSession,
        toggleSaveHospital,
        isHospitalSaved,
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
