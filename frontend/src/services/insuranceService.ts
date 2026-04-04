import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface InsuranceProvider {
  name: string;
  plans: string[];
}

export interface HospitalResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  rating: number;
  userRatingsTotal: number;
  type: string;
  isOpenNow: boolean;
  distanceMiles: number;
  acceptsInsurance: boolean | null;
  insuranceNote: string | null;
  website: string | null;
  googleMapsUrl: string;
}

export interface HospitalSearchResponse {
  hospitals: HospitalResult[];
  searchLocation: string;
  insuranceProvider: string;
  planName: string | null;
  totalFound: number;
}

const FALLBACK_PROVIDERS: InsuranceProvider[] = [
  { name: 'Aetna', plans: ['HMO', 'PPO', 'EPO', 'Medicare Advantage', 'Medicaid'] },
  { name: 'Blue Cross Blue Shield', plans: ['HMO', 'PPO', 'EPO', 'Medicare Advantage'] },
  { name: 'Cigna', plans: ['HMO', 'PPO', 'EPO'] },
  { name: 'UnitedHealthcare', plans: ['HMO', 'PPO', 'Choice Plus', 'Medicare Advantage'] },
  { name: 'Humana', plans: ['HMO', 'PPO', 'Medicare Advantage'] },
  { name: 'Kaiser Permanente', plans: ['HMO', 'Medicare Advantage'] },
  { name: 'Self-pay', plans: [] }
];

export async function getInsuranceProviders(): Promise<InsuranceProvider[]> {
  try {
    const { data } = await axios.get(`${BASE}/api/insurance/providers`);
    return data.providers;
  } catch (err) {
    return FALLBACK_PROVIDERS;
  }
}

export async function searchHospitals(params: {
  zipCode?: string;
  lat?: number;
  lng?: number;
  insuranceProvider: string;
  planName?: string;
  radiusMiles?: number;
}): Promise<HospitalSearchResponse> {
  const { data } = await axios.post(`${BASE}/api/hospitals/search`, params);
  return data;
}
