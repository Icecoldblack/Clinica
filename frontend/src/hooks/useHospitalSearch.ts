import { useState, useCallback, useEffect } from 'react';
import { 
  getInsuranceProviders, 
  searchHospitals, 
  type InsuranceProvider, 
  type HospitalSearchResponse 
} from '../services/insuranceService';

export function useHospitalSearch() {
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [results, setResults] = useState<HospitalSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch providers on mount
  useEffect(() => {
    let mounted = true;
    getInsuranceProviders()
      .then((data) => {
        if (mounted) setProviders(data);
      })
      .catch((err) => {
        console.error('Failed to load insurance providers:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const search = useCallback(async (params: {
    zipCode?: string;
    lat?: number;
    lng?: number;
    insuranceProvider: string;
    planName?: string;
    radiusMiles?: number;
  }) => {
    setIsLoading(true);
    setIsEnriching(true); // Since Gemini enrichment is synchronous on the backend
    setError(null);
    try {
      const data = await searchHospitals(params);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search hospitals. Please try again.');
      setResults(null);
    } finally {
      setIsLoading(false);
      setIsEnriching(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    providers,
    results,
    isLoading,
    isEnriching,
    error,
    search,
    reset,
  };
}
