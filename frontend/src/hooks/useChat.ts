import { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { sendMessage } from '../services/chatService';

export function useChat() {
  const {
    sessionId, language, situation, chatHistory, insuranceInfo, age, userLocation,
    addMessage, setSuggestClinics, saveSession, sessions, setChatHospitalResults,
  } = useAppContext();
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

      // 2. Send to backend with profile context
      setIsLoading(true);
      setError(null);

      try {
        const res = await sendMessage(
          sessionId, language, situation, chatHistory, userText.trim(),
          {
            age: age ?? undefined,
            insuranceProvider: insuranceInfo?.provider,
            planName: insuranceInfo?.planName,
            zipCode: undefined, // filled from userLocation
            lat: userLocation?.lat,
            lng: userLocation?.lng,
          }
        );

        // 3. Append model response
        const modelMsg = {
          role: 'model' as const,
          content: res.response,
          timestamp: new Date().toISOString(),
          hospitals: res.hospitals ?? undefined,
          detectedCondition: res.detectedCondition ?? undefined,
          hospitalSearchContext: res.hospitalSearchContext ?? undefined,
          searchInsurance: res.searchInsurance ?? undefined,
          searchPlan: res.searchPlan ?? undefined,
        };
        addMessage(modelMsg);

        // 4. Handle suggestClinics + embedded hospitals
        if (res.suggestClinics) {
          setSuggestClinics(true);
        }
        if (res.hospitals && res.hospitals.length > 0) {
          setChatHospitalResults(
            res.hospitals,
            res.hospitalSearchContext ?? null,
            res.searchInsurance ?? null,
            res.searchPlan ?? null
          );
        }

        const existingSession = sessions.find(s => s.sessionId === sessionId);
        const createdAt = existingSession?.createdAt || new Date().toISOString();

        saveSession({
          sessionId,
          situation: situation!,
          language,
          status: 'active',
          createdAt,
          updatedAt: new Date().toISOString(),
          messages: [...chatHistory, userMsg, modelMsg],
          title: existingSession?.title || null,
          summary: existingSession?.summary || null,
          severity: existingSession?.severity || null,
          tags: existingSession?.tags || [],
        });
      } catch {
        setError('Failed to send message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, language, situation, chatHistory, insuranceInfo, age, userLocation,
     addMessage, setSuggestClinics, saveSession, sessions, setChatHospitalResults]
  );

  return { isLoading, error, sendMessage: send };
}
