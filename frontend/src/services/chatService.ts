import axios from 'axios';
import type { ChatMessage } from '../context/AppContext';

const API = import.meta.env.VITE_API_BASE_URL ?? '';

interface ChatPayload {
  sessionId: string;
  language: string;
  situation: string;
  history: { role: string; content: string }[];
  message: string;
}

interface ChatApiResponse {
  sessionId: string;
  response: string;
  suggestClinics: boolean;
}

export async function sendMessage(
  sessionId: string,
  language: string,
  situation: string,
  history: ChatMessage[],
  newMessage: string
): Promise<ChatApiResponse> {
  const payload: ChatPayload = {
    sessionId,
    language,
    situation,
    history: history.map((m) => ({ role: m.role, content: m.content })),
    message: newMessage,
  };

  const res = await axios.post<ChatApiResponse>(`${API}/api/chat`, payload);
  return res.data;
}
