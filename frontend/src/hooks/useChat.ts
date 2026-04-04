import { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { sendMessage } from '../services/chatService';

export function useChat() {
  const { sessionId, language, situation, chatHistory, addMessage, setSuggestClinics } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (userText: string) => {
      if (!userText.trim() || !situation) return;

      // 1. Append user message
      const userMsg = {
        role: 'user' as const,
        content: userText.trim(),
        timestamp: new Date().toISOString(),
      };
      addMessage(userMsg);

      // 2. Send to backend
      setIsLoading(true);
      setError(null);

      try {
        const res = await sendMessage(sessionId, language, situation, chatHistory, userText.trim());

        // 3. Append model response
        const modelMsg = {
          role: 'model' as const,
          content: res.response,
          timestamp: new Date().toISOString(),
        };
        addMessage(modelMsg);

        // 4. Check suggestClinics flag
        if (res.suggestClinics) {
          setSuggestClinics(true);
        }
      } catch {
        setError('Failed to send message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, language, situation, chatHistory, addMessage, setSuggestClinics]
  );

  return { isLoading, error, sendMessage: send };
}
