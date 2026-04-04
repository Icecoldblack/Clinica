import axios from 'axios';
import type { ChatMessage } from '../context/AppContext';

// Update with correct type path depending on where HospitalResult is stored.
import type { HospitalResult } from './insuranceService'; 

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ─── Triage Sessions ───
export interface TriageSession {
  sessionId: string;
  situation: string;              // "no_insurance" | "undocumented" | etc.
  language: string;               // "en" | "es"
  status: 'active' | 'completed';
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
  messages: ChatMessage[];        // full chat history
  // AI-generated fields (null until summarized)
  title: string | null;
  summary: string | null;
  severity: string | null;        // "low" | "moderate" | "high" | "crisis"
  tags: string[];
}

export interface SessionSummaryResponse {
  sessionId: string;
  title: string;
  summary: string;
  severity: string;
  tags: string[];
}

// ─── Saved Hospitals ───
export interface SavedHospital {
  hospital: HospitalResult;
  savedAt: string;                // ISO timestamp
}

// ─── API Calls ───
export async function summarizeSession(
  sessionId: string,
  language: string,
  situation: string,
  history: ChatMessage[],
): Promise<SessionSummaryResponse> {
  const { data } = await axios.post(`${BASE}/api/chat/summarize`, {
    sessionId,
    language,
    situation,
    history: history.map(m => ({ role: m.role, content: m.content })),
  });
  return data;
}

// ─── LocalStorage Helpers ───
const SESSIONS_KEY = 'clinica_sessions';
const SAVED_HOSPITALS_KEY = 'clinica_saved_hospitals';

export function loadSessions(): TriageSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveSessions(sessions: TriageSession[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function loadSavedHospitals(): SavedHospital[] {
  try {
    const raw = localStorage.getItem(SAVED_HOSPITALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveSavedHospitals(hospitals: SavedHospital[]): void {
  localStorage.setItem(SAVED_HOSPITALS_KEY, JSON.stringify(hospitals));
}
