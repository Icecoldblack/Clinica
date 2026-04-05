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
  estimatedWaitTime: string | null;
  matchScore: number;
  matchReason: string;
}

export interface HospitalSearchResponse {
  hospitals: HospitalResult[];
  searchLocation: string;
  insuranceProvider: string;
  planName: string | null;
  totalFound: number;
  totalInNetwork: number;
}

const FALLBACK_PROVIDERS: InsuranceProvider[] = [
  { name: 'Aetna', plans: ['Aetna PPO', 'Aetna HMO', 'Aetna Choice POS II', 'Aetna EPO', 'Aetna Open Access', 'Aetna Medicare Advantage'] },
  { name: 'Anthem / Blue Cross Blue Shield', plans: ['Anthem PPO', 'Anthem HMO', 'Anthem EPO', 'Anthem Blue Preferred POS', 'Anthem Blue Choice HMO', 'Anthem HealthKeepers'] },
  { name: 'Blue Cross Blue Shield (BCBS)', plans: ['BCBS PPO', 'BCBS HMO', 'BCBS Blue Preferred POS', 'BCBS Blue Choice HMO', 'BCBS High-Deductible (HDHP)', 'BCBS Federal Employee Program'] },
  { name: 'Cigna', plans: ['Cigna PPO', 'Cigna HMO', 'Cigna Open Access Plus', 'Cigna Connect HMO', 'Cigna LocalPlus', 'Cigna Medicare Advantage'] },
  { name: 'UnitedHealthcare', plans: ['UHC Choice Plus PPO', 'UHC Navigate HMO', 'UHC Core', 'UHC Options PPO', 'UHC Select Plus', 'UHC Medicare Advantage'] },
  { name: 'Humana', plans: ['Humana PPO', 'Humana HMO', 'Humana Gold Plus HMO', 'Humana Choice POS', 'Humana Medicare Advantage', 'Humana Dental/Vision'] },
  { name: 'Kaiser Permanente', plans: ['Kaiser HMO', 'Kaiser Bronze 60', 'Kaiser Silver 70', 'Kaiser Gold 80', 'Kaiser Senior Advantage'] },
  { name: 'Oscar Health', plans: ['Oscar Simple', 'Oscar Classic', 'Oscar Secure', 'Oscar Ultra'] },
  { name: 'Ambetter', plans: ['Ambetter Essential Care', 'Ambetter Balanced Care', 'Ambetter Select Care'] },
  { name: 'Molina Healthcare', plans: ['Molina Marketplace', 'Molina Medicaid', 'Molina Medicare'] },
  { name: 'WellCare', plans: ['WellCare Classic HMO', 'WellCare Value Plan', 'WellCare Medicare Advantage'] },
  { name: 'Medicaid', plans: ['Georgia Medicaid (Peach State Health)', 'Georgia Medicaid (Amerigroup)', 'Georgia Medicaid (CareSource)', 'Georgia Medicaid (Wellcare of Georgia)'] },
  { name: 'Medicare', plans: ['Medicare Part A (Hospital)', 'Medicare Part B (Medical)', 'Medicare Part C (Advantage)', 'Medicare Part D (Prescription)'] },
  { name: 'TRICARE', plans: ['TRICARE Prime', 'TRICARE Select', 'TRICARE For Life', 'TRICARE Young Adult'] },
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
