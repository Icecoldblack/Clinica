import axios from 'axios';
import type { ChatMessage } from '../context/AppContext';
import type { HospitalResult } from './insuranceService';

const API = import.meta.env.VITE_API_BASE_URL ?? '';

interface ChatPayload {
  sessionId: string;
  language: string;
  situation: string;
  history: { role: string; content: string }[];
  message: string;
  // User profile context
  age?: number;
  insuranceProvider?: string;
  planName?: string;
  zipCode?: string;
  lat?: number;
  lng?: number;
}

export interface ChatApiResponse {
  sessionId: string;
  response: string;
  suggestClinics: boolean;
  // Embedded hospital results (null when AI doesn't suggest care)
  hospitals: HospitalResult[] | null;
  detectedCondition: string | null;
  hospitalSearchContext: string | null;
  // The insurance actually used for the hospital search (may differ from profile)
  searchInsurance: string | null;
  searchPlan: string | null;
}

export async function sendMessage(
  sessionId: string,
  language: string,
  situation: string,
  history: ChatMessage[],
  newMessage: string,
  profile?: {
    age?: number;
    insuranceProvider?: string;
    planName?: string;
    zipCode?: string;
    lat?: number;
    lng?: number;
  }
): Promise<ChatApiResponse> {
  const payload: ChatPayload = {
    sessionId,
    language,
    situation,
    history: history.map((m) => ({ role: m.role, content: m.content })),
    message: newMessage,
    ...(profile || {}),
  };

  const res = await axios.post<ChatApiResponse>(`${API}/api/chat`, payload);
  return res.data;
}
