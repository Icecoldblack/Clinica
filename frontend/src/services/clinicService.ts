import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL ?? '';

export interface Clinic {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  isFqhc: boolean;        // mapped from backend 'fqhc' field
  acceptsUninsured: boolean;
  hasMentalHealth: boolean;
  distanceMiles: number;
  hoursDisplay: string;
}

interface ClinicApiResponse {
  clinics: Clinic[];
}

export async function getClinics(
  lat: number,
  lng: number,
  filters: { noInsurance: boolean; noDocuments: boolean; mentalHealth: boolean }
): Promise<Clinic[]> {
  const res = await axios.get<ClinicApiResponse>(`${API}/api/clinics`, {
    params: {
      lat,
      lng,
      noInsurance: filters.noInsurance,
      noDocuments: filters.noDocuments,
      mentalHealth: filters.mentalHealth,
    },
  });
  return res.data.clinics;
}
