import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { getClinics, type Clinic } from '../services/clinicService';

export function useClinics() {
  const { filters, userLocation } = useAppContext();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClinics = useCallback(async () => {
    // Default to Atlanta if no user location
    const lat = userLocation?.lat ?? 33.749;
    const lng = userLocation?.lng ?? -84.388;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getClinics(lat, lng, filters);
      setClinics(data);
    } catch {
      setError('Failed to load clinics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, userLocation]);

  useEffect(() => {
    fetchClinics();
  }, [fetchClinics]);

  return { clinics, isLoading, error, refetch: fetchClinics };
}
